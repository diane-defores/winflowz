---
artifact: firebase_foundation
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-05-10"
updated: "2026-05-10"
status: "reviewed"
source_skill: "sf-docs"
scope: "firebase-cli-foundation"
owner: "Diane"
confidence: "high"
security_impact: "high"
docs_impact: "high"
---

# Firebase CLI Foundation

This doc captures Firebase CLI commands for the backend-agnostic migration slice.

- Active Firebase project ID: `winflowz-dev`
- Display name may remain `WinFlowz Dev`; project IDs cannot use underscores.
- Target: Auth + Firestore, single development environment (`dev`)
- Adapter scope: `users/{uid}` private subtree for settings/clipboard/transcriptions/snippets/dictionaryTerms/clientEvents

## CLI bootstrap commands

```bash
firebase login
firebase projects:list
firebase use winflowz-dev
```

The repo includes `.firebaserc` aliases for `default` and `dev`, both pointing to
`winflowz-dev`.

## Deploy commands

From repo root:

```bash
firebase deploy --only firestore
```

To deploy rules or indexes separately:

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Emulator workflow

Start local emulators:

```bash
firebase emulators:start --only firestore,auth
```

Start emulators with persistent emulator-state export:

```bash
firebase emulators:start --only firestore,auth --import=./.firebase/emulator-data --export-on-exit
```

## Auth provider setup (required set)

- Anonymous
- Email/password
- Google

> Auth provider enablement is done in Firebase project settings. Re-run the local/prod command list above after provider and API key changes.

Android package name for Firebase app registration:

```text
com.voiceflowz.voiceflowz
```

Google Sign-In on Android also needs the app signing SHA fingerprints in the
Firebase Android app settings before a real-device auth smoke can pass.

## Flutter runtime defines

VoiceFlowz initializes Firebase conditionally. Missing values keep the app in
local mode instead of crashing.

```bash
flutter run \
  --dart-define=FIREBASE_PROJECT_ID=winflowz-dev \
  --dart-define=FIREBASE_DEV_API_KEY="$FIREBASE_DEV_API_KEY" \
  --dart-define=FIREBASE_DEV_APP_ID="$FIREBASE_DEV_APP_ID" \
  --dart-define=FIREBASE_DEV_MESSAGING_SENDER_ID="$FIREBASE_DEV_MESSAGING_SENDER_ID" \
  --dart-define=FIREBASE_DEV_AUTH_DOMAIN="$FIREBASE_DEV_AUTH_DOMAIN" \
  --dart-define=FIREBASE_DEV_STORAGE_BUCKET="$FIREBASE_DEV_STORAGE_BUCKET"
```

Runtime adapters currently use:

- Firebase Auth behind `AuthSessionStore`
- Firestore settings behind `SettingsStore`
- Firestore clipboard, transcriptions, snippets and dictionary stores behind
  feature store interfaces
- Local fallback when Firebase config or user session is missing
- Supabase only as legacy compatibility fallback when Firebase is not configured

## GitHub Secrets / Blacksmith list

Use repository secrets (do not introduce Doppler):

- `FIREBASE_PROJECT_ID` — target project alias/id (`winflowz-dev`)
- `FIREBASE_CLI_TOKEN` — deploy token for CI/manual operations
- `FIREBASE_DEV_API_KEY` — Android Firebase API key from generated client config
- `FIREBASE_DEV_APP_ID` — Android app id from generated client config
- `FIREBASE_DEV_MESSAGING_SENDER_ID` — message sender id for Android client config
- `FIREBASE_DEV_AUTH_DOMAIN` — auth domain for client config
- `FIREBASE_DEV_STORAGE_BUCKET` — storage bucket for client config

These secret names are prepared for Blacksmith environment injection with local fallback logic
enabled in the app when Firebase runtime is missing.
