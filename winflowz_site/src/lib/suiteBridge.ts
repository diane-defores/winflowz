export const SUITE_PRODUCT_ALLOWLIST = [
  'winflowz_app',
  'winflowz_formation',
  'replayglowz',
  'tubeflow',
  'socialglowz',
] as const

export const REPLAYGLOWZ_PRODUCT_ID = 'replayglowz'
export const SOCIALGLOWZ_PRODUCT_ID = 'socialglowz'
export const REPLAYGLOWZ_LEGACY_PRODUCT_IDS = ['tubeflow'] as const
export const SOCIALGLOWZ_DEFAULT_PLAN = 'lifetime_deal' as const
export const SOCIALGLOWZ_ALLOWED_PLANS = [
  'lifetime_deal',
  'founder_ltd',
  'ltd',
] as const
export const SOCIALGLOWZ_ALLOWED_SOURCES = [
  'manual',
  'partner',
  'appsumo',
  'direct',
  'legacy',
] as const

const ACTIVE_ENTITLEMENT_STATUSES = new Set(['active', 'trialing'])
const FIRESTORE_ENTITLEMENT_PRODUCTS = ['winflowz_app'] as const

type BridgeEntitlement = {
  productId: string
  status: string
  plan?: string | null
  source?: string | null
}
const ALLOWED_PRODUCT_SET = new Set<string>(SUITE_PRODUCT_ALLOWLIST)

export type BridgeEntitlementSnapshot = {
  productId: string
  plan: string
  status: string
}

export type ReplayGlowzEntitlementReasonCode =
  | 'active_entitlement'
  | 'legacy_alias_entitlement'
  | 'default_free_entitlement'
  | 'missing_product_entitlement'
  | 'account_not_found'
  | 'global_user_not_found'

export type ReplayGlowzEntitlementSnapshot = {
  hasAccess: boolean
  globalUserId: string | null
  matchedProductId: string | null
  reasonCode: ReplayGlowzEntitlementReasonCode
}

export type SocialGlowzEntitlementReasonCode =
  | 'active_entitlement'
  | 'account_not_found'
  | 'global_user_not_found'
  | 'code_not_found'
  | 'code_disabled'
  | 'code_used'
  | 'code_import_failed'
  | 'code_redeem_failed'
  | 'plan_not_allowed'
  | 'source_not_allowed'

export type SocialGlowzEntitlementSnapshot = {
  hasAccess: boolean
  planId: string | null
  source: string | null
  globalUserId: string | null
  reasonCode: SocialGlowzEntitlementReasonCode
}

const SOCIALGLOWZ_SOURCE_SET = new Set<string>(SOCIALGLOWZ_ALLOWED_SOURCES)
const SOCIALGLOWZ_PLAN_SET = new Set<string>(SOCIALGLOWZ_ALLOWED_PLANS)

export function isAllowedSuiteProduct(productId: string): boolean {
  return ALLOWED_PRODUCT_SET.has(productId)
}

export function isActiveAccessStatus(status: string): boolean {
  return ACTIVE_ENTITLEMENT_STATUSES.has(status)
}

export function hasActiveEntitlement(
  entitlements: BridgeEntitlement[],
  productId: string
): boolean {
  return entitlements.some(
    (entry) =>
      entry.productId === productId && isActiveAccessStatus(entry.status)
  )
}

export function isAllowedSocialGlowzPlan(planId: string): boolean {
  return SOCIALGLOWZ_PLAN_SET.has(planId)
}

export function isAllowedSocialGlowzSource(source: string): boolean {
  return SOCIALGLOWZ_SOURCE_SET.has(source)
}

export function resolveSocialGlowzEntitlementSnapshot({
  globalUserId,
  entitlements,
}: {
  globalUserId: string | null
  entitlements: BridgeEntitlement[]
}): SocialGlowzEntitlementSnapshot {
  const socialEntitlement = entitlements.find(
    (entry) =>
      entry.productId === SOCIALGLOWZ_PRODUCT_ID &&
      isActiveAccessStatus(entry.status)
  )
  if (!globalUserId) {
    return {
      hasAccess: false,
      planId: null,
      source: null,
      globalUserId: null,
      reasonCode: 'account_not_found',
    }
  }

  if (!socialEntitlement) {
    return {
      hasAccess: false,
      planId: null,
      source: null,
      globalUserId,
      reasonCode: 'global_user_not_found',
    }
  }

  return {
    hasAccess: true,
    planId: socialEntitlement.plan ?? SOCIALGLOWZ_DEFAULT_PLAN,
    source: socialEntitlement.source ?? null,
    globalUserId,
    reasonCode: 'active_entitlement',
  }
}

