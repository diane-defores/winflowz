import {
  getCommerceOffer,
  getOfferProviderConfig,
  getOfferProviderCandidates,
  isAllowedSocialGlowzOffer,
  normalizeCommerceProviderOrder,
  SOCIALGLOWZ_LTD_OFFER_ID,
  SOCIALGLOWZ_LETTER,
  WINFLOWZ_APP_PRO_FOUNDER_LTD_OFFER_ID,
  WINFLOWZ_APP_STARTER_FOUNDER_LTD_OFFER_ID,
  WINFLOWZ_APP_STUDIO_FOUNDER_LTD_OFFER_ID,
} from '@/lib/commerce/offers'

function withEnv(vars: Record<string, string | undefined>, test: () => void) {
  const previous = { ...process.env }
  Object.assign(process.env, vars)
  try {
    test()
  } finally {
    process.env = previous as NodeJS.ProcessEnv
  }
}

describe('commerce offer configuration', () => {
  test('returns socialglowz offer config and allowlist', () => {
    const offer = getCommerceOffer(SOCIALGLOWZ_LTD_OFFER_ID)
    expect(offer).toMatchObject({
      id: SOCIALGLOWZ_LTD_OFFER_ID,
      productId: 'socialglowz',
      plan: 'lifetime_deal',
    })

    expect(isAllowedSocialGlowzOffer(SOCIALGLOWZ_LTD_OFFER_ID, 'socialglowz', 'lifetime_deal')).toBe(
      true
    )
    expect(isAllowedSocialGlowzOffer(SOCIALGLOWZ_LTD_OFFER_ID, 'socialglowz', 'monthly')).toBe(
      false
    )
  })

  test('normalizes provider order to configured providers', () => {
    const candidates = normalizeCommerceProviderOrder(SOCIALGLOWZ_LTD_OFFER_ID)
    expect(candidates.includes('lemonsqueezy')).toBe(true)
    expect(candidates.includes('polar')).toBe(true)

    const allowed = getOfferProviderCandidates(SOCIALGLOWZ_LTD_OFFER_ID)
    expect(allowed).toEqual(candidates)
  })

  test('returns WinFlowz founder offer configs', () => {
    expect(getCommerceOffer(WINFLOWZ_APP_STARTER_FOUNDER_LTD_OFFER_ID)).toMatchObject({
      productId: 'winflowz_app',
      plan: 'starter_founder',
      providers: ['lemonsqueezy'],
    })
    expect(getCommerceOffer(WINFLOWZ_APP_PRO_FOUNDER_LTD_OFFER_ID)).toMatchObject({
      productId: 'winflowz_app',
      plan: 'pro_founder',
      providers: ['lemonsqueezy'],
    })
    expect(getCommerceOffer(WINFLOWZ_APP_STUDIO_FOUNDER_LTD_OFFER_ID)).toMatchObject({
      productId: 'winflowz_app',
      plan: 'studio_founder',
      providers: ['lemonsqueezy'],
    })
  })

  test('reads lemonSqueezy provider config from environment', () => {
    withEnv(
      {
        LEMONSQUEEZY_API_KEY: 'api-key-123',
        LEMONSQUEEZY_STORE_ID: 'store-456',
        LEMONSQUEEZY_SOCIALGLOWZ_LIFETIME_DEAL_VARIANT_ID: 'variant-789',
        LEMONSQUEEZY_WINFLOWZ_APP_PRODUCT_ID: 'winflowz-product',
        LEMONSQUEEZY_WINFLOWZ_APP_PRO_FOUNDER_VARIANT_ID: 'winflowz-pro-variant',
        POLAR_WINFLOWZ_PRODUCT_ID: 'polar-winflowz',
      },
      () => {
        const lemonConfig = getOfferProviderConfig(
          SOCIALGLOWZ_LTD_OFFER_ID,
          'lemonsqueezy'
        )
        expect(lemonConfig).toEqual({
          provider: 'lemonsqueezy',
          productId: undefined,
          variantId: 'variant-789',
          storeId: 'store-456',
        })

        const polarConfig = getOfferProviderConfig(
          SOCIALGLOWZ_LTD_OFFER_ID,
          'polar'
        )
        expect(polarConfig).toEqual({
          provider: 'polar',
          productId: 'polar-winflowz',
        })

        const winflowzConfig = getOfferProviderConfig(
          WINFLOWZ_APP_PRO_FOUNDER_LTD_OFFER_ID,
          'lemonsqueezy'
        )
        expect(winflowzConfig).toEqual({
          provider: 'lemonsqueezy',
          productId: 'winflowz-product',
          variantId: 'winflowz-pro-variant',
          storeId: 'store-456',
        })
      }
    )
  })

  test('returns no provider config without required env', () => {
    withEnv({}, () => {
      expect(getOfferProviderConfig(SOCIALGLOWZ_LTD_OFFER_ID, 'lemonsqueezy')).toBeNull()
      expect(getOfferProviderConfig(SOCIALGLOWZ_LTD_OFFER_ID, 'polar')).toBeNull()
    })
  })

  test('keeps legacy aliases accessible for source/plan metadata', () => {
    expect(SOCIALGLOWZ_LETTER).toBe(SOCIALGLOWZ_LTD_OFFER_ID)
  })
})
