---
artifact: product_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "winflowz"
created: "2026-04-26"
updated: "2026-04-27"
status: reviewed
source_skill: sf-docs
scope: product
owner: "Diane"
confidence: medium
risk_level: medium
target_user: "Windows-based entrepreneurs, freelancers, and professionals who want a practical productivity system without becoming tooling experts"
user_problem: "General productivity advice and many flagship tools are Mac-first, fragmented, or too tactical for Windows users who need a coherent workflow they can apply immediately"
desired_outcomes: "Faster daily execution, better focus, lower workflow friction, and a structured path from free content to gated training and companion tools"
non_goals: "Building a generic cross-platform productivity brand, teaching every possible tool, or positioning WinFlowz as enterprise IT software"
security_impact: unknown
docs_impact: yes
evidence:
  - "README.md"
  - "BUSINESS.md"
  - "GUIDELINES.md"
  - "CONTENT_GUIDELINES.md"
  - "package.json"
  - "src/content/products/en/winflowz.md"
  - "src/content/docs/en/formations.mdx"
linked_artifacts:
  - "BUSINESS.md"
  - "BRANDING.md"
  - "GTM.md"
  - "CONTENT_MAP.md"
  - "GUIDELINES.md"
depends_on:
  - "BUSINESS.md"
  - "BRANDING.md"
  - "GUIDELINES.md"
supersedes: []
next_review: "2026-05-26"
next_step: "/sf-docs audit PRODUCT.md"
---

# Product Context

## Target User

WinFlowz targets Windows-first users who need a coherent productivity system:

- professionals and independents with workflow complexity
- learners seeking structured implementation instead of app list consumption
- bilingual users consuming `en` and `fr` routes

## Problem

The product solves a practical gap:

- much productivity guidance is fragmented or not adapted to Windows constraints
- users need an actionable system, not disconnected tips
- learners need a clear path from discovery to implementation

## Desired Outcomes

Expected outcomes for target users:

- faster execution in daily work
- clearer workflow decisions under Windows
- access to structured learning around `Windows Mastery`
- continued progress through gated docs and related surfaces

## Core Workflows

### 1) Discover and qualify

Users discover WinFlowz via educational content and commercial pages, then evaluate relevance for their Windows workflow.

### 2) Evaluate the flagship offer

Users compare and assess `Windows Mastery` as the primary offer.

### 3) Authenticate, purchase, unlock

Users move through account/auth and purchase-related flow where configured, then unlock gated learning surfaces.

### 4) Learn and apply

Users consume premium documentation and training content to implement concrete workflow changes.

### 5) Extend with companion surfaces

Users may explore companion products and related pages without losing focus on the flagship narrative.

## Scope In

In-scope contract:

- a bilingual Astro marketing site
- `Windows Mastery` as central commercial offer
- gated docs/training surfaces under content collections
- companion product catalog entries in `src/content/products/`
- newsletter capture and lifecycle entry points

## Scope Out

Out of scope for this product contract:

- enterprise team administration or IT fleet management
- broad cross-platform productivity repositioning
- pure media publishing detached from offer conversion

## Success Signals

Definitions only, no targets:

- traffic quality to flagship pages
- conversion into account and purchase flow
- activation into gated lessons/docs
- repeat usage of premium learning surfaces
