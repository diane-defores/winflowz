---
artifact: decision_log
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "WinFlowz"
created: "2026-04-26"
updated: "2026-05-09"
status: "reviewed"
source_skill: "sf-docs"
scope: "product_and_platform"
owner: "Diane"
confidence: "high"
risk_level: "high"
security_impact: "yes"
docs_impact: "high"
depends_on:
  - "../shipflow_data/business/business.md@0.1.0"
  - "../shipflow_data/business/product.md@0.1.0"
evidence:
  - "SPEC_FLUTTER_SUPABASE_MIGRATION.md"
  - "../docs/MIGRATION_FLUTTER.md"
supersedes:
  - "2026-04-26 long-term platform direction"
next_step: "execute Android-first backend-agnostic migration with Firebase as first adapter"
---

# Decisions — WinFlowz

## 2026-05-09 — Backend abstraction and Android-first execution (reviewed)

### Decision

WinFlowz no longer treats Supabase as the active backend target. The app must move to backend-agnostic data/settings contracts with Firebase as the first hosted adapter for the Android MVP.

1. Backend-facing Flutter code must use provider-neutral contracts such as settings, clipboard, transcription, snippets, dictionary and auth stores.
2. Firebase Auth + Firestore is the first remote adapter candidate for the Android MVP because it has a free Spark plan, does not use Supabase-style project pausing, supports Flutter/Android well, and is deployable through CLI-managed rules/indexes.
3. Supabase remains a migration artifact and reference only until removed or replaced. Do not add new Supabase-coupled product code.
4. GitHub Secrets remain the CI secret source for Android builds on Blacksmith.
5. Current implementation focus is Android. Web and non-Android cloud-AI behavior are ignored for now unless a later reviewed decision reopens them.
6. The proprietary Android keyboard implementation proceeds progressively: base typing and safety first, advanced gestures/modularity after the first usable keyboard slice.

### Consequences

- Existing Supabase SQL, docs and repositories are legacy/current-state material, not the future coupling point.
- New sync/settings work should introduce backend-neutral interfaces before adding Firebase implementation.
- Documentation that says "Flutter + Supabase target" is stale after this decision and must be updated as touched.
- Live backend validation waits until Firebase project/rules/indexes are created through CLI workflow.

## 2026-04-27 — Implementation target lock (reviewed)

Superseded in part by the 2026-05-09 backend decision above. Flutter remains valid. Supabase is no longer the active backend target and is now a migration/reference artifact.

### Decision

WinFlowz implementation target is now explicit and binding:

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