export function resolveReplayGlowzEntitlementSnapshot({
  globalUserId,
  entitlements,
  accountExists = true,
}: {
  globalUserId: string | null
  entitlements: BridgeEntitlement[]
  accountExists?: boolean
}): ReplayGlowzEntitlementSnapshot {
  if (!globalUserId) {
    return {
      hasAccess: false,
      globalUserId: null,
      matchedProductId: null,
      reasonCode: accountExists ? 'global_user_not_found' : 'account_not_found',
    }
  }

  const canonical = entitlements.find(
    (entry) =>
      entry.productId === REPLAYGLOWZ_PRODUCT_ID &&
      isActiveAccessStatus(entry.status)
  )
  if (canonical) {
    return {
      hasAccess: true,
      globalUserId,
      matchedProductId: REPLAYGLOWZ_PRODUCT_ID,
      reasonCode: 'active_entitlement',
    }
  }

  const legacy = entitlements.find(
    (entry) =>
      (REPLAYGLOWZ_LEGACY_PRODUCT_IDS as readonly string[]).includes(
        entry.productId
      ) && isActiveAccessStatus(entry.status)
  )
  if (legacy) {
    return {
      hasAccess: true,
      globalUserId,
      matchedProductId: legacy.productId,
      reasonCode: 'legacy_alias_entitlement',
    }
  }

  return {
    hasAccess: true,
    globalUserId,
    matchedProductId: REPLAYGLOWZ_PRODUCT_ID,
    reasonCode: 'default_free_entitlement',
  }
}

export function buildFirestoreSuiteAccessMirror({
  globalUserId,
  entitlements,
}: {
  globalUserId: string
  entitlements: BridgeEntitlement[]
}) {
  const products = Object.fromEntries(
    FIRESTORE_ENTITLEMENT_PRODUCTS.map((productId) => {
      const entitlement = entitlements.find(
        (entry) =>
          entry.productId === productId && isActiveAccessStatus(entry.status)
      )

      return [
        productId,
        {
          active: entitlement != null,
          status: entitlement?.status ?? 'inactive',
          plan: entitlement?.plan ?? null,
        },
      ]
    })
  )

  return {
    globalUserId,
    products,
  }
}

export function maskProviderAccountId(value: string): string {
  if (value.length <= 6) {
    return `${value[0] ?? ''}***${value[value.length - 1] ?? ''}`
  }

  return `${value.slice(0, 3)}***${value.slice(-3)}`
}

export function getBearerTokenFromAuthorizationHeader(
  authorizationHeader: string | null
): string | null {
  if (!authorizationHeader) {
    return null
  }

  const parts = authorizationHeader.trim().split(/\s+/)
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer' || !parts[1]) {
    return null
  }

  return parts[1]
}

type FirebaseIdTokenClaimsLike = {
  aud?: unknown
  iss?: unknown
  sub?: unknown
  uid?: unknown
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isTrustedFirebaseIdTokenClaims(
  claims: FirebaseIdTokenClaimsLike,
  projectId: string
): boolean {
  const expectedIssuer = `https://securetoken.google.com/${projectId}`
  const subject = claims.sub ?? claims.uid

  return (
    isNonEmptyString(projectId) &&
    claims.aud === projectId &&
    claims.iss === expectedIssuer &&
    isNonEmptyString(subject)
  )
}

export function resolveBridgeEnvironment(nodeEnv: string | undefined): string {
  if (nodeEnv === 'development' || nodeEnv === 'test') {
    return nodeEnv
  }
  return 'production'
}

function cleanSecret(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function getBridgeEndpointSecret(
  env: Record<string, string | undefined>
): string | null {
  return (
    cleanSecret(env.SUITE_BRIDGE_SYNC_SECRET) ??
    cleanSecret(env.SUITE_BRIDGE_CONVEX_SECRET)
  )
}

export function getConvexBridgeSecret(
  env: Record<string, string | undefined>
): string | null {
  return cleanSecret(env.SUITE_BRIDGE_CONVEX_SECRET)
}

export function getSuiteEntitlementVerifySecret(
  env: Record<string, string | undefined>
): string | null {
  return cleanSecret(env.SUITE_ENTITLEMENT_VERIFY_SECRET)
}

export function getSocialGlowzBridgeSecret(
  env: Record<string, string | undefined>
): string | null {
  return (
    cleanSecret(env.SOCIALGLOWZ_SUITE_BRIDGE_SECRET) ??
    cleanSecret(env.SUITE_SOCIALGLOWZ_BRIDGE_SECRET)
  )
}

export function isValidGlobalUserId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function parseSyncRequestBody(
  body: unknown
): { globalUserId: string } | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const globalUserId = (body as Record<string, unknown>).globalUserId
  if (!isValidGlobalUserId(globalUserId)) {
    return null
  }

  return { globalUserId: globalUserId.trim() }
}
