---
artifact: decision_log
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-26"
status: "draft"
scope: "product_and_platform"
owner: "unknown"
confidence: "medium"
---

# Decisions — VoiceFlowz

## 2026-04-26 — Long-term platform direction

### Decision

VoiceFlowz keeps its current Expo / React Native implementation for now, but the long-term reference direction is **Flutter** if the product strategy remains centered on a premium app-like experience across mobile and potentially desktop.

This is a **directional product/platform decision**, not an immediate migration commitment.

### Why

The decision explicitly ignores migration cost and focuses on the long-term platform trade-off.

For VoiceFlowz, Flutter is considered the stronger long-term target when optimizing for:

- runtime performance
- UI consistency across platforms
- app-like multi-platform expansion
- stronger control over rendering and interaction quality
- a future mobile + desktop trajectory

Expo / React Native remains the better fit when optimizing for:

- team velocity in a JS/TS ecosystem
- web adjacency
- recruiting flexibility
- breadth of third-party integrations

### Product framing

The current conclusion assumes VoiceFlowz is primarily an **app-centric productivity tool**, not a web-centric product.

```text
If VoiceFlowz evolves toward:
- premium dictation UX
- controlled app experience
- mobile + desktop

=> Flutter is the preferred long-term platform

If VoiceFlowz evolves toward:
- strong web surface
- ecosystem leverage
- fastest JS-team iteration

=> Expo / React Native remains the better platform
```

### Current stance

- Do not treat this as a migration order.
- Do treat this as the reference decision for future platform discussions.
- Revisit only if the product strategy shifts toward web-first distribution or away from app-centric UX.
