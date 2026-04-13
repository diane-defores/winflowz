# WinFlowz

Optimize your Windows workflow with a mixed product stack: a Windows productivity course, gated documentation, and companion tools around browser and knowledge workflows.

Production: https://winflowz.com

## Features

- Astro 5 server-rendered marketing site with localized English and French routes
- Starlight-powered course and documentation content under `src/content/docs`
- Product catalog with dedicated sales flow for `Windows Mastery`
- Clerk authentication and gated private course access
- Polar checkout and webhook integration for course purchases
- Convex backend for user sync, entitlements, API keys, and product state
- Resend-powered newsletter signup and onboarding email flow
- React islands for interactive landing and dashboard UI

## Quick Start

### Requirements

- Node.js 20+
- pnpm

### Install and run

```bash
pnpm install
pnpm dev
```

The local dev server runs on `http://localhost:3011`.

## Tech Stack

- Astro 5
- Astro Starlight
- Tailwind CSS 3
- React 19 islands
- Clerk
- Polar.sh
- Convex
- Resend
- Vercel
- Vitest
- Playwright

## Project Structure

```text
winflowz/
├── src/
│   ├── assets/             # Global styles, scripts, and images
│   ├── components/         # Astro and React UI components
│   ├── content/            # Blog posts, docs, products, and services content
│   ├── i18n/               # Translation dictionaries and route labels
│   ├── layouts/            # Shared Astro layouts
│   ├── lib/                # Shared clients and helpers
│   ├── middleware/         # i18n, CORS, and rate limiting
│   ├── pages/              # Marketing pages, dashboard routes, and API routes
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Routing, docs, UI, and course access helpers
├── convex/                 # Convex HTTP handlers, schema, and functions
├── docs/                   # Supplementary design and CSS docs
├── public/                 # Static assets
├── scripts/                # Project scripts, including Polar product setup
└── tests/                  # Vitest setup and mocks
```

## Main Routes

- `/` and `/fr` — localized homepages
- `/landing` and `/fr/landing` — alternate landing flow
- `/windows-mastery` and `/fr/maitrise-windows` — main course sales page
- `/products` and `/fr/produits` — product catalog
- `/dashboard/*` — authenticated app and private course access
- `/api/newsletter/*` — newsletter subscribe and unsubscribe
- `/api/polar/*` — checkout and webhook endpoints

## Environment Variables

Copy `.env.example` to `.env` and fill the values required by your environment.

### App and public config

- `SITE`
- `PUBLIC_SITE_URL`
- `PUBLIC_CONVEX_URL`
- `PORT`

### Clerk

- `CLERK_WEBHOOK_SECRET`

### Polar

- `POLAR_ACCESS_TOKEN`
- `POLAR_PRODUCT_ID`
- `POLAR_WINFLOWZ_PRODUCT_ID`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_SERVER`

### Resend

- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Astro dev server |
| `pnpm start` | Alias for `pnpm dev` |
| `pnpm clean` | Remove build and Vite cache output |
| `pnpm typecheck` | Run `astro check` with the project TS config |
| `pnpm build:check` | Validate Astro files without building |
| `pnpm build:analyze` | Build with bundle analysis |
| `pnpm build:astro` | Standard Astro production build |
| `pnpm build:debug` | Build with Node inspector enabled |
| `pnpm build` | Force a full production build |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro` | Run Astro CLI directly |
| `pnpm test` | Start Vitest |
| `pnpm test:unit` | Run unit tests once |
| `pnpm test:integration` | Build then run integration tests |
| `pnpm test:e2e` | Build then run Playwright end-to-end tests |
| `pnpm test:coverage` | Generate coverage output |
| `pnpm test:ui` | Start Vitest UI |

## Documentation

- [CLAUDE.md](./CLAUDE.md) — agent workflow and context rules
- [BUSINESS.md](./BUSINESS.md) — business model, persona, and GTM context
- [BRANDING.md](./BRANDING.md) — visual identity and route conventions
- [GUIDELINES.md](./GUIDELINES.md) — project-specific engineering guidelines
- [docs/DESIGN_SPECIFICATION.md](./docs/DESIGN_SPECIFICATION.md) — design system notes
- [docs/COMPONENT_CLASSES.md](./docs/COMPONENT_CLASSES.md) — reusable CSS class reference

## Deployment

The project is configured for Vercel server output through `@astrojs/vercel`.

Typical production flow:

```bash
pnpm build
```

## Contributing

1. Install dependencies with `pnpm install`.
2. Create `.env` from `.env.example`.
3. Run `pnpm build:check` before shipping documentation or route changes.
4. Keep docs, route names, and localized paths aligned when editing the sales flow or product catalog.
