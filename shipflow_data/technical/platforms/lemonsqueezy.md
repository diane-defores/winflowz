---
artifact: technical_module_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: winflowz
created: "2026-05-30"
updated: "2026-05-30"
status: draft
source_skill: sf-docs
scope: platform-usage-lemonsqueezy
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - shipflow_data/technical/code-docs-map.md
  - /home/claude/shipflow/shipflow_data/technical/external-platforms/lemonsqueezy.md
  - winflowz_site/src/lib/commerce/
  - winflowz_site/src/pages/api/commerce/
  - winflowz_site/convex/bridge.ts
depends_on:
  - artifact: "/home/claude/shipflow/shipflow_data/technical/external-platforms/lemonsqueezy.md"
    artifact_version: "0.1.0"
    required_status: "draft"
supersedes: []
evidence:
  - "WinFlowz suite owns the processor-agnostic commerce API and SocialGlowz entitlement ledger fulfillment."
  - "Fresh Lemon Squeezy docs checked on 2026-05-30; no official CLI or MCP was identified."
next_review: "2026-06-30"
next_step: "/sf-verify socialglowz-processor-agnostic-ltd-commerce after Lemon Squeezy test-mode and hosted Convex refund/replay smoke"
---

# Lemon Squeezy Usage

## Purpose

Document how WinFlowz uses Lemon Squeezy for the suite-owned SocialGlowz direct Lifetime Deal checkout path.

Use the global provider note for source links and tool availability:

- `/home/claude/shipflow/shipflow_data/technical/external-platforms/lemonsqueezy.md`

This file is the local usage contract for architecture, validation, and automation decisions.

## Usage Summary

- Provider role: first payment provider adapter for direct SocialGlowz Lifetime Deal sales.
- Product access owner: WinFlowz suite entitlement ledger, not Lemon Squeezy.
- Applies to paths:
  - `winflowz_site/src/lib/commerce/**`
  - `winflowz_site/src/pages/api/commerce/**`
  - `winflowz_site/src/pages/api/bridge/socialglowz.ts`
  - `winflowz_site/convex/bridge.ts`
  - `winflowz_site/.env.example`
  - `winflowz_site/README.md`
- Environments used: local mocked tests, future Lemon Squeezy test mode, future production.
- Validation surface: local adapter/route tests, Astro typecheck, hosted Convex fulfillment smoke, Lemon Squeezy test-mode checkout/webhook/refund smoke.
- Owner: Diane.
- Last verified: 2026-05-30 by local tests and official docs review; hosted provider smoke not yet executed.

## Local Configuration

| Item | Value or rule | Secret? | Notes |
| --- | --- | --- | --- |
| API base URL | `LEMONSQUEEZY_API_URL` defaulting to `https://api.lemonsqueezy.com` | no | Override only for controlled tests or documented provider change. |
| API key | `LEMONSQUEEZY_API_KEY` | yes | Server-only. Use test-mode key for pre-production proof. |
| Store id | `LEMONSQUEEZY_STORE_ID` | sensitive-ish | Record key name only in docs; do not record real value. |
| SocialGlowz product id | `LEMONSQUEEZY_SOCIALGLOWZ_PRODUCT_ID` | sensitive-ish | Provider reference only; never replaces internal `productId=socialglowz`. |
| SocialGlowz LTD variant id | `LEMONSQUEEZY_SOCIALGLOWZ_LIFETIME_DEAL_VARIANT_ID` | sensitive-ish | Provider reference only; mapped from internal offer `socialglowz/lifetime_deal`. |
| Webhook secret | `LEMONSQUEEZY_WEBHOOK_SECRET` | yes | Server-only; used to verify `X-Signature`. |
| Provider order preference | `COMMERCE_PROVIDER_ORDER` | no | Current default: `lemonsqueezy,polar`. |
| Checkout route | `/api/commerce/checkout` | no | Creates hosted checkout server-side. |
| Webhook route | `/api/commerce/webhooks/lemon-squeezy` | no | Reads exact raw body, verifies signature, forwards normalized event to Convex. |
| Convex bridge secret | `SUITE_BRIDGE_CONVEX_SECRET` | yes | Required for suite ledger mutations. |

## Runtime And Integration Notes

