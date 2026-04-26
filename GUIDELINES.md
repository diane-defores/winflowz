---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-03-18"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "guidelines"
owner: "unknown"
confidence: "medium"
risk_level: "medium"
docs_impact: "yes"
security_impact: "yes"
evidence:
  - "package.json"
  - "app.json"
  - "app/_layout.tsx"
  - "hooks/useVoiceRecording.ts"
  - "lib/storage.ts"
  - "convex/schema.ts"
depends_on:
  - "BUSINESS.md@0.1.0"
supersedes: []
next_review: "2026-05-26"
next_step: "$sf-docs update"
---

# Guidelines — VoiceFlowz

## Architecture technique

### Stack vérifiée

- **React Native 0.83 + Expo SDK 55** : framework mobile cross-platform.
- **expo-router** : navigation file-based dans `app/`.
- **Convex** : backend temps réel pour clipboard, transcriptions et snippets.
- **expo-speech-recognition** : transcription locale gratuite.
- **expo-audio** : enregistrement audio pour le mode avancé.
- **OpenAI Whisper API** : transcription cloud en mode avancé.
- **Anthropic Messages API** : nettoyage optionnel via Claude quand une clé Anthropic est configurée.
- **expo-secure-store** : stockage local des clés API et de la langue préférée.
- **Expo native module Kotlin** : overlay Android.

### Authentification

Clerk est présent dans les dépendances et documenté comme cible d'intégration, mais il n'est pas encore branché dans le flux applicatif. Le code utilise encore `TEMP_USER_ID = "local-user"` dans les écrans et hooks principaux. Toute promesse de comptes utilisateurs réels, permissions par utilisateur ou sécurité multi-utilisateur doit rester `planned` tant que Clerk n'est pas intégré.

### Pipeline de transcription

1. **Mode gratuit** : `expo-speech-recognition` récupère une transcription locale avec résultats intermédiaires.
2. **Nettoyage local** : `cleanupLocal()` retire certains mots de remplissage et améliore la ponctuation de base.
3. **Mode avancé** : `expo-audio` enregistre un fichier audio, puis `lib/whisper.ts` l'envoie à Whisper.
4. **Nettoyage IA optionnel** : `lib/ai-cleanup.ts` appelle Claude si une clé Anthropic est configurée.
5. **Résultat** : le texte est affiché, copiable, et peut être sauvegardé dans Convex.

## Sécurité et données

- Les clés OpenAI et Anthropic sont stockées via `expo-secure-store`.
- Les clés API ne sont pas envoyées à Convex par le code actuel.
- Le mode avancé envoie l'audio à OpenAI Whisper.
- Le nettoyage IA envoie le texte transcrit à Anthropic si la clé Anthropic existe.
- Les transcriptions et éléments de clipboard sont stockés dans Convex avec un `userId` temporaire tant que Clerk n'est pas branché.
- Ne pas présenter la synchronisation Convex comme isolée par compte réel avant remplacement de `TEMP_USER_ID`.

## Expérience produit

- L'écran Voice doit privilégier l'action principale : enregistrer, voir le texte, copier, modifier ou envoyer vers le clipboard partagé.
- L'écran Clipboard doit rester scannable, avec actions rapides : copier, épingler, supprimer.
- Les réglages doivent expliquer clairement les prérequis : clés API, langue, permissions Android.
- L'overlay Android doit toujours avoir un fallback clipboard si l'injection texte échoue.

## Code

### Conventions

- TypeScript strict.
- Composants fonctionnels et hooks React.
- Logique métier dans `hooks/` et `lib/`.
- Mutations et queries Convex dans `convex/`.
- Aucun secret dans `.env.example`, le code ou les docs.

### Points de vigilance

- Remplacer `TEMP_USER_ID` par l'identifiant Clerk avant tout usage multi-utilisateur.
- Documenter toute modification du schéma Convex dans `ARCHITECTURE.md` et `docs/API.md`.
- Vérifier Android après toute modification de l'overlay ou du plugin Expo.
- Ne pas ajouter de promesse premium sans modèle de droits, quota et billing.

## Accessibilité

- Les zones tactiles doivent rester larges, au minimum 44x44 points.
- Les actions critiques doivent avoir des labels explicites.
- Les permissions Android doivent être guidées pas à pas.
- Les états erreur et traitement doivent être lisibles sans dépendre uniquement de la couleur.
