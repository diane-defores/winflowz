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
security_impact: "unknown"
docs_impact: "yes"
linked_systems:
  - "Astro content collections"
  - "Clerk auth"
  - "Convex backend"
  - "Polar checkout"
  - "Resend newsletter"
depends_on:
  - "AGENT.md"
  - "GUIDELINES.md"
supersedes: []
evidence:
  - "package.json"
  - "src/content/config.ts"
  - "src/pages"
  - "src/components"
  - "src/middleware"
  - "convex/schema.ts"
next_step: "pnpm build:check"
---
# Repository Context

## What This Repo Is

WinFlowz is an Astro server-rendered site with bilingual marketing pages, documentation content, product pages, a training sales path, a lightweight dashboard, and backend integrations for auth, billing, and email.

## Top-Level Mental Model

- `src/pages/`: route surface
- `src/components/`: Astro and React UI building blocks
- `src/content/`: typed markdown collections
- `src/i18n/`: locale strings and route labels
- `src/middleware/`: request shaping before route execution
- `src/utils/`: routing, docs, UI, gating, and helper logic
- `convex/`: database schema and backend business logic

## Route Surface

### Public marketing and content

- `src/pages/[...lang]/index.astro`
- `src/pages/[...lang]/landing.astro`
- `src/pages/[...lang]/[products].astro`
- `src/pages/[...lang]/[products_slug].astro`
- `src/pages/[...lang]/[blog].astro`
- `src/pages/[...lang]/[blog_slug].astro`
- `src/pages/[...lang]/[services].astro`
- `src/pages/[...lang]/[roadmap].astro`
- legal and utility pages under the same bilingual pattern

### Dashboard

- `src/pages/dashboard/index.astro`
- `src/pages/dashboard/parametres.astro`
- `src/pages/dashboard/taches.astro`
- `src/pages/dashboard/docs/*`

### APIs

- `src/pages/api/clerk/webhook.ts`
- `src/pages/api/polar/checkout.ts`
- `src/pages/api/polar/webhook.ts`
- `src/pages/api/newsletter/subscribe.ts`
- `src/pages/api/newsletter/unsubscribe.ts`

## Content Model

`src/content/config.ts` defines four collections:

- `docs`
- `products`
- `blog`
- `services`

These schemas are active contracts. Any frontmatter or content structure change must stay aligned with collection definitions.

## UI Organization

- `src/layouts/`: page shells such as `MainLayout`, `LandingLayout`, `DocsLayout`
- `src/components/sections/`: page section composition
- `src/components/ui/`: reusable UI primitives
- `src/components/roadmap/`: feature voting board UI
- `src/components/react/`: interactive islands

## Request Lifecycle

1. Astro receives the request in server mode.
2. Clerk middleware runs first.
3. App middleware sends `/api/*` through CORS handling and everything else through i18n handling.
4. Page or API route executes.
5. Some API routes call external vendors directly; some runtime events are delegated to Convex.

## Data Model Snapshot

`convex/schema.ts` currently defines:

- `users`: Clerk identity, subscription state, entitlements
- `apiKeys`: user-owned keys with revoke state
- `features`: roadmap items and vote counts

## Integration Map

- Clerk: session auth plus user lifecycle webhook sync
- Convex: query/mutation layer and HTTP webhook endpoints
- Polar: checkout session creation and order/subscription events
- Resend: audience subscription plus welcome email delivery
- Vercel: deployed Astro server runtime

## Constraints Worth Remembering

- English is the default locale and has no URL prefix.
- French uses `/fr` and translated slugs where configured.
- Checkout is gated by auth and by a valid premium course slug.
- Convex is treated as the source of truth for user entitlements after billing events.
- Newsletter endpoints depend on configured Resend audience state.

## Confidence Notes

High confidence for structure and runtime boundaries. All sections are mapped to existing files and route handlers in this repository.
