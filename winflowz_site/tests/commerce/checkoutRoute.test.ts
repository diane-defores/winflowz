import { describe, test, expect, afterEach, vi } from 'vitest'
import { GET } from '@/pages/api/commerce/checkout'

const ORIGINAL_FETCH = globalThis.fetch
const ORIGINAL_ENV = { ...process.env }

function resetCommerceEnv() {
  delete process.env.LEMONSQUEEZY_API_KEY
  delete process.env.LEMONSQUEEZY_STORE_ID
  delete process.env.LEMONSQUEEZY_SOCIALGLOWZ_LIFETIME_DEAL_VARIANT_ID
  delete process.env.LEMONSQUEEZY_API_URL
  delete process.env.POLAR_WINFLOWZ_PRODUCT_ID
  delete process.env.POLAR_PRODUCT_ID
  delete process.env.COMMERCE_PROVIDER_ORDER
}

function checkoutRequest(url: string) {
  return new Request(url)
}

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH
  process.env = { ...ORIGINAL_ENV }
  resetCommerceEnv()
})

describe('commerce checkout route', () => {
  test('returns unavailable when no checkout provider is configured', async () => {
    resetCommerceEnv()

    const response = await GET({
      request: checkoutRequest(
        'https://winflowz.test/api/commerce/checkout?offerId=socialglowz/lifetime_deal&successUrl=https://socialglowz.test/purchase/success&cancelUrl=https://socialglowz.test/purchase/cancel'
      ),
    })

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      message: 'No configured checkout provider',
    })
  })

  test('rejects unknown offers before contacting a provider', async () => {
    resetCommerceEnv()
    const fetchSpy = vi.fn()
    globalThis.fetch = fetchSpy as unknown as typeof fetch

    const response = await GET({
      request: checkoutRequest(
        'https://winflowz.test/api/commerce/checkout?offerId=unknown/offer'
      ),
    })

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({
      message: 'Offer not found',
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('redirects to the hosted Lemon Squeezy checkout URL', async () => {
    resetCommerceEnv()
    process.env.LEMONSQUEEZY_API_KEY = 'api-key'
    process.env.LEMONSQUEEZY_STORE_ID = 'store-id'
    process.env.LEMONSQUEEZY_SOCIALGLOWZ_LIFETIME_DEAL_VARIANT_ID = 'variant-id'

    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            id: 'co_route_123',
            attributes: { url: 'https://checkout.lemonsqueezy.test/route' },
          },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      )
    )
    globalThis.fetch = fetchSpy as unknown as typeof fetch

    const response = await GET({
      request: checkoutRequest(
        'https://winflowz.test/api/commerce/checkout?offerId=socialglowz/lifetime_deal&source=direct&successUrl=https://socialglowz.test/purchase/success&cancelUrl=https://socialglowz.test/purchase/cancel'
      ),
    })

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(
      'https://checkout.lemonsqueezy.test/route'
    )

    const body = String(fetchSpy.mock.calls[0]?.[1]?.body)
    expect(body).toContain(
      '"product_options":{"redirect_url":"https://socialglowz.test/purchase/success"}'
    )
    expect(body).toContain('"offer_id":"socialglowz/lifetime_deal"')
    expect(body).not.toContain('api-key')
  })
})
