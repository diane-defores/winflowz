## 2026-05-11 - Android real-device overlay + IME QA

- Scope: feature
- Environment: local Android real device
- Tester: user
- Source: sf-test
- Status: fail
- Confidence: high
- Result summary: Overlay does not appear; Settings overlay button does not trigger visible activation despite overlay and accessibility permissions granted.
- Bug pointer: BUG-2026-05-11-001 -> shipflow_data/workflow/bugs/BUG-2026-05-11-001.md
- Evidence pointer: user-provided redacted Settings diagnostic copied at 2026-05-11 10:23:41 UTC.
- Follow-up: /sf-fix BUG-2026-05-11-001

## 2026-05-16 - Keyboard crash recovery Android real-device QA

- Scope: spec keyboard-resilience-and-error-management
- Environment: Android real device
- Tester: user
- Source: sf-test
- Status: fail
- Confidence: high
- Result summary: Crash recovery passed for `#+=`, `Prefs`, long press `123`, compact functional behavior, Termux flows; failures remain for `123` long-press discoverability and compact mode overlapped by Android bottom bar.
- Bug pointer: BUG-2026-05-16-002 -> bugs/BUG-2026-05-16-002.md; BUG-2026-05-16-003 -> bugs/BUG-2026-05-16-003.md
- Evidence pointer: user report in sf-test reply at 2026-05-16 08:34:01 UTC; no private diagnostic pasted.
- Follow-up: /sf-fix BUG-2026-05-16-003 then /sf-fix BUG-2026-05-16-002

## 2026-05-16 - Backend Provider logs panel retest

- Scope: bug BUG-2026-05-16-004
- Environment: Android real device / web Settings
- Tester: user
- Source: sf-test manual confirmation
- Status: pass
- Confidence: high
- Result summary: Backend Provider Logs and Diagnostics opens without the red Flutter assertion panel; previous unbounded log panel crash is fixed.
- Bug pointer: BUG-2026-05-16-004 -> bugs/BUG-2026-05-16-004.md
- Evidence pointer: user confirmation in chat at 2026-05-16 09:27:41 UTC.
- Follow-up: closed

## 2026-05-16 - Android keyboard Termux/modifier regression retest

- Scope: keyboard Android IME regression checks
- Environment: Android real device, Termux and other apps
- Tester: user
- Source: sf-test manual confirmation
- Status: pass
- Confidence: high
- Result summary: `Del` works in Termux and no longer activates `MAJ`; `Ctrl+J` inserts a newline; long press `MAJ` keeps shift active after the first letter.
- Bug pointer: none dedicated; removes these cases from the remaining manual QA checklist.
- Evidence pointer: user confirmation in chat at 2026-05-16 13:23:53 UTC.
- Follow-up: continue remaining action-bar/page-swipe, compact-mode, theme/effects, private-field checks.

## 2026-05-16 - Keyboard Theme Studio Android/web retest confirmations

- Scope: Keyboard Theme Studio and native keyboard theme behavior
- Environment: Android real device and web preview where applicable
- Tester: user
- Source: sf-test manual confirmation
- Status: pass
- Confidence: high
- Result summary: Theme preview container is sticky; color picker works; key gap setting works; key press effects work.
- Bug pointer: none dedicated in this run; these items are removed from the remaining manual QA checklist.
- Evidence pointer: user confirmations in chat before and at 2026-05-16 13:23:53 UTC.
- Follow-up: continue remaining Android action-bar pagination, action-row behavior, private-field, and compact-mode bottom spacing checks.

## 2026-05-16 - Media brightness controls
- Added Android `WRITE_SETTINGS` brightness onboarding and `Bri-`/`Bri+` media action row buttons.
- `flutter analyze`: PASS.
- `git diff --check`: PASS.
- `cd android && ./gradlew :app:compileDebugKotlin -x :app:processDebugResources`: PASS.
- Manual Android APK verification: pending.

## 2026-05-16 - Android manual QA retest from user
Environment: Android APK on real phone.

### PASS
- Media: Now with access shows current media when available.
- Media: App opens current media app.
- Media: Bri-/Bri+ with Write Settings permission changes brightness.
- Media: Prev, Play/Pause, Next still work.
- Media paged row: horizontal swipe is page-by-page.
- Media paged row: page 2 shows Bri-/Bri+.
- Onboarding: Android settings buttons redirect correctly.
- Onboarding: skip recommended steps still works.
- Navigation: DelW← works.
- Navigation: DelW→ works in Termux, SMS, browser, email.
- Navigation: Début/Fin work in non-Termux text apps.
- Termux: Del, Ctrl+J, long-press MAJ, Paste work.
- Action bars: main bar compact, contextual bars page-swipe, Nav pinning, pinned color all pass.
- Compact: ABC, preferences, bottom positioning, bottom bar overlap pass.
- Theme: sticky preview, color picker, gaps, effects, action-bar coloring, preview key widths pass.
- Layout: DEL/ENTER widths, letter alignment, symbols layout, Escape, 10-digit row pass.
- Logs: diagnostic panel opens and collapses.

### FAIL / unresolved
- DelW→ in Obsidian Android deletes one letter left instead of one word right.
- Début/Fin fail in Termux.
- Copy/Cut fail in Termux.
- Compact mode fails for navigation/media/clipboard/symbols/accents panels.
- Diagnostic text does not include mediaSessionAccessGranted/systemSettingsWriteGranted labels.
- Clear logs button not confirmed.

### Fixes applied after this QA
- Diagnostic now exposes media_session_access and system_settings_write.
- Compact panel mode suppresses typing rows for active panels, and navigation has a compact 2-row scrollable panel.
- Obsidian DelW→ now avoids the direct delete-after-cursor path and uses Ctrl+ForwardDelete fallback.
- Termux Début/Fin now use Ctrl+A/Ctrl+E fallback.
