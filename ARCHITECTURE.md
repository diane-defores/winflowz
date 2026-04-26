---
artifact: architecture_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "architecture"
owner: "unknown"
confidence: "medium"
risk_level: "medium"
docs_impact: "yes"
security_impact: "yes"
evidence:
  - "package.json"
  - "app.json"
  - "app/_layout.tsx"
  - "convex/schema.ts"
  - "modules/floating-overlay/index.ts"
  - "plugins/withFloatingOverlay.js"
depends_on:
  - "GUIDELINES.md@0.1.0"
  - "PRODUCT.md@0.1.0"
supersedes: []
next_review: "2026-05-26"
next_step: "$sf-docs update"
---

# Architecture — VoiceFlowz

## Vue d'ensemble

VoiceFlowz est une application React Native Expo avec navigation `expo-router`, backend Convex et module natif Android pour l'overlay flottant.

```text
app/                         Écrans Expo Router
components/                  Composants UI et pont overlay
hooks/                       Logique d'enregistrement et permissions
lib/                         Clients API, stockage, constantes, nettoyage
convex/                      Schéma, queries et mutations Convex
modules/floating-overlay/    Expo Module natif Android
plugins/                     Config plugin Expo pour AndroidManifest
assets/                      Icônes et splash
```

## Entrée applicative

`app/_layout.tsx` initialise `ConvexReactClient`, monte le `Stack` Expo Router et ajoute `OverlayBridge`. L'URL Convex vient de `EXPO_PUBLIC_CONVEX_URL` avec un fallback placeholder pour le développement.

## Navigation

Les écrans principaux sont sous `app/(tabs)/` :

- `index.tsx` : dictée, résultat, historique, édition et partage vers clipboard.
- `clipboard.tsx` : historique clipboard synchronisé.
- `settings.tsx` : clés API, langue, permissions overlay et logs.

## Backend Convex

### Tables

- `clipboardItems` : contenu, type, source, pin, `userId`.
- `transcriptions` : texte brut, texte nettoyé, langue, durée, source, `userId`.
- `snippets` : trigger, contenu, label, `userId`.
- `dictionary` : termes utilisateur et corrections optionnelles.

### Fonctions publiques

- `clipboard.list`, `clipboard.add`, `clipboard.togglePin`, `clipboard.remove`
- `transcriptions.list`, `transcriptions.save`, `transcriptions.update`, `transcriptions.remove`
- `snippets.list`, `snippets.findByTrigger`, `snippets.upsert`, `snippets.remove`

## Flux transcription

### Mode gratuit

```text
useVoiceRecording
  -> expo-speech-recognition
  -> cleanupLocal
  -> Convex transcriptions.save
  -> affichage / copie
```

### Mode avancé

```text
useVoiceRecording
  -> expo-audio
  -> OpenAI Whisper API
  -> Claude cleanup si clé Anthropic disponible
  -> fallback cleanupLocal
  -> Convex transcriptions.save
```

## Overlay Android

Le module `modules/floating-overlay` expose une API JS pour afficher, masquer et piloter le bouton flottant. `OverlayBridge` écoute les événements natifs, déclenche `useVoiceRecording`, pousse les états vers le module natif, puis copie ou injecte le texte final.

Le plugin `plugins/withFloatingOverlay.js` ajoute les permissions et services nécessaires au manifeste Android.

## Sécurité et limites actuelles

- Les clés API restent sur l'appareil via `expo-secure-store`.
- Les audios peuvent quitter l'appareil en mode Whisper.
- Les textes peuvent quitter l'appareil en nettoyage Claude.
- Les données Convex utilisent un `userId` temporaire tant que Clerk n'est pas intégré.
- Les fonctions Convex prennent `userId` en argument client, donc l'isolation utilisateur ne doit pas être considérée robuste avant auth serveur.

## Invariants

- Une transcription vide ne doit pas être sauvegardée.
- Le résultat final doit rester copiable même si l'injection Android échoue.
- Le mode avancé doit refuser l'enregistrement sans clé OpenAI.
- Les docs produit ne doivent pas promettre billing, quota ou auth tant que les invariants correspondants n'existent pas dans le code.
