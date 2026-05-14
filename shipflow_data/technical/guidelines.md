---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "WinFlowz"
created: "2026-03-18"
updated: "2026-05-09"
status: "reviewed"
source_skill: "sf-docs"
scope: "guidelines"
owner: "Diane"
confidence: "high"
risk_level: "high"
docs_impact: "yes"
security_impact: "yes"
evidence:
  - "docs/DECISIONS.md"
  - "docs/MIGRATION_FLUTTER.md"
  - "docs/API.md"
  - "modules/floating-overlay/android/src/main/java/expo/modules/floatingoverlay/FloatingOverlayModule.kt"
linked_systems:
  - "Flutter"
  - "Backend-agnostic stores"
  - "Firebase first adapter"
  - "Android native overlay"
depends_on:
  - "shipflow_data/technical/architecture.md@0.1.0"
supersedes: []
next_review: "2026-05-27"
next_step: "$sf-docs update"
---

# Guidelines — WinFlowz

## Rule zero: target architecture precedence

For implementation and documentation decisions, use:

- Flutter client + backend-agnostic data/settings contracts as target baseline.
- Firebase Auth + Firestore is the first remote adapter for the Android MVP.

Do not present Convex, Clerk, Expo/React Native, or Supabase-coupled product code as target implementation.
They are legacy references for migration parity only.

## Legacy handling during migration

Allowed:

- reading legacy code/contracts to preserve behavior,
- patching legacy code only when needed to unblock migration safety or parity verification,
- referencing legacy APIs as "reference only" in docs.

Not allowed:

- introducing new target features on Convex/Clerk/Expo/Supabase-coupled paths,
- adding new long-term contracts that depend on `TEMP_USER_ID`.

## Data and security guidelines

1. All user-scoped remote product data must be guarded by the selected backend security model.
2. Firebase adapter ownership checks must rely on Firebase Auth uid and Firestore Security Rules.
3. Do not trust client-sent user identifiers for authorization.
4. OpenAI and Anthropic keys stay in local secure storage only.
5. Never write API keys to remote data stores, logs, or analytics payloads.
6. Never persist empty/whitespace transcriptions.

## API and schema change guidelines

- Update backend API/docs in the same change when adapter contracts, rules, indexes or schemas change.
- Keep data and security contracts explicit.
- For realtime behavior, document scope and ordering assumptions.
- Mark any Convex or Supabase references as legacy-only compatibility notes unless they describe the current adapter under active migration.

## Flutter implementation guidelines

- Use Dart-first feature modules (`voice`, `clipboard`, `settings`, `snippets`, `dictionary`, `auth`, `overlay`).
- Keep business logic out of widgets; use provider/controller + repository boundaries.
- Prefer typed domain models and explicit error states.
- Surface platform limitations directly in UI copy (for example overlay availability).

## Platform behavior guidelines

- Android overlay is native and Android-only.
- If injection fails, clipboard fallback must still deliver final text.
- Linux local speech mode is documented unavailable; advanced recording + Whisper path remains available.
- Permission failures must produce explicit recovery paths, never silent no-op behavior.

## Documentation guidelines

- Every owned doc must keep a `Legacy` vs `Target` split where relevant.
- `status: reviewed` is valid only when the doc does not contradict Flutter + backend-agnostic/Firebase-first target.
- Keep `artifact_version: 0.1.0` unless schema-level metadata changes require a version bump.
