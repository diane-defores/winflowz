---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.2.0"
project: "VoiceFlowz"
created: "2026-03-18"
updated: "2026-04-27"
status: "draft"
source_skill: "sf-docs"
scope: "update"
owner: "Diane"
confidence: "medium"
risk_level: "low"
security_impact: "unknown"
docs_impact: "yes"
linked_systems:
  - "OpenAI"
  - "Anthropic"
  - "Expo"
  - "Clerk"
  - "Convex"
depends_on:
  - "BUSINESS.md@0.1.0"
  - "PRODUCT.md@0.1.0"
supersedes: []
evidence:
  - "package.json"
  - "lib/whisper.ts"
  - "lib/ai-cleanup.ts"
  - "PRODUCT.md"
next_step: "$sf-docs update"
---

# Sources — VoiceFlowz

## APIs et services (observés dans le repo)

- **OpenAI Whisper API** — [platform.openai.com](https://platform.openai.com/docs/guides/speech-to-text) : moteur de transcription principal, modèles multilingues
- **Anthropic Claude Haiku API** — [docs.anthropic.com](https://docs.anthropic.com) : nettoyage et reformulation du texte transcrit

## Standards et documentation technique de référence

- **Web Speech API** — Standard W3C pour la reconnaissance vocale dans le navigateur
- **MediaRecorder API** — Capture audio standard pour les applications web et hybrides

- **Expo Audio** — [docs.expo.dev/versions/latest/sdk/audio](https://docs.expo.dev/versions/latest/sdk/audio/) : capture et lecture audio
- **expo-speech-recognition** — Reconnaissance vocale on-device
- **expo-clipboard** — Accès au clipboard système
- **expo-secure-store** — Stockage sécurisé des données sensibles
- **Expo SDK 55** — [docs.expo.dev](https://docs.expo.dev) : framework et outils de build
- **Clerk** — [clerk.com/docs](https://clerk.com/docs) : authentification prévue avec WinFlowz, dépendance présente mais intégration applicative non branchée
- **Convex** — [docs.convex.dev](https://docs.convex.dev) : backend temps réel et synchronisation

## Recherche externe à confirmer

- Productivité voice-first : études à sélectionner et dater.
- Ergonomie de la dictée : fatigue, précision, contextes d'usage.
- Accessibilité vocale : références W3C WAI à intégrer précisément.

## Questions ouvertes

- Quelles 3 sources externes "marché" sont validées officiellement pour les docs VoiceFlowz ?
- Faut-il maintenir une section "Communautés" ici, ou la déplacer dans `GTM.md` ?
