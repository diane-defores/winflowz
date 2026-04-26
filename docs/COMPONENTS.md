---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "components"
owner: "unknown"
confidence: "medium"
security_impact: "none"
docs_impact: "yes"
linked_systems:
  - "React Native"
depends_on:
  - "../ARCHITECTURE.md@0.1.0"
supersedes: []
evidence:
  - "../components/AudioWaveform.tsx"
  - "../components/RecordingControls.tsx"
  - "../components/OverlayFAB.tsx"
  - "../components/OverlayBridge.tsx"
next_step: "$sf-docs components"
---

# Components — VoiceFlowz

## `AudioWaveform`

- **File**: `components/AudioWaveform.tsx`
- **Purpose**: Displays animated audio bars based on recording meter level.
- **Main props**:
  - `meterLevel`: numeric level used for bar height.
  - `isActive`: controls active animation state.
- **Used by**: Voice screen and recording controls.

## `RecordingControls`

- **File**: `components/RecordingControls.tsx`
- **Purpose**: Shared recording control surface with cancel, waveform and done actions.
- **Main props**:
  - recording state.
  - meter level.
  - cancel and stop callbacks.
- **Used by**: Recording UI surfaces.

## `OverlayFAB`

- **File**: `components/OverlayFAB.tsx`
- **Purpose**: In-app draggable floating action button.
- **Status**: Present in the codebase, but the root layout currently mounts `OverlayBridge`, not `OverlayFAB`.
- **Notes**: Keep documentation and usage in sync if this component becomes active again.

## `OverlayBridge`

- **File**: `components/OverlayBridge.tsx`
- **Purpose**: Non-visual bridge between native Android overlay events and the JS recording hook.
- **Behavior**:
  - listens for bubble tap, stop, cancel and long-press events;
  - starts and stops `useVoiceRecording`;
  - updates native overlay state;
  - copies or injects final text.
- **Render output**: `null`.

## Screen Components

### `VoiceScreen`

- **File**: `app/(tabs)/index.tsx`
- **Purpose**: Main dictation workflow, current transcript, history, edit and shared clipboard actions.

### `ClipboardScreen`

- **File**: `app/(tabs)/clipboard.tsx`
- **Purpose**: Clipboard sync list with copy, pin and delete actions.

### `SettingsScreen`

- **File**: `app/(tabs)/settings.tsx`
- **Purpose**: API key storage, language choice, overlay setup and debug logs.

## Documentation Gaps

This is an inventory-level component doc. Add exact TypeScript prop tables if component APIs become public or reused outside this app.
