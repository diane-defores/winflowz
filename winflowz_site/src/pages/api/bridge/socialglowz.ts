import type { APIRoute } from 'astro'
import { ConvexHttpClient } from 'convex/browser'
import { getServerEnv } from '@/lib/serverEnv'
import { getConvexBridgeSecret, getSocialGlowzBridgeSecret } from '@/lib/suiteBridge'

export const prerender = false

const JSON_HEADERS = { 'Content-Type': 'application/json' }
const SOCIAL_BRIDGE_SECRET_HEADER = 'x-socialglowz-suite-secret'

type SocialGlowzSnapshotRequest = {
  operation: 'snapshot'
  providerAccountId: string
  email?: string
  sourceRef?: string
}

type SocialGlowzRedeemRequest = {
  operation: 'redeem_code'
  providerAccountId: string
  code: string
  email?: string
  sourceRef?: string
}

type SocialGlowzBridgeRequest =
  | SocialGlowzSnapshotRequest
  | SocialGlowzRedeemRequest

function jsonResponse(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS })
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function parseSocialGlowzRequest(body: unknown): SocialGlowzBridgeRequest | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const payload = body as Record<string, unknown>
  const operation = asNonEmptyString(payload.operation)
  const providerAccountId = asNonEmptyString(payload.providerAccountId)

  if (!operation || !providerAccountId) {
    return null
  }

  const email = asNonEmptyString(payload.email) ?? undefined
  const sourceRef = asNonEmptyString(payload.sourceRef) ?? undefined

  if (operation === 'snapshot') {
    return {
      operation: 'snapshot',
      providerAccountId,
      email,
      sourceRef,
    }
  }

  if (operation === 'redeem_code') {
    const code = asNonEmptyString(payload.code)
    if (!code) {
      return null
    }

    return {
      operation: 'redeem_code',
      providerAccountId,
      code,
      email,
      sourceRef,
    }
  }

  return null
}

function mapBridgeError(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (!message) return 'bridge_operation_failed'
  if (/bridge_secret_mismatch/i.test(message)) return 'bridge_secret_mismatch'
  if (/bridge_secret_not_configured/i.test(message))
    return 'bridge_secret_not_configured'
  if (/code_not_found/i.test(message)) return 'code_not_found'
  if (/code_disabled/i.test(message)) return 'code_disabled'
  if (/code_already_used|code_already_redeemed/i.test(message))
    return 'code_already_used'
  if (/plan_not_allowed/i.test(message)) return 'plan_not_allowed'
  if (/source_not_allowed/i.test(message)) return 'source_not_allowed'
  if (/provider_account_id_required|code_required/i.test(message))
    return 'invalid_payload'
  return 'bridge_operation_failed'
}

export const POST: APIRoute = async ({ request }) => {
  const env = getServerEnv()
  const endpointSecret = getSocialGlowzBridgeSecret(env)
  const convexBridgeSecret = getConvexBridgeSecret(env)
  const convexUrl = env.PUBLIC_CONVEX_URL

  if (!endpointSecret || !convexBridgeSecret) {
    return jsonResponse(
      { status: 'unavailable', error: 'socialglowz_bridge_not_configured' },
      503
    )
  }

  const incomingSecret = request.headers.get(SOCIAL_BRIDGE_SECRET_HEADER)
  if (!incomingSecret || incomingSecret !== endpointSecret) {
    return jsonResponse(
      { status: 'unauthorized', error: 'invalid_socialglowz_bridge_secret' },
      401
    )
  }

  if (!convexUrl || convexUrl === 'https://PLACEHOLDER.convex.cloud') {
    return jsonResponse({ status: 'unavailable', error: 'convex_not_configured' }, 503)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ status: 'bad_request', error: 'invalid_json' }, 400)
  }

  const parsed = parseSocialGlowzRequest(body)
  if (!parsed) {
    return jsonResponse({ status: 'bad_request', error: 'invalid_payload' }, 400)
  }

  const convex = new ConvexHttpClient(convexUrl)
  const environment = env.VERCEL_ENV ?? env.NODE_ENV ?? 'production'

  try {
    if (parsed.operation === 'snapshot') {
      const snapshot = await convex.mutation(
        'bridge:ensureSocialGlowzEntitlementSnapshotByProviderAccount' as never,
        {
          providerAccountId: parsed.providerAccountId,
          email: parsed.email,
          sourceRef: parsed.sourceRef,
          environment,
          bridgeSecret: convexBridgeSecret,
        } as never
      )
      return jsonResponse({ status: 'ok', snapshot }, 200)
    }

    const redemption = await convex.mutation(
      'bridge:redeemSocialGlowzActivationCodeByProviderAccount' as never,
      {
        providerAccountId: parsed.providerAccountId,
        email: parsed.email,
        sourceRef: parsed.sourceRef,
        environment,
        code: parsed.code,
        bridgeSecret: convexBridgeSecret,
      } as never
    )
    return jsonResponse({ status: 'ok', redemption }, 200)
  } catch (error) {
    const mappedError = mapBridgeError(error)
    const status = mappedError === 'bridge_secret_mismatch' ? 401 : 400
    return jsonResponse({ status: 'error', error: mappedError }, status)
  }
}
