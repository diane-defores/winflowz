# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-03-18

### Added
- Initial project setup with Expo SDK 55 + React Native 0.83
- Dual-mode voice transcription: free on-device (expo-speech-recognition) + advanced (Whisper API)
- AI text cleanup via Claude Haiku + local regex cleanup (filler words FR/EN)
- "Enhance with AI" button for per-transcription upgrade from free to advanced
- `useVoiceRecording` hook — reusable recording state machine with metering
- Audio waveform visualization component (animated bars from recorder metering)
- Clipboard sync via Convex (real-time polling, dedup, cross-device)
- In-app floating action button (FAB) — draggable, snap-to-edge, expand/collapse with waveform + cancel/done controls
- Native Android overlay module (Kotlin) — FloatingOverlayService, OverlayView, WaveformView
- System overlay via TYPE_APPLICATION_OVERLAY with foreground service
- Text injection: AccessibilityService (opt-in) + clipboard fallback (default)
- Overlay permissions hook (`useOverlayPermissions`) with guided setup in Settings
- Expo config plugin (`withFloatingOverlay`) for AndroidManifest permissions and service declarations
- Settings screen: API keys (SecureStore), language selector (10 languages), overlay permissions
- Convex schema: clipboardItems, transcriptions, snippets, dictionary tables
- Transcriptions auto-saved to Convex after every successful recording
- GitHub Actions CI: Android APK debug build on every push
- EAS Build config (development, preview, production profiles)
- CLAUDE.md with full project documentation
