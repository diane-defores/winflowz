---
artifact: content_map
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "winflowz"
created: "2026-04-26"
updated: "2026-04-27"
status: reviewed
source_skill: sf-docs
scope: content-map
owner: "Diane"
confidence: medium
risk_level: medium
content_surfaces:
  - source_notes
  - blog
  - docs
  - product_pages
  - landing_pages
  - changelog
  - newsletter
security_impact: unknown
docs_impact: yes
evidence:
  - "README.md"
  - "CONTENT_GUIDELINES.md"
  - "CONTENU/"
  - "src/content/blog/"
  - "src/content/docs/"
  - "src/content/products/"
  - "CHANGELOG.md"
linked_artifacts:
  - "CONTENT_GUIDELINES.md"
  - "PRODUCT.md"
  - "GTM.md"
  - "BUSINESS.md"
depends_on:
  - "PRODUCT.md"
  - "GTM.md"
  - "CONTENT_GUIDELINES.md"
supersedes: []
next_review: "2026-05-26"
next_step: "/sf-repurpose"
---

# Content Map

## Purpose

This file maps content surfaces and routing rules for WinFlowz. It keeps publishing aligned with the core positioning: `Windows Mastery` as flagship offer for Windows-first productivity.

This is a structural artifact, not a backlog.

## Content Surfaces

| Surface | Canonical path | Purpose | Format | Source of truth | Update when |
|---|---|---|---|---|---|
| Source notes | `CONTENU/` | Raw research and drafts before editorial qualification | Markdown, images | Editorial triage | A note is created or promoted |
| Blog | `src/content/blog/{en,fr}/` | Discovery and SEO education | Markdown | Product and GTM positioning | A publishable educational angle is validated |
| Training/docs | `src/content/docs/{en,fr}/` | Gated or structured learning content | MD, MDX | Offer contract and curriculum | Offer or lesson scope changes |
| Product pages | `src/content/products/{en,fr}/` | Catalog and product narratives | Markdown | Active offer reality | Product positioning or status changes |
| Landing pages | `src/pages/[...lang]/` including `/windows-mastery` and `/products` | Conversion surfaces | Astro pages | GTM + product contract | Offer, CTA, or framing changes |
| Changelog | `CHANGELOG.md` | User-facing release and documentation updates | Markdown | Release history | Relevant user-visible change ships |
| Newsletter | `src/pages/api/newsletter/` + external copy tool | Capture and nurture | API + external copy | Lifecycle messaging | Signup or nurture flow changes |

## Semantic Architecture

| Cluster | Pillar page | Supporting pages | Target intent | Internal link rule | Status |
|---|---|---|---|---|---|
| Windows workflow mastery | `/windows-mastery`, `/fr/maitrise-windows` | docs lessons and supporting blog pages | Commercial + educational | Supporting assets link back to flagship conversion surface | live |
| Companion products | `/products`, `/fr/produits` | product markdown entries | Commercial | Product pages link to catalog and flagship context | live |
| Foundations and methods | curated from `CONTENU/` into blog/docs | topical notes promoted with editorial review | Informational | Promote only if aligned with Windows Mastery narrative | planned |

## Page Roles

| Page type | Job | Must include | Must not include |
|---|---|---|---|
| Pillar page | Define the broader workflow problem and route the reader to deeper assets | Framing, outcomes, next-step links, clear audience fit | Thin keyword padding or tool directories |
| Supporting article | Solve one precise sub-problem or illustrate one workflow decision | Specific angle, examples, and a link to the relevant pillar or offer | Repeating the pillar at full length |
| Premium lesson | Change how the learner thinks and acts | Diagnosis, framework, practical translation, and limitations | Shallow lists of apps or uncurated links |
| Product page | Explain what the offer is and why it matters | Offer clarity, intended user, constraints, CTA | Unsupported promises or placeholder CTAs |
| Landing page | Convert qualified traffic | Positioning, objections, proof, CTA, localized consistency | Mixed audiences or vague next steps |
| Source note | Capture raw inputs without pretending they are publish-ready | Title, idea nucleus, references, and triage value | Public-facing polish or premature promotion |

## Repurposing Rules

- `CONTENU/` is upstream source material, not publish-ready content.
- Promote notes only after editorial review against `CONTENT_GUIDELINES.md`.
- Keep concept-first teaching; tools are supporting examples.
- Route top-of-funnel education to blog and premium learning to docs.
- Keep product claims aligned with `PRODUCT.md`, `GTM.md`, and implemented flows.

## Cross-Surface Update Rules

| Trigger | Check these surfaces |
|---|---|
| New flagship offer or curriculum change | `PRODUCT.md`, landing pages, docs lessons, product pages, newsletter messaging |
| New companion product or status change | Product catalog content, landing page references, changelog, related blog CTAs |
| New publishable source note in `CONTENU/` | Blog, docs, and semantic cluster placement |
| Positioning change | `GTM.md`, blog intros, landing pages, product pages, newsletter copy |
| Workflow or access change | Docs, premium lessons, product pages, support copy, changelog |
| Bilingual content update | Matching `en` and `fr` surfaces in the same release batch |
