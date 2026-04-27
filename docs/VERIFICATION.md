---
artifact: verification_plan
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-27"
updated: "2026-04-27"
status: "reviewed"
source_skill: "sf-spec"
scope: "flutter_supabase_migration"
owner: "Diane"
confidence: "medium"
risk_level: "high"
security_impact: "yes"
docs_impact: "yes"
depends_on:
  - "docs/SPEC_FLUTTER_SUPABASE_MIGRATION.md@0.1.0"
next_step: "/sf-start Migration totale VoiceFlowz vers Flutter + Supabase"
---

# Verification — VoiceFlowz Flutter + Supabase Migration

## Required Automated Checks

- `dart format --set-exit-if-changed .`
- `flutter analyze`
- `flutter test`
- `flutter build web`
- Android build on a machine with Android toolchain.
- Android overlay sanity (without full build when toolchain is heavy): verify `flutter analyze`, then run on Android and check start/stop/cancel/status from Settings and Voice screens.
- Supabase migration apply on local or test project.
- SQL/RLS tests from `docs/API_SUPABASE.md`.

## Required Manual Checks

- Android: local speech, advanced recording, overlay permission, accessibility fallback, clipboard fallback.
- iOS: microphone/speech permissions, advanced recording, secure key storage, sync.
- macOS/Windows/Linux: launch, auth, advanced recording, secure storage state, clipboard limits.
- Web: auth, microphone/clipboard permission behavior, advanced mode enabled only if direct/proxy contract is satisfied.

## Security Gate

- No client bundle contains a service role key.
- OpenAI/Anthropic keys are never synced to Supabase.
- Logs and copyable debug output redact keys, provider payloads, audio, and raw transcripts.
- Clipboard sync is opt-in and visibly pausable.
- RLS denies cross-user CRUD for every table.
- Overlay cannot silently start recording or inject without user action.
- AI and sync retries are bounded and time out visibly.

## Purge Gate

Before deleting legacy JS/TS application code:

1. Snapshot rollback archive exists and includes legacy app, Convex, overlay, and docs.
2. Flutter parity checks pass for Voice, Clipboard, Settings, Snippets, Dictionary, Auth, and Android overlay.
3. Supabase migrations and RLS tests pass.
4. Dry-run list of files to delete is reviewed.
5. Keep rules are explicit: keep docs, assets still referenced by Flutter, Supabase SQL, native platform files, Kotlin overlay code, and migration specs.
6. Post-purge search for JS/TS application code passes.
