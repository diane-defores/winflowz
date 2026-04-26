---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "readme"
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
  - "PRODUCT.md@0.1.0"
  - "ARCHITECTURE.md@0.1.0"
supersedes: []
evidence:
  - "package.json"
  - ".env.example"
  - "app/(tabs)/index.tsx"
  - "convex/schema.ts"
next_step: "$sf-docs update"
---

# VoiceFlowz

VoiceFlowz is a React Native Expo app for mobile voice typing, transcription history, shared clipboard sync and Android overlay dictation.

## Features

- Local on-device voice transcription with `expo-speech-recognition`.
- Advanced transcription through OpenAI Whisper when the user configures an OpenAI key.
- Optional cleanup through Anthropic Claude when the user configures an Anthropic key.
- Transcription history stored in Convex.
- Shared clipboard list with copy, pin and delete actions.
- Android floating overlay with clipboard fallback for text injection.
- Settings screen for API keys, language, overlay permissions and debug logs.

## Current Limitations

- Clerk is not integrated yet, even though the dependency exists.
- Convex data currently uses `TEMP_USER_ID = "local-user"`.
- Freemium quotas, premium plans, billing and entitlement logic are not implemented.
- Snippets and dictionary tables exist in Convex, but a complete product UI is not implemented.

## Quick Start

```bash
npm install
cp .env.example .env
npx convex dev
npm run start
```

For Android native overlay work:

```bash
npm run android
```

Expo Go is not enough for the native overlay module. Use a development build for overlay testing.

## Environment Variables

| Variable | Required | Status | Purpose |
|---|---:|---|---|
| `EXPO_PUBLIC_CONVEX_URL` | Yes | implemented | Convex deployment URL. |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | planned | Future Clerk auth integration. |

OpenAI and Anthropic keys are not stored in environment variables. They are entered in the Settings tab and stored locally with `expo-secure-store`.

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Start Expo dev server. |
| `npm run android` | Run Android development build. |
| `npm run ios` | Run iOS development build. |
| `npm run web` | Start Expo web. |

## Project Structure

```text
app/                         Expo Router screens and tabs
components/                  Shared UI and overlay bridge
hooks/                       Recording and permission hooks
lib/                         API clients, storage, constants, cleanup
convex/                      Convex schema, queries and mutations
modules/floating-overlay/    Android native overlay module
plugins/                     Expo config plugins
assets/                      App icons and splash assets
docs/                        Generated technical documentation
```

## Documentation

- `PRODUCT.md` — product workflows and non-goals.
- `ARCHITECTURE.md` — technical architecture and invariants.
- `GTM.md` — draft go-to-market assumptions.
- `GUIDELINES.md` — technical guidelines and security notes.
- `docs/API.md` — Convex functions.
- `docs/COMPONENTS.md` — component inventory.

## Verification

Run type checking after Convex generated files are available:

```bash
npx convex dev
npx tsc --noEmit
```
