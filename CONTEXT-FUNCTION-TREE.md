---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "winflowz"
created: "2026-04-26"
updated: "2026-04-27"
status: "reviewed"
source_skill: sf-docs
scope: "file"
owner: "Diane"
confidence: "high"
risk_level: "medium"
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "Astro middleware"
  - "Astro API routes"
  - "Convex mutations"
depends_on:
  - "CONTEXT.md"
  - "ARCHITECTURE.md"
supersedes: []
evidence:
  - "src/middleware/index.ts"
  - "src/middleware/i18n.ts"
  - "src/utils/routing.ts"
  - "src/pages/api/polar/checkout.ts"
  - "src/pages/api/newsletter/subscribe.ts"
  - "convex/http.ts"
  - "convex/polar.ts"
  - "convex/users.ts"
next_step: "pnpm build:check"
---
# Context Function Tree

## Request and Middleware Layer

- `src/middleware/index.ts`
  - `appMiddleware(context, next)`
    - branches `/api/*` requests to `corsMiddleware`
    - branches non-API requests to `i18nMiddleware`
  - `onRequest`
    - sequences `clerkMiddleware()`
    - then `appMiddleware`

- `src/middleware/i18n.ts`
  - `i18nMiddleware({ url, locals, redirect }, next)`
    - detects locale from pathname
    - assigns `locals.lang`
    - validates translated route usage
    - redirects between English and French route variants when needed

## Routing Utilities

- `src/utils/routing.ts`
  - `ROUTES`
    - bilingual route key to slug map
  - `generateStaticPaths(routeKey)`
    - emits English and French route params for Astro page generation
  - `getLocalizedPath(lang, routeKey)`
    - builds final localized path string

## Content Contract Layer

- `src/content/config.ts`
  - `docsCollection`
  - `productsCollection`
  - `blogCollection`
  - `servicesCollection`
  - `collections`

These are not runtime functions in the usual sense, but they are central schema constructors that govern valid content.

## Checkout and Billing Flow

- `src/pages/api/polar/checkout.ts`
  - `GET({ url, locals, redirect })`
    - reads `lesson` and `lang`
    - calls `isPremiumFormationSlug`
    - redirects unauthenticated users to localized sign-in
    - validates Polar and Convex env state
    - uses `ConvexHttpClient.query('users:getByClerkId')`
    - calls `getPrivateCoursePath`, `getPublicCoursePath`, `getCourseCheckoutPath`
    - creates Polar checkout
    - redirects to hosted checkout URL

- `src/pages/api/polar/webhook.ts`
  - `POST({ request })`
    - proxies raw webhook payload and signature headers to Convex HTTP endpoint

- `convex/http.ts`
  - Polar route `POST /polar/events`
    - verifies secret presence
    - validates webhook headers
    - checks timestamp tolerance
    - computes expected HMAC via:
      - `base64ToUint8Array(base64)`
      - `uint8ArrayToBase64(bytes)`
    - routes event types to internal mutations:
      - `internal.polar.updateSubscription`
      - `internal.polar.linkCustomer`
      - `internal.polar.grantCourseAccess`

- `convex/polar.ts`
  - `findUserByEmail(ctx, email)`
  - `findUserByPolarCustomerId(ctx, polarCustomerId)`
  - `mergeEntitlements(existing, entitlement)`
  - `updateSubscription`
  - `linkCustomer`
  - `grantCourseAccess`

## Auth Lifecycle

- `src/pages/api/clerk/webhook.ts`
  - receives Clerk lifecycle events
  - expected to forward or synchronize user updates with backend state

- `convex/http.ts`
  - Clerk route `POST /clerk/events`
    - verifies Svix-style signature headers
    - dispatches:
      - `internal.users.upsertFromClerk`
      - `internal.users.deleteByClerkId`

- `convex/users.ts`
  - `upsertFromClerk`
  - `getByClerkId`
  - `deleteByClerkId`

## Newsletter Flow

- `src/pages/api/newsletter/subscribe.ts`
  - `normalizeLang(value)`
  - `normalizeSource(value)`
  - `buildWelcomeEmail(lang, source, email)`
  - `POST({ request })`
    - validates Resend config
    - validates email
    - creates audience contact
    - sends welcome email

- `src/pages/api/newsletter/unsubscribe.ts`
  - `GET({ url })`
    - unsubscribes by email and returns HTML confirmation
  - `POST({ request })`
    - unsubscribes by email and returns JSON response

## Product Feedback and API Key Data

- `convex/features.ts`
  - `list`
  - `vote`

- `convex/apiKeys.ts`
  - `list`
  - `generate`
  - `revoke`

## Primary Data Dependencies

- Checkout depends on:
  - Clerk auth state
  - Convex user lookup
  - Polar credentials
  - course gating helpers

- Webhook entitlement updates depend on:
  - signed vendor requests
  - Convex `users` table indexes
  - event payload structure

- Newsletter depends on:
  - Resend API key
  - audience ID
  - site constants and localized URLs
