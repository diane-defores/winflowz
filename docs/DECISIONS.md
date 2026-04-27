---
artifact: decision_log
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-27"
status: "reviewed"
source_skill: "sf-docs"
scope: "product_and_platform"
owner: "Diane"
confidence: "high"
risk_level: "high"
security_impact: "yes"
docs_impact: "high"
depends_on:
  - "../BUSINESS.md@0.1.0"
  - "../PRODUCT.md@0.1.0"
evidence:
  - "SPEC_FLUTTER_SUPABASE_MIGRATION.md"
  - "../docs/MIGRATION_FLUTTER.md"
supersedes:
  - "2026-04-26 long-term platform direction"
next_step: "execute migration per docs/MIGRATION_FLUTTER.md"
---

# Decisions — VoiceFlowz

## 2026-04-27 — Implementation target lock (reviewed)

### Decision

VoiceFlowz implementation target is now explicit and binding:

1. Client application target: **Flutter** (single Dart codebase).
2. Backend target: **Supabase** (Auth + Postgres + RLS + Realtime).
3. Day 1 platform target: **Android, iOS, macOS, Windows, Linux, web**.
4. Android overlay remains native Kotlin, exposed to Flutter through plugin/platform-channel contracts.
5. Convex, Clerk, Expo/React Native are **legacy references only** during migration and are not valid target architecture choices.

### Current stance

- This replaces the prior directional (non-committal) platform note.
- This decision is reviewed and ready for execution workstreams.
- Any implementation or doc that presents Convex/Clerk/Expo as target is out of date.

### Rationale

- The migration spec (`docs/SPEC_FLUTTER_SUPABASE_MIGRATION.md`) requires a repo end-state without app-level JS/TS implementation.
- Supabase provides first-class Flutter support and a clear contract for auth isolation with `auth.uid()` + RLS.
- Product scope requires synchronized multi-platform state, but only Android needs system overlay behavior.

### Consequences

- Architecture, API, component, and guideline docs must split legacy reference from target contracts.
- Backend contracts move from Convex function signatures to Supabase schema/policies/realtime contracts.
- Legacy stack can still be read for parity and migration verification, but not for target design decisions.
