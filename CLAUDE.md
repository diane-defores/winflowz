---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-03-18"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "update"
owner: "unknown"
confidence: "medium"
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "Convex"
  - "OpenAI Whisper"
  - "Anthropic"
  - "Expo"
depends_on:
  - "BUSINESS.md@0.1.0"
  - "PRODUCT.md@0.1.0"
  - "ARCHITECTURE.md@0.1.0"
  - "GUIDELINES.md@0.1.0"
supersedes: []
evidence:
  - "package.json"
  - "app/_layout.tsx"
  - "hooks/useVoiceRecording.ts"
  - "convex/schema.ts"
next_step: "$sf-docs update"
---

# CLAUDE.md — VoiceFlowz

## Project Overview

VoiceFlowz is a React Native Expo app for mobile voice typing and clipboard sync. It supports local on-device speech recognition, optional Whisper transcription through the user's OpenAI key, optional Claude cleanup through the user's Anthropic key, Convex-backed history, and an Android floating overlay.

Clerk is installed as a dependency but is not wired into the app yet. The current implementation still uses `TEMP_USER_ID = "local-user"` for Convex data.

## Stack

- **Framework**: React Native 0.83 + Expo SDK 55
- **Routing**: expo-router
- **Backend**: Convex
- **Auth**: Clerk dependency present, integration planned
- **Transcription**: `expo-speech-recognition` locally, OpenAI Whisper in advanced mode
- **AI Cleanup**: Anthropic Messages API when a key is configured, local regex fallback
- **Audio**: expo-audio
- **Clipboard**: expo-clipboard
- **Secure Storage**: expo-secure-store
- **Native Module**: Custom Expo Module in Kotlin for Android overlay
- **CI**: GitHub Actions Android APK build

## Commands

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
npx expo prebuild --platform android
npx convex dev
npx tsc --noEmit
npx eas build --platform android --profile preview
```

## Architecture

```text
app/
├── _layout.tsx              # Root layout: ConvexProvider + Stack + OverlayBridge
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation
│   ├── index.tsx            # Voice recording, history, edit, share
│   ├── clipboard.tsx        # Clipboard history and sync via Convex
│   └── settings.tsx         # API keys, language, overlay permissions, logs
hooks/
├── useVoiceRecording.ts     # Recording state machine and transcription pipeline
└── useOverlayPermissions.ts # Android overlay and accessibility permission flow
components/
├── AudioWaveform.tsx        # Animated audio bars
├── RecordingControls.tsx    # Shared recording controls
├── OverlayFAB.tsx           # In-app draggable FAB component
└── OverlayBridge.tsx        # JS bridge for native overlay events
lib/
├── whisper.ts               # OpenAI Whisper API client
├── ai-cleanup.ts            # Anthropic cleanup client
├── cleanup-local.ts         # Local cleanup for filler words and punctuation
├── constants.ts             # Colors and config constants
├── debug-log.ts             # In-app debug log buffer
└── storage.ts               # SecureStore helpers
convex/
├── schema.ts                # clipboardItems, transcriptions, snippets, dictionary
├── clipboard.ts             # Clipboard queries and mutations
├── transcriptions.ts        # Transcription queries and mutations
└── snippets.ts              # Snippet queries and mutations
modules/floating-overlay/    # Android native overlay module
plugins/
└── withFloatingOverlay.js   # Expo config plugin for Android manifest changes
```

## Key Patterns

### Dual-Mode Transcription

- **Free mode**: `expo-speech-recognition` runs on device and feeds `cleanupLocal()`.
- **Advanced mode**: `expo-audio` records audio, Whisper transcribes it, then Claude cleanup runs if an Anthropic key exists.
- Both modes can save transcriptions to Convex through `useVoiceRecording`.

### Floating Overlay

- `OverlayBridge` listens to native overlay events and uses `useVoiceRecording`.
- Native Android code manages the floating button and text injection.
- Text injection should fall back to clipboard when accessibility injection fails.

### API Keys

- OpenAI and Anthropic keys are stored on device via `expo-secure-store`.
- Keys are not sent to Convex by the current implementation.
- OpenAI is required for advanced mode. Anthropic is optional.

### Clipboard Sync

- The Clipboard screen polls local clipboard content every 2 seconds.
- New content is saved to Convex and deduplicated against the latest item.
- Data is scoped by a temporary `local-user` until Clerk is integrated.

## Known Gaps

- Replace `TEMP_USER_ID` with Clerk user identity.
- Add server-side authorization rules for Convex functions.
- Add billing, quota and premium entitlement logic before public freemium claims.
- Add complete snippets and dictionary UI if those tables become product features.

## Related Docs

- `README.md` — setup and project overview.
- `PRODUCT.md` — product workflows, non-goals and current status.
- `ARCHITECTURE.md` — technical architecture and invariants.
- `GTM.md` — draft go-to-market assumptions.
- `docs/API.md` — Convex functions and schemas.
- `docs/COMPONENTS.md` — UI component inventory.
