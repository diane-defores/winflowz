import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SUITE_PRODUCT_ALLOWLIST = new Set([
  "winflowz_app",
  "winflowz_formation",
  "replayglowz",
  "tubeflow",
]);
const ACTIVE_ENTITLEMENT_STATUSES = new Set(["active", "trialing"]);
const REPLAYGLOWZ_PRODUCT_ID = "replayglowz";
const REPLAYGLOWZ_LEGACY_PRODUCT_IDS = ["tubeflow"];

function createGlobalUserId() {
  return `gu_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter((entry) => entry[1] !== undefined)
  ) as T;
}

function isAllowedSuiteProduct(productId: string): boolean {
  return SUITE_PRODUCT_ALLOWLIST.has(productId);
}

function isActiveAccessStatus(status: string): boolean {
  return ACTIVE_ENTITLEMENT_STATUSES.has(status);
}

function resolveReplayGlowzAccess(args: {
  globalUserId: string | null;
  entitlements: { productId: string; status: string }[];
  accountExists: boolean;
}) {
  if (!args.globalUserId) {
    return {
      hasAccess: false,
      globalUserId: null,
      matchedProductId: null,
      reasonCode: args.accountExists ? "global_user_not_found" : "account_not_found",
    };
  }

  const canonical = args.entitlements.find(
    (entry) =>
      entry.productId === REPLAYGLOWZ_PRODUCT_ID &&
      isActiveAccessStatus(entry.status)
  );
  if (canonical) {
    return {
      hasAccess: true,
      globalUserId: args.globalUserId,
      matchedProductId: REPLAYGLOWZ_PRODUCT_ID,
      reasonCode: "active_entitlement",
    };
  }

  const legacy = args.entitlements.find(
    (entry) =>
      REPLAYGLOWZ_LEGACY_PRODUCT_IDS.includes(entry.productId) &&
      isActiveAccessStatus(entry.status)
  );
  if (legacy) {
    return {
      hasAccess: true,
      globalUserId: args.globalUserId,
      matchedProductId: legacy.productId,
      reasonCode: "legacy_alias_entitlement",
    };
  }

  return {
    hasAccess: false,
    globalUserId: args.globalUserId,
    matchedProductId: null,
    reasonCode: "missing_product_entitlement",
  };
}

function maskProviderAccountId(value: string): string {
  if (value.length <= 6) {
    return `${value[0] ?? ""}***${value[value.length - 1] ?? ""}`;
  }

  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

export const upsertFirebaseIdentity = mutation({
  args: {
    firebaseUid: v.string(),
    firebaseEmail: v.optional(v.string()),
    environment: v.optional(v.string()),
    sourceRef: v.optional(v.string()),
    bridgeSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET;
    if (!configuredSecret) {
      throw new Error("bridge_secret_not_configured");
    }

    if (args.bridgeSecret !== configuredSecret) {
      throw new Error("bridge_secret_mismatch");
    }

    const now = Date.now();
    const environment = args.environment ?? "production";

    let identity = await ctx.db
      .query("identityAccounts")
      .withIndex("by_providerAccount", (q) =>
        q.eq("provider", "firebase").eq("providerAccountId", args.firebaseUid)
      )
      .first();

    let globalUserDocId = identity?.globalUserId;

    if (!globalUserDocId) {
      globalUserDocId = await ctx.db.insert(
        "globalUsers",
        withoutUndefined({
          globalUserId: createGlobalUserId(),
          primaryEmail: args.firebaseEmail,
          createdAt: now,
          updatedAt: now,
        })
      );

      await ctx.db.insert(
        "identityAccounts",
        withoutUndefined({
          globalUserId: globalUserDocId,
          provider: "firebase",
          providerAccountId: args.firebaseUid,
          email: args.firebaseEmail,
          source: "firebase_bridge_api",
          sourceRef: args.sourceRef,
          environment,
          createdAt: now,
          updatedAt: now,
        })
      );
    } else if (identity) {
      await ctx.db.patch(
        identity._id,
        withoutUndefined({
          email: args.firebaseEmail,
          environment,
          sourceRef: args.sourceRef,
          updatedAt: now,
        })
      );
    }

    identity = await ctx.db
      .query("identityAccounts")
      .withIndex("by_providerAccount", (q) =>
        q.eq("provider", "firebase").eq("providerAccountId", args.firebaseUid)
      )
      .first();

    if (!identity) {
      throw new Error("firebase_identity_link_failed");
    }

    const globalUser = await ctx.db.get(identity.globalUserId);
    if (!globalUser) {
      throw new Error("global_user_not_found");
    }

    if (args.firebaseEmail && !globalUser.primaryEmail) {
      await ctx.db.patch(globalUser._id, {
        primaryEmail: args.firebaseEmail,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(globalUser._id, {
        updatedAt: now,
      });
    }

    const rawEntitlements = await ctx.db
      .query("productEntitlements")
      .withIndex("by_globalUserId", (q) => q.eq("globalUserId", identity.globalUserId))
      .collect();

    const entitlements = rawEntitlements
      .filter((entry) => isAllowedSuiteProduct(entry.productId))
      .filter((entry) => isActiveAccessStatus(entry.status))
      .map((entry) => ({
        productId: entry.productId,
        status: entry.status,
        plan: entry.plan,
      }));

    return {
      status: "ok" as const,
      globalUserId: globalUser.globalUserId,
      accounts: [
        {
          provider: "firebase" as const,
          providerAccountIdMasked: maskProviderAccountId(identity.providerAccountId),
        },
      ],
      entitlements,
    };
  },
});

export const getEntitlementSnapshotByGlobalUser = query({
  args: {
    globalUserId: v.string(),
    bridgeSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET;
    if (!configuredSecret) {
      throw new Error("bridge_secret_not_configured");
    }

    if (args.bridgeSecret !== configuredSecret) {
      throw new Error("bridge_secret_mismatch");
    }

    const globalUser = await ctx.db
      .query("globalUsers")
      .withIndex("by_globalUserId", (q) => q.eq("globalUserId", args.globalUserId))
      .first();

    if (!globalUser) {
      throw new Error("global_user_not_found");
    }

    const accounts = await ctx.db
      .query("identityAccounts")
      .withIndex("by_globalUserId", (q) => q.eq("globalUserId", globalUser._id))
      .collect();

    const firebaseUids = [...new Set(
      accounts
        .filter((entry) => entry.provider === "firebase")
        .map((entry) => entry.providerAccountId)
    )];

    const rawEntitlements = await ctx.db
      .query("productEntitlements")
      .withIndex("by_globalUserId", (q) => q.eq("globalUserId", globalUser._id))
      .collect();

    const entitlements = rawEntitlements
      .filter((entry) => isAllowedSuiteProduct(entry.productId))
      .filter((entry) => isActiveAccessStatus(entry.status))
      .map((entry) => ({
        productId: entry.productId,
        status: entry.status,
        plan: entry.plan,
      }));

    return {
      status: "ok" as const,
      globalUserId: globalUser.globalUserId,
      firebaseUids,
      entitlements,
    };
  },
});

export const getReplayGlowzEntitlementSnapshotByClerkId = query({
  args: {
    clerkId: v.string(),
    bridgeSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET;
    if (!configuredSecret) {
      throw new Error("bridge_secret_not_configured");
    }

    if (args.bridgeSecret !== configuredSecret) {
      throw new Error("bridge_secret_mismatch");
    }

    const identity = await ctx.db
      .query("identityAccounts")
      .withIndex("by_providerAccount", (q) =>
        q.eq("provider", "clerk").eq("providerAccountId", args.clerkId)
      )
      .first();

    const compatibilityUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const globalUserDocId = identity?.globalUserId ?? compatibilityUser?.globalUserId;
    if (!globalUserDocId) {
      return resolveReplayGlowzAccess({
        globalUserId: null,
        entitlements: [],
        accountExists: Boolean(identity || compatibilityUser),
      });
    }

    const globalUser = await ctx.db.get(globalUserDocId);
    if (!globalUser) {
      return resolveReplayGlowzAccess({
        globalUserId: null,
        entitlements: [],
        accountExists: true,
      });
    }

    const rawEntitlements = await ctx.db
      .query("productEntitlements")
      .withIndex("by_globalUserId", (q) => q.eq("globalUserId", globalUserDocId))
      .collect();

    return resolveReplayGlowzAccess({
      globalUserId: globalUser.globalUserId,
      entitlements: rawEntitlements,
      accountExists: true,
    });
  },
});
