import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'

const SUITE_PRODUCT_ALLOWLIST = new Set([
  'winflowz_app',
  'winflowz_formation',
  'replayglowz',
  'tubeflow',
  'socialglowz',
])
const ACTIVE_ENTITLEMENT_STATUSES = new Set(['active', 'trialing'])
const REPLAYGLOWZ_PRODUCT_ID = 'replayglowz'
const REPLAYGLOWZ_LEGACY_PRODUCT_IDS = ['tubeflow']
const REPLAYGLOWZ_DEFAULT_FREE_PLAN = 'free'
const REPLAYGLOWZ_DEFAULT_FREE_SOURCE = 'product_default'
const SOCIALGLOWZ_PRODUCT_ID = 'socialglowz'
const SOCIALGLOWZ_PROVIDER = 'socialglowz_convex'
const SOCIALGLOWZ_BRIDGE_SOURCE = 'socialglowz_bridge_api'
const SOCIALGLOWZ_PLAN_ALLOWLIST = new Set(['lifetime_deal', 'founder_ltd', 'ltd'])
const SOCIALGLOWZ_SOURCE_ALLOWLIST = new Set([
  'manual',
  'partner',
  'appsumo',
  'direct',
  'legacy',
])

function createGlobalUserId() {
  return `gu_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter((entry) => entry[1] !== undefined)
  ) as T
}

function isAllowedSuiteProduct(productId: string): boolean {
  return SUITE_PRODUCT_ALLOWLIST.has(productId)
}

function isActiveAccessStatus(status: string): boolean {
  return ACTIVE_ENTITLEMENT_STATUSES.has(status)
}

function resolveReplayGlowzAccess(args: {
  globalUserId: string | null
  entitlements: { productId: string; status: string }[]
  accountExists: boolean
}) {
  if (!args.globalUserId) {
    return {
      hasAccess: false,
      globalUserId: null,
      matchedProductId: null,
      reasonCode: args.accountExists
        ? 'global_user_not_found'
        : 'account_not_found',
    }
  }

  const canonical = args.entitlements.find(
    (entry) =>
      entry.productId === REPLAYGLOWZ_PRODUCT_ID &&
      isActiveAccessStatus(entry.status)
  )
  if (canonical) {
    return {
      hasAccess: true,
      globalUserId: args.globalUserId,
      matchedProductId: REPLAYGLOWZ_PRODUCT_ID,
      reasonCode: 'active_entitlement',
    }
  }

  const legacy = args.entitlements.find(
    (entry) =>
      REPLAYGLOWZ_LEGACY_PRODUCT_IDS.includes(entry.productId) &&
      isActiveAccessStatus(entry.status)
  )
  if (legacy) {
    return {
      hasAccess: true,
      globalUserId: args.globalUserId,
      matchedProductId: legacy.productId,
      reasonCode: 'legacy_alias_entitlement',
    }
  }

  return {
    hasAccess: true,
    globalUserId: args.globalUserId,
    matchedProductId: REPLAYGLOWZ_PRODUCT_ID,
    reasonCode: 'default_free_entitlement',
  }
}

function replayGlowzDefaultFreeIdempotencyKey(globalUserId: string) {
  return `${REPLAYGLOWZ_DEFAULT_FREE_SOURCE}:${REPLAYGLOWZ_PRODUCT_ID}:${globalUserId}`
}

function requireBridgeSecret(providedSecret: string) {
  const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET
  if (!configuredSecret) {
    throw new Error('bridge_secret_not_configured')
  }
  if (providedSecret !== configuredSecret) {
    throw new Error('bridge_secret_mismatch')
  }
}

function normalizeActivationCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '-')
}

function isAllowedSocialGlowzPlan(planId: string) {
  return SOCIALGLOWZ_PLAN_ALLOWLIST.has(planId)
}

function isAllowedSocialGlowzSource(source: string) {
  return SOCIALGLOWZ_SOURCE_ALLOWLIST.has(source)
}

async function getOrCreateSocialGlowzIdentity(
  ctx: MutationCtx,
  args: {
    providerAccountId: string
    email?: string
    environment: string
    sourceRef?: string
  }
) {
  const now = Date.now()
  let identity = await ctx.db
    .query('identityAccounts')
    .withIndex('by_providerAccount', (q) =>
      q
        .eq('provider', SOCIALGLOWZ_PROVIDER)
        .eq('providerAccountId', args.providerAccountId)
    )
    .first()

  let globalUserDocId = identity?.globalUserId
  if (!globalUserDocId) {
    globalUserDocId = await ctx.db.insert(
      'globalUsers',
      withoutUndefined({
        globalUserId: createGlobalUserId(),
        primaryEmail: args.email,
        createdAt: now,
        updatedAt: now,
      })
    )

    await ctx.db.insert(
      'identityAccounts',
      withoutUndefined({
        globalUserId: globalUserDocId,
        provider: SOCIALGLOWZ_PROVIDER,
        providerAccountId: args.providerAccountId,
        email: args.email,
        source: SOCIALGLOWZ_BRIDGE_SOURCE,
        sourceRef: args.sourceRef,
        environment: args.environment,
        createdAt: now,
        updatedAt: now,
      })
    )

    identity = await ctx.db
      .query('identityAccounts')
      .withIndex('by_providerAccount', (q) =>
        q
          .eq('provider', SOCIALGLOWZ_PROVIDER)
          .eq('providerAccountId', args.providerAccountId)
      )
      .first()
  } else if (identity) {
    await ctx.db.patch(
      identity._id,
      withoutUndefined({
        email: args.email,
        sourceRef: args.sourceRef,
        environment: args.environment,
        updatedAt: now,
      })
    )
  }

  if (!identity) {
    throw new Error('social_identity_link_failed')
  }

  const globalUser = await ctx.db.get(globalUserDocId as Id<'globalUsers'>)
  if (!globalUser) {
    throw new Error('global_user_not_found')
  }

  await ctx.db.patch(
    globalUser._id,
    withoutUndefined({
      primaryEmail: globalUser.primaryEmail ?? args.email,
      updatedAt: now,
    })
  )

  return { identity, globalUserDocId: globalUser._id, globalUser }
}

function resolveSocialGlowzAccess(args: {
  globalUserId: string
  entitlements: { productId: string; status: string; plan: string; source: string }[]
}) {
  const entitlement = args.entitlements.find(
    (entry) =>
      entry.productId === SOCIALGLOWZ_PRODUCT_ID &&
      isActiveAccessStatus(entry.status)
  )

  if (!entitlement) {
    return {
      hasAccess: false,
      globalUserId: args.globalUserId,
      planId: null,
      source: null,
      reasonCode: 'missing_product_entitlement' as const,
    }
  }

  return {
    hasAccess: true,
    globalUserId: args.globalUserId,
    planId: entitlement.plan,
    source: entitlement.source,
    reasonCode: 'active_entitlement' as const,
  }
}

function maskProviderAccountId(value: string): string {
  if (value.length <= 6) {
    return `${value[0] ?? ''}***${value[value.length - 1] ?? ''}`
  }

  return `${value.slice(0, 3)}***${value.slice(-3)}`
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
    const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET
    if (!configuredSecret) {
      throw new Error('bridge_secret_not_configured')
    }

    if (args.bridgeSecret !== configuredSecret) {
      throw new Error('bridge_secret_mismatch')
    }

    const now = Date.now()
    const environment = args.environment ?? 'production'

    let identity = await ctx.db
      .query('identityAccounts')
      .withIndex('by_providerAccount', (q) =>
        q.eq('provider', 'firebase').eq('providerAccountId', args.firebaseUid)
      )
      .first()

    let globalUserDocId = identity?.globalUserId

    if (!globalUserDocId) {
      globalUserDocId = await ctx.db.insert(
        'globalUsers',
        withoutUndefined({
          globalUserId: createGlobalUserId(),
          primaryEmail: args.firebaseEmail,
          createdAt: now,
          updatedAt: now,
        })
      )

      await ctx.db.insert(
        'identityAccounts',
        withoutUndefined({
          globalUserId: globalUserDocId,
          provider: 'firebase',
          providerAccountId: args.firebaseUid,
          email: args.firebaseEmail,
          source: 'firebase_bridge_api',
          sourceRef: args.sourceRef,
          environment,
          createdAt: now,
          updatedAt: now,
        })
      )
    } else if (identity) {
      await ctx.db.patch(
        identity._id,
        withoutUndefined({
          email: args.firebaseEmail,
          environment,
          sourceRef: args.sourceRef,
          updatedAt: now,
        })
      )
    }

    identity = await ctx.db
      .query('identityAccounts')
      .withIndex('by_providerAccount', (q) =>
        q.eq('provider', 'firebase').eq('providerAccountId', args.firebaseUid)
      )
      .first()

    if (!identity) {
      throw new Error('firebase_identity_link_failed')
    }

    const globalUser = await ctx.db.get(identity.globalUserId)
    if (!globalUser) {
      throw new Error('global_user_not_found')
    }

    if (args.firebaseEmail && !globalUser.primaryEmail) {
      await ctx.db.patch(globalUser._id, {
        primaryEmail: args.firebaseEmail,
        updatedAt: now,
      })
    } else {
      await ctx.db.patch(globalUser._id, {
        updatedAt: now,
      })
    }

    const rawEntitlements = await ctx.db
      .query('productEntitlements')
      .withIndex('by_globalUserId', (q) =>
        q.eq('globalUserId', identity.globalUserId)
      )
      .collect()

    const entitlements = rawEntitlements
      .filter((entry) => isAllowedSuiteProduct(entry.productId))
      .filter((entry) => isActiveAccessStatus(entry.status))
      .map((entry) => ({
        productId: entry.productId,
        status: entry.status,
        plan: entry.plan,
      }))

    return {
      status: 'ok' as const,
      globalUserId: globalUser.globalUserId,
      accounts: [
        {
          provider: 'firebase' as const,
          providerAccountIdMasked: maskProviderAccountId(
            identity.providerAccountId
          ),
        },
      ],
      entitlements,
    }
  },
})

export const getEntitlementSnapshotByGlobalUser = query({
  args: {
    globalUserId: v.string(),
    bridgeSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET
    if (!configuredSecret) {
      throw new Error('bridge_secret_not_configured')
    }

    if (args.bridgeSecret !== configuredSecret) {
      throw new Error('bridge_secret_mismatch')
    }

    const globalUser = await ctx.db
      .query('globalUsers')
      .withIndex('by_globalUserId', (q) =>
        q.eq('globalUserId', args.globalUserId)
      )
      .first()

    if (!globalUser) {
      throw new Error('global_user_not_found')
    }

    const accounts = await ctx.db
      .query('identityAccounts')
      .withIndex('by_globalUserId', (q) => q.eq('globalUserId', globalUser._id))
      .collect()

    const firebaseUids = [
      ...new Set(
        accounts
          .filter((entry) => entry.provider === 'firebase')
          .map((entry) => entry.providerAccountId)
      ),
    ]

    const rawEntitlements = await ctx.db
      .query('productEntitlements')
      .withIndex('by_globalUserId', (q) => q.eq('globalUserId', globalUser._id))
      .collect()

    const entitlements = rawEntitlements
      .filter((entry) => isAllowedSuiteProduct(entry.productId))
      .filter((entry) => isActiveAccessStatus(entry.status))
      .map((entry) => ({
        productId: entry.productId,
        status: entry.status,
        plan: entry.plan,
      }))

    return {
      status: 'ok' as const,
      globalUserId: globalUser.globalUserId,
      firebaseUids,
      entitlements,
    }
  },
})

export const getReplayGlowzEntitlementSnapshotByClerkId = query({
  args: {
    clerkId: v.string(),
    bridgeSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET
    if (!configuredSecret) {
      throw new Error('bridge_secret_not_configured')
    }

    if (args.bridgeSecret !== configuredSecret) {
      throw new Error('bridge_secret_mismatch')
    }

    const identity = await ctx.db
      .query('identityAccounts')
      .withIndex('by_providerAccount', (q) =>
        q.eq('provider', 'clerk').eq('providerAccountId', args.clerkId)
      )
      .first()

    const compatibilityUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()

    const globalUserDocId =
      identity?.globalUserId ?? compatibilityUser?.globalUserId
    if (!globalUserDocId) {
      return resolveReplayGlowzAccess({
        globalUserId: null,
        entitlements: [],
        accountExists: Boolean(identity || compatibilityUser),
      })
    }

    const globalUser = await ctx.db.get(globalUserDocId)
    if (!globalUser) {
      return resolveReplayGlowzAccess({
        globalUserId: null,
        entitlements: [],
        accountExists: true,
      })
    }

    const rawEntitlements = await ctx.db
      .query('productEntitlements')
      .withIndex('by_globalUserId', (q) =>
        q.eq('globalUserId', globalUserDocId)
      )
      .collect()

    return resolveReplayGlowzAccess({
      globalUserId: globalUser.globalUserId,
      entitlements: rawEntitlements,
      accountExists: true,
    })
  },
})

export const ensureReplayGlowzEntitlementSnapshotByClerkId = mutation({
  args: {
    clerkId: v.string(),
    bridgeSecret: v.string(),
    environment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const configuredSecret = process.env.SUITE_BRIDGE_CONVEX_SECRET
    if (!configuredSecret) {
      throw new Error('bridge_secret_not_configured')
    }

    if (args.bridgeSecret !== configuredSecret) {
      throw new Error('bridge_secret_mismatch')
    }

    const identity = await ctx.db
      .query('identityAccounts')
      .withIndex('by_providerAccount', (q) =>
        q.eq('provider', 'clerk').eq('providerAccountId', args.clerkId)
      )
      .first()

    const compatibilityUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first()

    const globalUserDocId =
      identity?.globalUserId ?? compatibilityUser?.globalUserId
    if (!globalUserDocId) {
      return resolveReplayGlowzAccess({
        globalUserId: null,
        entitlements: [],
        accountExists: Boolean(identity || compatibilityUser),
      })
    }

    const globalUser = await ctx.db.get(globalUserDocId)
    if (!globalUser) {
      return resolveReplayGlowzAccess({
        globalUserId: null,
        entitlements: [],
        accountExists: true,
      })
    }

    const rawEntitlements = await ctx.db
      .query('productEntitlements')
      .withIndex('by_globalUserId', (q) =>
        q.eq('globalUserId', globalUserDocId)
      )
      .collect()

    const currentSnapshot = resolveReplayGlowzAccess({
      globalUserId: globalUser.globalUserId,
      entitlements: rawEntitlements,
      accountExists: true,
    })
    if (currentSnapshot.reasonCode !== 'default_free_entitlement') {
      return currentSnapshot
    }

    const now = Date.now()
    const environment = args.environment ?? 'production'
    const idempotencyKey = replayGlowzDefaultFreeIdempotencyKey(
      globalUser.globalUserId
    )
    const existingDefaultEntitlement = rawEntitlements.find(
      (entry) => entry.idempotencyKey === idempotencyKey
    )

    if (existingDefaultEntitlement) {
      if (
        existingDefaultEntitlement.status !== 'active' ||
        existingDefaultEntitlement.plan !== REPLAYGLOWZ_DEFAULT_FREE_PLAN
      ) {
        await ctx.db.patch(existingDefaultEntitlement._id, {
          productId: REPLAYGLOWZ_PRODUCT_ID,
          plan: REPLAYGLOWZ_DEFAULT_FREE_PLAN,
          status: 'active',
          source: REPLAYGLOWZ_DEFAULT_FREE_SOURCE,
          sourceRef: args.clerkId,
          environment,
          grantedAt: existingDefaultEntitlement.grantedAt ?? now,
          updatedAt: now,
        })
      }
    } else {
      await ctx.db.insert('productEntitlements', {
        globalUserId: globalUserDocId,
        productId: REPLAYGLOWZ_PRODUCT_ID,
        plan: REPLAYGLOWZ_DEFAULT_FREE_PLAN,
        status: 'active',
        source: REPLAYGLOWZ_DEFAULT_FREE_SOURCE,
        sourceRef: args.clerkId,
        environment,
        idempotencyKey,
        grantedAt: now,
        createdAt: now,
        updatedAt: now,
      })
    }

    const existingGrantEvent = await ctx.db
      .query('productAccessEvents')
      .withIndex('by_idempotencyKey', (q) =>
        q.eq('idempotencyKey', idempotencyKey)
      )
      .first()
    if (!existingGrantEvent) {
      await ctx.db.insert('productAccessEvents', {
        source: REPLAYGLOWZ_DEFAULT_FREE_SOURCE,
        eventType: 'default_free.granted',
        sourceRef: args.clerkId,
        idempotencyKey,
        environment,
        productId: REPLAYGLOWZ_PRODUCT_ID,
        globalUserId: globalUserDocId,
        status: 'granted',
        createdAt: now,
      })
    }

    return {
      hasAccess: true,
      globalUserId: globalUser.globalUserId,
      matchedProductId: REPLAYGLOWZ_PRODUCT_ID,
      reasonCode: 'default_free_entitlement',
    }
  },
})

export const ensureSocialGlowzEntitlementSnapshotByProviderAccount = mutation({
  args: {
    providerAccountId: v.string(),
    email: v.optional(v.string()),
    environment: v.optional(v.string()),
    sourceRef: v.optional(v.string()),
    bridgeSecret: v.string(),
  },
  handler: async (ctx, args) => {
    requireBridgeSecret(args.bridgeSecret)

    const environment = args.environment ?? 'production'
    const providerAccountId = args.providerAccountId.trim()
    if (!providerAccountId) {
      throw new Error('provider_account_id_required')
    }

    const { globalUser, globalUserDocId } = await getOrCreateSocialGlowzIdentity(
      ctx,
      {
        providerAccountId,
        email: args.email,
        environment,
        sourceRef: args.sourceRef,
      }
    )

    const rawEntitlements = await ctx.db
      .query('productEntitlements')
      .withIndex('by_globalUserId', (q) => q.eq('globalUserId', globalUserDocId))
      .collect()

    return resolveSocialGlowzAccess({
      globalUserId: globalUser.globalUserId,
      entitlements: rawEntitlements,
    })
  },
})

export const upsertSocialGlowzActivationCode = mutation({
  args: {
    bridgeSecret: v.string(),
    code: v.string(),
    plan: v.optional(v.string()),
    source: v.optional(v.string()),
    status: v.optional(v.union(v.literal('available'), v.literal('disabled'))),
    sourceRef: v.optional(v.string()),
    environment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireBridgeSecret(args.bridgeSecret)

    const codeNormalized = normalizeActivationCode(args.code)
    if (!codeNormalized) {
      throw new Error('code_required')
    }

    const plan = args.plan ?? 'lifetime_deal'
    if (!isAllowedSocialGlowzPlan(plan)) {
      throw new Error('plan_not_allowed')
    }

    const source = args.source ?? 'manual'
    if (!isAllowedSocialGlowzSource(source)) {
      throw new Error('source_not_allowed')
    }

    const now = Date.now()
    const environment = args.environment ?? 'production'
    const idempotencyKey = `socialglowz_code:${codeNormalized}`
    const existing = await ctx.db
      .query('productActivationCodes')
      .withIndex('by_codeNormalized', (q) => q.eq('codeNormalized', codeNormalized))
      .unique()

    if (existing?.status === 'redeemed') {
      throw new Error('code_already_redeemed')
    }

    const payload = withoutUndefined({
      codeNormalized,
      productId: SOCIALGLOWZ_PRODUCT_ID,
      plan,
      source,
      status: args.status ?? 'available',
      sourceRef: args.sourceRef,
      environment,
      idempotencyKey,
      updatedAt: now,
    })

    if (existing) {
      await ctx.db.patch(existing._id, payload)
      return { created: false, codeId: existing._id }
    }

    const codeId = await ctx.db.insert('productActivationCodes', {
      ...payload,
      createdAt: now,
    })

    return { created: true, codeId }
  },
})

export const redeemSocialGlowzActivationCodeByProviderAccount = mutation({
  args: {
    providerAccountId: v.string(),
    email: v.optional(v.string()),
    code: v.string(),
    bridgeSecret: v.string(),
    environment: v.optional(v.string()),
    sourceRef: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireBridgeSecret(args.bridgeSecret)

    const providerAccountId = args.providerAccountId.trim()
    if (!providerAccountId) {
      throw new Error('provider_account_id_required')
    }

    const codeNormalized = normalizeActivationCode(args.code)
    if (!codeNormalized) {
      throw new Error('code_required')
    }

    const environment = args.environment ?? 'production'
    const { globalUser, globalUserDocId } = await getOrCreateSocialGlowzIdentity(
      ctx,
      {
        providerAccountId,
        email: args.email,
        environment,
        sourceRef: args.sourceRef,
      }
    )

    const codeDoc = await ctx.db
      .query('productActivationCodes')
      .withIndex('by_codeNormalized', (q) => q.eq('codeNormalized', codeNormalized))
      .unique()
    if (!codeDoc) {
      throw new Error('code_not_found')
    }
    if (codeDoc.productId !== SOCIALGLOWZ_PRODUCT_ID) {
      throw new Error('product_not_allowed')
    }
    if (!isAllowedSocialGlowzPlan(codeDoc.plan)) {
      throw new Error('plan_not_allowed')
    }
    if (!isAllowedSocialGlowzSource(codeDoc.source)) {
      throw new Error('source_not_allowed')
    }
    if (codeDoc.status === 'disabled') {
      throw new Error('code_disabled')
    }

    const now = Date.now()
    const sameUserCode =
      codeDoc.status === 'redeemed' && codeDoc.redeemedByGlobalUserId === globalUserDocId
    if (codeDoc.status === 'redeemed' && !sameUserCode) {
      throw new Error('code_already_used')
    }

    const entitlementIdempotencyKey = `socialglowz_redeem:${globalUser.globalUserId}:${codeNormalized}`
    const existingEntitlement = await ctx.db
      .query('productEntitlements')
      .withIndex('by_idempotencyKey', (q) =>
        q.eq('idempotencyKey', entitlementIdempotencyKey)
      )
      .first()

    let entitlementId = existingEntitlement?._id
    if (!existingEntitlement) {
      entitlementId = await ctx.db.insert('productEntitlements', {
        globalUserId: globalUserDocId,
        productId: SOCIALGLOWZ_PRODUCT_ID,
        plan: codeDoc.plan,
        status: 'active',
        source: codeDoc.source,
        sourceRef: args.sourceRef ?? codeDoc.sourceRef ?? codeDoc.codeNormalized,
        environment,
        idempotencyKey: entitlementIdempotencyKey,
        grantedAt: now,
        createdAt: now,
        updatedAt: now,
      })
    } else {
      await ctx.db.patch(existingEntitlement._id, {
        productId: SOCIALGLOWZ_PRODUCT_ID,
        plan: codeDoc.plan,
        status: 'active',
        source: codeDoc.source,
        sourceRef: args.sourceRef ?? codeDoc.sourceRef ?? existingEntitlement.sourceRef,
        environment,
        grantedAt: existingEntitlement.grantedAt ?? now,
        updatedAt: now,
      })
    }

    if (!sameUserCode) {
      await ctx.db.patch(codeDoc._id, {
        status: 'redeemed',
        redeemedByGlobalUserId: globalUserDocId,
        redeemedEntitlementId: entitlementId,
        redeemedAt: now,
        updatedAt: now,
      })
    }

    const accessEventIdempotencyKey = `socialglowz_redeem_event:${globalUser.globalUserId}:${codeNormalized}`
    const existingEvent = await ctx.db
      .query('productAccessEvents')
      .withIndex('by_idempotencyKey', (q) =>
        q.eq('idempotencyKey', accessEventIdempotencyKey)
      )
      .first()

    if (!existingEvent) {
      await ctx.db.insert('productAccessEvents', {
        source: codeDoc.source,
        eventType: 'activation_code.redeemed',
        sourceRef: args.sourceRef ?? codeDoc.sourceRef ?? codeDoc.codeNormalized,
        idempotencyKey: accessEventIdempotencyKey,
        environment,
        productId: SOCIALGLOWZ_PRODUCT_ID,
        globalUserId: globalUserDocId,
        status: 'granted',
        createdAt: now,
      })
    }

    const rawEntitlements = await ctx.db
      .query('productEntitlements')
      .withIndex('by_globalUserId', (q) => q.eq('globalUserId', globalUserDocId))
      .collect()

    return {
      ...resolveSocialGlowzAccess({
        globalUserId: globalUser.globalUserId,
        entitlements: rawEntitlements,
      }),
      alreadyRedeemed: sameUserCode,
      codeStatus: sameUserCode ? 'already_redeemed' : 'redeemed',
    }
  },
})
