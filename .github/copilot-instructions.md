# Copilot Instructions for WinFlowz

## Project Summary

WinFlowz is a multilingual (English/French) Astro-based website offering productivity tools and training for Windows workflows. The project is built with TypeScript, Tailwind CSS, and uses Supabase for authentication. It deploys to Vercel as a static site with server-side functionality.

## Tech Stack

- **Framework**: Astro 5.x with Starlight documentation integration
- **Languages**: TypeScript, JavaScript
- **Styling**: Tailwind CSS 3.x with Preline UI components
- **Authentication**: Supabase (supabase-js)
- **Payment**: Stripe
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **Deployment**: Vercel (static output)
- **Package Manager**: pnpm (required - use `pnpm` for all commands)

## Quick Start Commands

**Always run these commands from the repository root:**

```bash
# Install dependencies (REQUIRED before any other command)
pnpm install

# Development server (runs on http://localhost:4327)
pnpm dev

# Build for production
pnpm build

# Run unit tests
pnpm test:unit

# Run all tests with watch mode
pnpm test

# Preview production build
pnpm preview

# Type checking (has pre-existing errors - do not attempt to fix unrelated ones)
pnpm typecheck
```

## Build Process Notes

1. **Always run `pnpm install` first** after cloning or when dependencies change
2. The build takes approximately 18-20 seconds
3. Build output goes to `.vercel/output/static/` for deployment
4. Build command sets `NODE_OPTIONS="--max-old-space-size=4096"` automatically
5. The site uses static output mode with Vercel adapter

## Test Commands

| Command | Purpose | Duration |
|---------|---------|----------|
| `pnpm test:unit` | Run unit and integration tests | ~1-2 sec |
| `pnpm test` | Run tests in watch mode | Interactive |
| `pnpm test:e2e` | E2E tests (builds first, needs dev server) | ~2-3 min |
| `pnpm test:coverage` | Run tests with coverage | ~5 sec |

**Test Configuration:**
- Test files in `tests/` directory
- Vitest config in `vitest.config.ts`
- Playwright config in `playwright.config.ts`
- Development server runs on port 4327 (`pnpm dev`)
- **Note**: Playwright config expects port 4321 but dev server runs on 4327. For E2E tests, the dev server may need to be started manually on the correct port, or the playwright config updated

## Project Structure

```
/
├── src/
│   ├── assets/          # Static assets, styles, scripts
│   ├── components/      # Astro/Vue components
│   │   ├── auth/        # Authentication components
│   │   ├── sections/    # Page sections
│   │   └── ui/          # Reusable UI components
│   ├── content/         # Markdown content (blog, docs, products, services)
│   ├── i18n/            # Internationalization (en, fr)
│   ├── layouts/         # Layout templates
│   ├── lib/             # Core libraries (supabaseClient, auth, api-keys)
│   ├── middleware/      # Auth, CORS, rate limiting
│   ├── pages/           # Astro pages and API routes
│   │   └── api/         # API endpoints
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── tests/
│   ├── auth/            # Auth tests (unit, integration, e2e)
│   └── mocks/           # Test mocks
├── supabase/            # Supabase configuration
└── public/              # Public static files
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Main Astro configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.mjs` | Tailwind CSS configuration |
| `vitest.config.ts` | Vitest test configuration |
| `playwright.config.ts` | Playwright E2E test configuration |
| `.prettierrc` | Code formatting (Prettier) |
| `vercel.json` | Vercel deployment configuration |
| `supabase/config.toml` | Supabase local development config |

## Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@assets/*` → `src/assets/*`
- `@images/*` → `src/images/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`

Additional Vite aliases (in `astro.config.mjs`):
- `~` → `src/`
- `@lib` → `src/lib`
- `@styles` → `src/assets/styles`
- `@scripts` → `src/assets/scripts`

## Internationalization (i18n)

- Two locales: English (default) and French
- Locale configuration in `src/i18n/config.ts`
- Translations in `src/i18n/en/` and `src/i18n/fr/`
- Localized routes use `/fr/` prefix for French

## Environment Variables

Copy `.env` to `.env.local` for local development. Required variables:
- `SUPABASE_URL` - Supabase API URL
- `SUPABASE_ANON_KEY` / `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `PUBLIC_SITE_URL` - Site URL for callbacks

Test environment uses `.env.test` which is pre-configured for local testing.

## Known Issues and Workarounds

1. **TypeScript Errors**: The `pnpm typecheck` command reports pre-existing type errors in purchase/payment API routes and test files. These are unrelated to most changes and should not be fixed unless specifically working on those files.

2. **Build Warnings**: Some deprecation warnings may appear during build - these are typically from dependencies and do not affect functionality.

3. **Supabase CLI**: The supabase CLI binary may show install warnings during `pnpm install` - this does not affect functionality.

## Validation Checklist

Before completing work, verify:
1. ✅ `pnpm build` completes successfully
2. ✅ `pnpm test:unit` passes all tests
3. ✅ No new console errors in development
4. ✅ i18n works (test both `/` and `/fr/` routes)

## Code Style Guidelines

- Use TypeScript for all code
- Follow existing patterns in the codebase
- Use functional components with TypeScript interfaces
- Use Tailwind CSS for styling (mobile-first approach)
- Use lowercase with dashes for directory names
- Prefer named exports for functions

## Trust These Instructions

These instructions have been validated against the actual repository. If you encounter a command that doesn't work as documented, the documentation may be outdated - verify by exploring the actual `package.json` scripts. Search only when information here is incomplete or found to be in error.
