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
confidence: "low"
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
next_step: "$sf-docs update"
---

# Sources — VoiceFlowz

## APIs et services

- **OpenAI Whisper API** — [platform.openai.com](https://platform.openai.com/docs/guides/speech-to-text) : moteur de transcription principal, modèles multilingues
- **Anthropic Claude Haiku API** — [docs.anthropic.com](https://docs.anthropic.com) : nettoyage et reformulation du texte transcrit

## Recherche

- **Productivité voice-first** : études à vérifier sur l'efficacité de la dictée vocale comparée à la saisie clavier
- **Ergonomie de la dictée vocale** : recherches sur la fatigue, la précision et les contextes d'utilisation optimaux
- **Accessibilité** : W3C WAI, guidelines pour les interfaces vocales

## Standards techniques

- **Web Speech API** — Standard W3C pour la reconnaissance vocale dans le navigateur
- **MediaRecorder API** — Capture audio standard pour les applications web et hybrides

## Documentation technique

- **Expo Audio** — [docs.expo.dev/versions/latest/sdk/audio](https://docs.expo.dev/versions/latest/sdk/audio/) : capture et lecture audio
- **expo-speech-recognition** — Reconnaissance vocale on-device
- **expo-clipboard** — Accès au clipboard système
- **expo-secure-store** — Stockage sécurisé des données sensibles
- **Expo SDK 55** — [docs.expo.dev](https://docs.expo.dev) : framework et outils de build
- **Clerk** — [clerk.com/docs](https://clerk.com/docs) : authentification prévue avec WinFlowz, dépendance présente mais intégration applicative non branchée
- **Convex** — [docs.convex.dev](https://docs.convex.dev) : backend temps réel et synchronisation

## Données de marché

- **Grand View Research** — Rapports sur le marché de la reconnaissance vocale
- **Mordor Intelligence** — Analyse du segment voice-to-text et tendances d'adoption

## Communautés

- **r/voiceacting** — Communauté Reddit autour de la voix et de l'audio
- **r/accessibility** — Discussions sur l'accessibilité numérique et les interfaces vocales
- **Expo Discord** — Communauté officielle Expo pour le support technique et les retours développeurs
