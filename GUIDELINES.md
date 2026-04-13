# WinFlowz Engineering Guidelines

## Stack Summary

- Framework: Astro 5 in server mode
- UI: Astro components, React islands, Tailwind CSS, Preline
- Content: Starlight docs and Markdown content collections
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
