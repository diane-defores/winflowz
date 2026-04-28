---
artifact: gtm_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "winflowz"
created: "2026-04-26"
updated: "2026-04-27"
status: reviewed
source_skill: sf-docs
scope: gtm
owner: "Diane"
confidence: medium
risk_level: medium
target_segment: "Windows-first professionals, freelancers, creators, and productivity enthusiasts looking for structured workflow improvement"
offer: "A content-led funnel into premium Windows productivity training, gated documentation, and companion workflow tools"
channels: "SEO, bilingual educational content, product pages, landing pages, newsletter capture, and community distribution"
proof_points: "Windows-only positioning, bilingual content structure, gated course/docs flow, Polar checkout integration, Clerk auth, and a visible companion product catalog"
security_impact: unknown
docs_impact: yes
evidence:
  - "README.md"
  - "BUSINESS.md"
  - "BRANDING.md"
  - "GUIDELINES.md"
  - "CONTENT_GUIDELINES.md"
  - "src/content/blog/"
  - "src/content/docs/"
  - "src/content/products/"
linked_artifacts:
  - "BUSINESS.md"
  - "BRANDING.md"
  - "PRODUCT.md"
  - "CONTENT_MAP.md"
depends_on:
  - "BUSINESS.md"
  - "BRANDING.md"
  - "PRODUCT.md"
supersedes: []
next_review: "2026-05-26"
next_step: "/sf-docs audit GTM.md"
---

# GTM Context

## Target Segment

Primary segment:

- Windows-first professionals and independents with recurring workflow friction
- learners who value operational systems over generic productivity content
- bilingual audience (`en`/`fr`) on core commercial routes

## Core Offer

GTM is centered on:

- `Windows Mastery` as flagship commercial offer
- free educational content for discovery and qualification
- gated learning surfaces for activated users
- companion product pages as ecosystem extension, not positioning replacement

## Positioning

WinFlowz positioning:

- Windows-first productivity guidance with practical implementation
- structured learning path instead of disconnected app recommendations
- commercial narrative led by one flagship offer (`Windows Mastery`)

## Acquisition Channels

Observed channels in this repo:

- SEO via bilingual educational content (`src/content/blog/`)
- offer and catalog pages (`/windows-mastery`, `/products`, localized counterparts)
- newsletter capture and lifecycle surfaces (`/api/newsletter/*`)
- product-oriented pages and documentation that move qualified users toward activation

## Conversion Path

1. Acquire via educational or product-intent content.
2. Qualify via Windows-specific framing and practical examples.
3. Route to flagship offer page (`Windows Mastery`) or product catalog.
4. Trigger account and checkout flow where relevant.
5. Activate users into gated training/docs and related surfaces.

## Proof Available In Repo

- bilingual routes and content structure
- explicit `Windows Mastery` route family
- authentication and purchase-related API surface references in repo structure
- docs/products/blog collections aligned to one brand

Not claimed here:

- customer counts
- conversion benchmarks
- revenue metrics
- paid channel performance

## GTM KPIs (Definitions Only)

- qualified organic traffic to flagship and high-intent pages
- visit-to-lead conversion
- visit-to-purchase conversion on flagship route
- post-purchase activation into gated surfaces
- retention in premium learning journeys