- Checkout creation uses the official REST API, not a CLI or MCP.
- Checkout payload sends `product_options.redirect_url` and `checkout_data.custom`.
- Webhook parsing reads Lemon Squeezy `meta.custom_data`, `X-Event-Name`, and `X-Signature`.
- `order_created` maps to a normalized paid event.
- `order_refunded` maps to a normalized refunded event.
- Unsupported or incomplete signed events must be `pending_review`, not an access grant.
- Fulfillment runs through `bridge:processSocialGlowzCommerceEvent` and writes to suite-owned `productEntitlements` / `productAccessEvents`.
- Checkout success pages are not payment proof. Access changes come from signed webhooks and idempotent suite fulfillment.
- Polar remains a provider adapter/legacy route and must not be deleted as part of Lemon Squeezy adoption.

## MCP / CLI Policy

Current status:

- Official Lemon Squeezy CLI: not identified.
- Official Lemon Squeezy MCP: not identified.
- Adopted automation layer: none.
- Canonical integration: REST API plus signed webhooks; optional official JavaScript SDK only if a future spec chooses it.

Third-party MCPs may be evaluated later for read-only/test-mode convenience, but are not allowed for production writes by default.

Allowed without a new spec:

- Read-only exploration in a disposable test Lemon Squeezy account after reviewing the MCP source and scopes.
- Test-mode-only store/product/order inspection if API key exposure is acceptable for the test account.

Requires a new spec or explicit approval:

- Production order/refund/subscription/license/customer mutation.
- Webhook endpoint creation/update/deletion.
- Any MCP hosted by a third party with live customer/payment data.

## Invariants

- Internal offer id remains `socialglowz/lifetime_deal`.
- Internal product and plan remain `productId=socialglowz`, `plan=lifetime_deal`.
- Provider product, variant, order, customer, invoice, and webhook ids are references only.
- Lemon Squeezy never becomes the runtime authorization store.
- No email-only auto-grant or account merge.
- Refund/revoke state must become non-granting in the suite ledger.
- API keys and webhook secrets never leave server-side environment variables.
- Test-mode events must not grant production access.

## Failure Modes

- Missing Lemon Squeezy env -> checkout route returns unavailable; do not fallback to a public marketplace route.
- Invalid signature -> webhook rejects and writes no entitlement.
- Missing `meta.custom_data` or unsupported offer -> event goes to pending review or ignored outcome, never direct access.
- Provider API timeout/rate limit -> no partial entitlement side effect.
- Convex deployment not configured -> provider smoke cannot prove fulfillment; route to `sf-deploy`/`sf-prod` for Convex target setup.
- Third-party MCP suggested -> route to `sf-docs`/`sf-spec` for tool trust review before adoption.

## Security Notes

- Do not document real store ids, variant ids, API keys, webhook secrets, raw webhook bodies, customer emails, order payloads, or checkout URLs with private query state.
- Treat Lemon Squeezy API keys as broad payment credentials.
- Prefer separate test-mode and live-mode keys.
- MCP/CLI automation must be denied for production writes until reviewed.
- Redact provider logs before attaching them to ShipFlow evidence.

## Validation

Local checks:

```bash
pnpm -C /home/claude/winflowz/winflowz_site test tests/commerce/checkoutRoute.test.ts tests/commerce/offers.test.ts tests/commerce/lemonsqueezy.test.ts tests/api/bridge/socialGlowzCommerceBridge.test.ts
pnpm -C /home/claude/winflowz/winflowz_site build:check
python3 /home/claude/shipflow/tools/shipflow_metadata_lint.py /home/claude/winflowz/shipflow_data/technical/platforms/lemonsqueezy.md
```

Provider smoke, after test-mode setup:

```text
Create checkout from SocialGlowz pricing -> complete test order -> receive signed order_created webhook -> verify suite ledger access/code path -> perform/simulate refund -> verify access becomes non-granting.
```

## Reader Checklist

- `winflowz_site/src/lib/commerce/**` changed -> verify checkout/webhook contract against official docs and this usage note.
- `winflowz_site/convex/bridge.ts` changed -> verify idempotency, no email-only merge, refund/revoke precedence, and environment separation.
- Env vars changed -> update `.env.example`, README, and this note with keys only.
- Someone proposes Lemon Squeezy CLI/MCP -> check global provider note and keep production writes blocked until a reviewed tool decision exists.

## Maintenance Rule

Update this note when Lemon Squeezy provider mapping, env var keys, checkout/webhook routes, provider smoke process, suite fulfillment behavior, refund/revoke policy, MCP/CLI adoption, or security assumptions change.
