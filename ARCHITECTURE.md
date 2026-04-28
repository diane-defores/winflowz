---
artifact: architecture_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "winflowz"
created: "2026-04-26"
updated: "2026-04-27"
status: "reviewed"
source_skill: "sf-docs"
scope: "architecture"
owner: "Diane"
confidence: "high"
risk_level: "medium"
docs_impact: "yes"
security_impact: "yes"
evidence:
  - "package.json"
  - "astro.config.mjs"
  - "src/content/config.ts"
  - "src/middleware/index.ts"
  - "src/middleware/i18n.ts"
  - "src/pages/api/polar/checkout.ts"
  - "src/pages/api/newsletter/subscribe.ts"
  - "convex/http.ts"
  - "convex/schema.ts"
linked_systems:
  - "src/content"
  - "src/pages"
  - "src/middleware"
  - "convex"
  - "Clerk"
  - "Polar"
  - "Resend"
external_dependencies:
  - "Astro"
  - "Vercel"
  - "Clerk"
  - "Convex"
  - "Polar"
  - "Resend"
invariants:
  - "English routes remain unprefixed while French routes stay under /fr."
  - "Checkout initiation and webhook entitlement updates remain coordinated between Astro routes and Convex."
  - "Typed content collections continue to define valid docs, blog, product, and service content."
depends_on:
  - "GUIDELINES.md"
  - "BUSINESS.md"
  - "BRANDING.md"
  - "CLAUDE.md"
supersedes: []
next_review: "2026-05-26"
next_step: "pnpm build:check"
---
# Architecture

## System Overview

WinFlowz is a server-rendered Astro application deployed to Vercel. It combines static-content patterns with server runtime features for auth, payments, newsletter operations, and backend webhook processing.

## Core Architectural Layers

### 1. Presentation layer

- Astro pages under `src/pages/`
- Astro layouts under `src/layouts/`
- Astro components under `src/components/`
- React islands for interactive UI where needed

This layer renders:

- marketing pages
- product pages
- blog and docs content
- roadmap and dashboard interfaces
- legal and support pages

### 2. Content layer

Typed collections in `src/content/config.ts` define the allowed document shape for:

- docs
- blog
- products
- services

This gives the project a content-managed architecture without a separate CMS.

### 3. Request orchestration layer

`src/middleware/index.ts` sequences:

1. Clerk middleware for auth/session augmentation
2. app middleware for request branching

Branching behavior:

- `/api/*` requests use CORS handling
- all other requests use i18n handling

`src/middleware/i18n.ts` is the URL normalization and locale assignment boundary.

### 4. Integration API layer

Astro API routes act as thin integration controllers:

- `api/polar/checkout.ts`: authenticated checkout initiation
- `api/polar/webhook.ts`: compatibility proxy to Convex HTTP webhook endpoint
- `api/newsletter/subscribe.ts`: Resend audience subscription plus welcome email
- `api/newsletter/unsubscribe.ts`: unsubscribe flows
- `api/clerk/webhook.ts`: auth lifecycle integration surface

The intended pattern is thin route handlers delegating durable business state to Convex or external providers.

### 5. Backend state layer

Convex is the primary application state store.

Current tables:

- `users`
- `apiKeys`
- `features`

Current backend responsibilities:

- syncing Clerk users into app data
- storing billing/customer linkage
- granting course entitlements from paid events
- storing roadmap features and votes
- storing generated API keys

## Main Runtime Flows

## Locale and route flow

1. Request enters Astro.
2. Clerk middleware executes.
3. App middleware checks the pathname.
4. Non-API requests pass through i18n middleware.
5. i18n middleware sets `locals.lang` and optionally redirects to translated canonical routes.
6. Page renders using localized content and labels.

## Checkout flow

1. User hits `GET /api/polar/checkout` with `lesson` and optional `lang`.
2. Route validates lesson slug against course gating rules.
3. Route requires authenticated Clerk user.
4. Route queries Convex for the user record.
5. Route creates a Polar checkout using external customer and entitlement metadata.
6. User is redirected to Polar hosted checkout.
7. Polar events later reach Convex webhook processing.

## Billing and entitlement flow

1. Polar sends webhook to Astro compatibility route or directly to Convex.
2. Convex HTTP action verifies signed headers and timestamp tolerance.
3. Event type determines which internal mutation runs.
4. Subscription or entitlement state is patched onto the `users` record.

## Auth synchronization flow

1. Clerk user lifecycle event is received.
2. Convex HTTP action verifies Svix headers.
3. `upsertFromClerk` or `deleteByClerkId` updates the `users` table.

## Newsletter flow

1. Frontend submits to `POST /api/newsletter/subscribe`.
2. Route validates config and email payload.
3. Contact is created in Resend audience state.
4. Localized welcome email is sent.
5. Unsubscribe can later occur through HTML or JSON route variants.

## Architectural Boundaries

## What belongs in Astro

- rendering pages
- locale-aware routing
- integration-edge request handling
- lightweight redirect logic

## What belongs in Convex

- durable user state
- billing/customer linkage
- entitlement state
- feature voting persistence
- API key persistence

## What belongs in third parties

- authentication session authority: Clerk
- payment checkout and subscription events: Polar
- email audience and delivery: Resend
- deployment runtime: Vercel

## Current Strengths

- Clear separation between page rendering and persisted business state
- Typed content collection contracts
- Explicit locale-routing layer
- Webhook verification implemented close to backend mutations

## Current Risks

- Billing and auth correctness depend on several environment variables across Astro and Convex.
- The Polar webhook exists in two surfaces: Astro proxy and Convex endpoint. That is useful for compatibility but increases operational ambiguity.
- Newsletter unsubscribe currently finds contacts by listing audience members, which may become inefficient or brittle at scale.

## Recommended Direction

- Keep Astro API routes thin and move durable logic to Convex when possible.
- Preserve the current split between bilingual content/routing concerns and backend state concerns.
- Document env contracts centrally if checkout, auth, or email flows expand.
