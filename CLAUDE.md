# CLAUDE.md

This file provides root-level guidance for agents working in the WinFlowz monorepo.

## Project Overview

- `winflowz_site/`: Astro site, content, account, commerce, Convex, and bridge API surfaces.
- `winflowz_app/`: Flutter Android-first application.
- `shipflow_data/`: project governance, workflow, audit, task, bug, and spec artifacts.

## ShipFlow Development Mode

- development_mode: hybrid
- validation_surface: mixed
- ship_before_preview_test: conditional
- post_ship_verification: sf-prod
- deployment_provider: vercel
- preview_source: Vercel MCP deployment target_url for hosted web surfaces; local tooling for Flutter/Android preflight
- production_url: https://winflowz.com
- notes: Use local checks for structural, Flutter, and unit validation. Use Vercel preview validation before claiming hosted site/app web behavior, serverless API behavior, auth callbacks, bridge endpoints, checkout, or production-like deployment behavior.
- last_reviewed: 2026-05-24

## Product Documentation Rule

- Every declared product in this repo must appear in the repo-level product documentation with a clear name, role, delivery mode, and canonical surface.
- If a product is publicly sold or marketed, its sales page, product page, and fulfillment path must be explicit and kept in sync with the site routes.
- Do not leave product identity or purchase flow implied only by code; the docs should make the commercial surface reviewable without guesswork.
- Treat product claims as evidence-backed statements: tie them to source truth, a live surface, or a proof asset before considering them validated.

## Validation

Use focused checks from the changed subproject:

```bash
(cd winflowz_site && pnpm build:check)
(cd winflowz_site && pnpm test:unit)
(cd winflowz_app && flutter analyze)
(cd winflowz_app && flutter test)
```

Run ShipFlow metadata validation for governance docs:

```bash
/home/claude/shipflow/tools/shipflow_metadata_lint.py AGENT.md shipflow_data
```
