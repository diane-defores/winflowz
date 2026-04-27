---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-03-18"
updated: "2026-04-27"
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
  - "Supabase"
  - "Android native overlay"
depends_on:
  - "ARCHITECTURE.md@0.1.0"
supersedes: []
next_review: "2026-05-27"
next_step: "$sf-docs update"
---

# Guidelines — VoiceFlowz

## Rule zero: target architecture precedence

For implementation and documentation decisions, use:

- Flutter client + Supabase backend as target baseline.

Do not present Convex, Clerk, or Expo/React Native as target implementation.
They are legacy references for migration parity only.

## Legacy handling during migration

Allowed:

- reading legacy code/contracts to preserve behavior,
- patching legacy code only when needed to unblock migration safety or parity verification,
- referencing legacy APIs as "reference only" in docs.

Not allowed:

- introducing new target features on Convex/Clerk/Expo path,
- adding new long-term contracts that depend on `TEMP_USER_ID`.

## Data and security guidelines

1. All user-scoped product data must be guarded by Supabase RLS.
2. Ownership checks must rely on `auth.uid()` in SQL policies.
3. Do not trust client-sent user identifiers for authorization.
4. OpenAI and Anthropic keys stay in local secure storage only.
5. Never write API keys to Supabase tables, logs, or analytics payloads.
6. Never persist empty/whitespace transcriptions.

## API and schema change guidelines

- Update `docs/API.md` in the same change when schema or policy contracts change.
- Keep table and policy contracts explicit (columns, constraints, RLS behavior).
- For realtime behavior, document scope and ordering assumptions.
- Mark any Convex references as legacy-only compatibility notes.

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
- `status: reviewed` is valid only when the doc does not contradict Flutter + Supabase target.
- Keep `artifact_version: 0.1.0` unless schema-level metadata changes require a version bump.
