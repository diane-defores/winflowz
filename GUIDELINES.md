---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: winflowz
created: "2026-04-25"
updated: "2026-04-27"
status: reviewed
source_skill: sf-docs
scope: guidelines
owner: "Diane"
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - "Astro 5"
  - "Clerk"
  - "Convex"
  - "Polar"
  - "Resend"
depends_on:
  - "CLAUDE.md"
  - "ARCHITECTURE.md"
supersedes: []
evidence:
  - "package.json"
  - "astro.config.mjs"
  - "src/pages/api/polar/checkout.ts"
  - "src/pages/api/newsletter/subscribe.ts"
  - "src/middleware/i18n.ts"
  - "convex/http.ts"
next_review: "2026-05-27"
next_step: "pnpm build:check"
---
# WinFlowz Engineering Guidelines

## Stack Summary

- Framework: Astro 5 in server mode
- UI: Astro components, React islands, Tailwind CSS, Preline
- Content: Astro content collections and MDX content
- Auth: Clerk
- Payments: Polar.sh
- Backend: Convex
- Email: Resend
- Deployment: Vercel

## Product Rules

- `Windows Mastery` is the primary paid conversion path.
- Product catalog pages must never expose dead-end CTAs such as `#`.
- Localized routes must stay aligned:
  - English: `/products`, `/windows-mastery`
  - French: `/fr/produits`, `/fr/maitrise-windows`
- Post-purchase flows must preserve locale when possible.

## Content and Routing

- Marketing pages live under `src/pages/[...lang]/`.
- Structured content lives in `src/content/`:
  - `blog/`
  - `docs/`
  - `products/`
  - `services/`
- Keep `src/i18n/*` in sync with the rendered pages and CTA labels.
- Keep `src/utils/routing.ts` and `src/i18n/config.ts` aligned when adding or renaming localized routes.
- When changing product status (`available`, `beta`, `coming_soon`), verify the CTA strategy matches the status.

## API and Integration Rules

- Astro API routes live in `src/pages/api/`.
- Convex HTTP endpoints live in `convex/http.ts`.
- Polar checkout depends on:
  - authenticated Clerk user
  - valid `PUBLIC_CONVEX_URL`
  - configured Polar product ID
- Newsletter flows depend on Resend audience configuration.

## Documentation Rules

- Update `README.md` whenever scripts, environment variables, or major routes change.
- Update `GUIDELINES.md` when architecture or product rules change.
- Keep technical docs concise and grounded in the current codebase.
- Do not document routes, scripts, or directories that no longer exist.

## Verification

- Preferred baseline check after technical or documentation changes:

```bash
npm run build:check
```

- If a change touches checkout, auth, or newsletter behavior, also inspect the affected route files directly.
