---
artifact: architecture_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-27"
status: "reviewed"
source_skill: "sf-docs"
scope: "architecture"
owner: "Diane"
confidence: "high"
risk_level: "high"
docs_impact: "yes"
security_impact: "yes"
evidence:
  - "docs/SPEC_FLUTTER_SUPABASE_MIGRATION.md"
  - "docs/DECISIONS.md"
  - "docs/API.md"
  - "modules/floating-overlay/android/src/main/java/expo/modules/floatingoverlay/FloatingOverlayModule.kt"
linked_systems:
  - "Flutter"
  - "Supabase"
  - "Android overlay services"
external_dependencies:
  - "supabase_flutter"
  - "flutter_riverpod"
  - "go_router"
  - "record"
  - "speech_to_text"
invariants:
  - "Target implementation is Flutter + Supabase, not Expo/Convex/Clerk."
  - "All user data access is authorized by Supabase Auth + RLS."
  - "Android overlay stays native and exposes a stable Flutter bridge."
depends_on:
  - "docs/DECISIONS.md@0.1.0"
  - "docs/MIGRATION_FLUTTER.md@0.1.0"
supersedes: []
next_review: "2026-05-27"
next_step: "$sf-docs update"
---

# Architecture — VoiceFlowz

## Purpose

This document separates:

- legacy implementation reference (current Expo/Convex app),
- target implementation contract (Flutter + Supabase migration target).

Only the target section defines implementation direction.

## Legacy implementation (reference only)

Current codebase reference:

- Expo / React Native app shell with `expo-router`.
- Convex schema/functions for transcriptions, clipboard, snippets, dictionary.
- Clerk dependency present but not integrated in runtime auth flow.
- Android overlay implemented as native Kotlin Expo module bridge.
- `TEMP_USER_ID`/`local-user` pattern used in legacy data flow.

This stack is migration input only. It is not a target architecture.

## Target implementation contract

### Platform scope

Day 1 targets:

- Android
- iOS
- macOS
- Windows
- Linux
- web

Android has additional native overlay capabilities. Other platforms do not promise equivalent system overlay.

### Runtime architecture

```text
Flutter App (Dart)
  -> app shell + routing + state
  -> feature modules (voice, clipboard, settings, snippets, dictionary, auth, overlay)
  -> data repositories
  -> platform services
  -> Supabase client

Supabase
  -> Auth
  -> Postgres tables
  -> Row Level Security policies
  -> Realtime subscriptions

Android native
  -> overlay foreground service
  -> accessibility-based text injection
  -> Flutter bridge (plugin/platform channel)
```

### Layer contracts

1. Presentation layer (Flutter widgets):
   UI workflow only; no direct SQL/policy logic.
2. State layer (Riverpod providers/controllers):
   owns async state transitions and error surfaces.
3. Repository layer:
   owns Supabase queries/mutations/subscriptions.
4. Platform service layer:
   owns speech/audio/clipboard/secure-storage/overlay bridges.

### Data and auth contract

- Supabase Auth session is required for user-scoped data.
- User ownership source is `auth.uid()`, not client-provided ids.
- RLS must gate all user tables before multi-user readiness.
- Realtime updates are consumed only for current authenticated user scope.

### Voice pipeline contract

Free/local path:

- local speech recognition where supported by platform.

Advanced path:

- audio recording + Whisper transcription.
- optional Claude cleanup.
- local cleanup fallback when Claude is unavailable.

In all cases:

- empty/whitespace results are never persisted.
- final text remains copyable even if auto-injection fails.

### Android overlay contract

The Kotlin overlay module remains native and authoritative for:

- overlay permission flow,
- foreground service lifecycle,
- bubble events (`tap`, `stop`, `cancel`, `long-press`),
- accessibility text injection and fallback behavior.

Flutter integrates this through a narrow bridge interface; feature logic stays in Dart.

## Cross-cutting invariants

- No target design decision may depend on Convex/Clerk/Expo.
- API keys (OpenAI/Anthropic) remain local device secrets.
- Supabase stores product data, not user API keys.
- Platform limitations are explicit in UI and docs.
