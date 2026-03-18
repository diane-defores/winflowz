# CLAUDE.md — VoiceFlowz

## Project Overview

**VoiceFlowz** is a cross-platform voice typing + clipboard sync app, part of the WinFlowz productivity ecosystem. Built with React Native (Expo). Features dual-mode transcription (free on-device + paid cloud), a floating overlay button for system-wide dictation on Android, and real-time clipboard sync via Convex.

## Stack

- **Framework**: React Native 0.83 + Expo SDK 55
- **Routing**: expo-router (file-based)
- **Backend**: Convex (real-time sync)
- **Auth**: Clerk (shared with WinFlowz via `@clerk/clerk-expo`)
- **Transcription**: OpenAI Whisper API (advanced) + expo-speech-recognition (free, on-device)
- **AI Cleanup**: Claude Haiku (Anthropic API) + local regex cleanup
- **Audio**: expo-audio (recording + metering)
- **Clipboard**: expo-clipboard
- **Secure Storage**: expo-secure-store (API keys stored on-device only)
- **Animations**: react-native-reanimated + Animated API
- **Native Module**: Custom Expo Module in Kotlin (Android overlay)
- **CI**: GitHub Actions (Android APK build on push)

## Commands

```bash
npx expo start              # Dev server (Expo Go)
npx expo run:android        # Android dev build (requires native module)
npx expo prebuild --platform android  # Generate native project
npx convex dev              # Convex backend (generates types)
npx tsc --noEmit            # Type check (convex/ errors expected until `convex dev` runs)
npx eas build --platform android --profile preview  # Build APK via EAS
```

## Architecture

```
app/
├── _layout.tsx              # Root layout (ConvexProvider + OverlayFAB)
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation (Voice, Clipboard, Settings)
│   ├── index.tsx            # Voice recording screen (uses useVoiceRecording hook)
│   ├── clipboard.tsx        # Clipboard history + sync via Convex
│   └── settings.tsx         # API keys, language, overlay permissions
hooks/
├── useVoiceRecording.ts     # Core recording logic (free + advanced modes, Convex save)
└── useOverlayPermissions.ts # Android overlay + accessibility permission flow
components/
├── AudioWaveform.tsx        # Animated audio bars (meter level visualization)
├── RecordingControls.tsx    # Shared UI: cancel (X) + waveform + done (✓)
└── OverlayFAB.tsx           # In-app draggable FAB (PanResponder, snap-to-edge)
lib/
├── whisper.ts               # OpenAI Whisper API client
├── ai-cleanup.ts            # Claude Haiku text cleanup
├── cleanup-local.ts         # Local regex cleanup (filler words FR/EN)
├── constants.ts             # Colors (dark/light), config
└── storage.ts               # SecureStore for API keys
convex/
├── schema.ts                # clipboardItems, transcriptions, snippets, dictionary
├── clipboard.ts             # CRUD + dedup + sync
├── transcriptions.ts        # Transcription history (save/list/remove)
└── snippets.ts              # Reusable text blocks with triggers
modules/floating-overlay/    # Custom Expo Module (Android only)
├── expo-module.config.json  # Module registration
├── index.ts                 # JS bridge API
├── android/.../
│   ├── FloatingOverlayModule.kt      # Expo Module entry point
│   ├── FloatingOverlayService.kt     # Foreground service + WindowManager
│   ├── OverlayView.kt               # Native overlay UI (4 states)
│   ├── WaveformView.kt              # Canvas waveform bars
│   ├── TextInjectionHelper.kt       # Clipboard + Accessibility injection
│   └── TextInjectionAccessibilityService.kt  # Optional a11y service
plugins/
└── withFloatingOverlay.js   # Config plugin (AndroidManifest permissions + services)
```

## Key Patterns

### Dual-Mode Transcription
- **Free mode**: expo-speech-recognition → on-device, streaming, Google/Apple engine → cleanupLocal()
- **Advanced mode**: expo-audio record → Whisper API (cloud) → Claude Haiku cleanup → cleanedText
- Both modes auto-save to Convex `transcriptions` table via `useVoiceRecording` hook

### Floating Overlay (Android)
- **In-app FAB**: `OverlayFAB.tsx` — draggable, snap-to-edge, expand to pill (waveform + X + ✓)
- **System overlay**: `FloatingOverlayService.kt` — TYPE_APPLICATION_OVERLAY, foreground service
- **Text injection**: Tier 1 (Accessibility `ACTION_SET_TEXT`) → Tier 2 (clipboard + toast)
- Permissions: `SYSTEM_ALERT_WINDOW`, `FOREGROUND_SERVICE_MICROPHONE`, optional Accessibility Service

### API Keys
- Stored on-device only (expo-secure-store), never sent to Convex
- OpenAI key required for advanced mode, Anthropic key optional for AI cleanup
- Set via Settings tab

### Clipboard Sync
- Polls clipboard every 2s, deduplicates, syncs to Convex in real-time
- Cross-device sync via Convex subscriptions

## Relation to WinFlowz

- Same Clerk auth (shared user accounts)
- Same Convex backend (can share data)
- Complements Module VIII (shortcuts/productivity tools)
- Future: integrate as premium feature of WinFlowz Pro tier

## Context MCP — Token-Saving Protocol

This project uses a local codebase MCP server for efficient context management.

### Every turn:
1. **Call `context_continue` FIRST** — returns files already in memory, avoids re-reads.
2. **Call `context_retrieve`** with your query to find relevant files.
3. **Use `context_read`** instead of Read for code exploration (tracks token budget).
4. **After editing**, call `context_register_edit` with a one-sentence summary.

See `/home/claude/ShipFlow/tools/codebase-mcp/README.md` for full tool reference.
