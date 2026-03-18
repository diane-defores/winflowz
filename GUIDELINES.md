# Guidelines — VoiceFlowz

## Architecture technique

### Stack
- **React Native + Expo SDK 55** : framework mobile cross-platform
- **expo-router** : navigation file-based
- **Convex** : backend temps réel pour la synchronisation cross-device
- **Clerk** : authentification partagée avec WinFlowz

### Pipeline de transcription
1. **Capture** : `expo-audio` pour l'enregistrement vocal
2. **Transcription** : OpenAI Whisper API
3. **Nettoyage** : Claude Haiku (ponctuation, reformulation, mise en forme)
4. **Résultat** : copie automatique dans le clipboard via `expo-clipboard`

### Modules complémentaires
- `expo-speech-recognition` : reconnaissance vocale on-device en fallback
- `expo-secure-store` : stockage sécurisé des clés API

## Sécurité

- Les clés API sont stockées exclusivement dans `expo-secure-store`, jamais en clair dans le code ou les fichiers de configuration
- Les données vocales ne sont jamais stockées côté serveur. Le fichier audio est envoyé à Whisper, la transcription est retournée, et l'audio est supprimé
- L'authentification Clerk assure la sécurité des données synchronisées via Convex

## Ton et expérience produit

- **Efficace** : l'application doit être opérationnelle en une action
- **Discret** : pas d'interface chargée, pas de friction
- **Rapide** : le texte doit apparaître le plus vite possible après la fin de la dictée
- L'application doit être invisible dans le workflow de l'utilisateur : on parle, c'est transcrit, c'est terminé

## Design

- **Minimaliste** : un bouton principal (enregistrer), le résultat affiché immédiatement
- **Feedback visuel** : onde sonore animée pendant l'enregistrement
- **Mode sombre** par défaut, cohérent avec l'identité WinFlowz
- Transitions fluides entre les états (repos, enregistrement, transcription, résultat)

## Code

### Conventions
- **TypeScript strict** : `strict: true` dans `tsconfig.json`
- **Expo SDK 55** : pas d'Expo Go (modules natifs requis), builds via EAS
- Composants fonctionnels avec hooks
- Séparation claire entre logique métier (`lib/`) et interface (`components/`, `app/`)

### Performance
- Streaming de la transcription lorsque l'API le permet
- Feedback visuel immédiat pendant l'enregistrement (pas d'écran blanc)
- Optimisation du temps de démarrage de l'application

## Accessibilité

- **Touch targets** : zones tactiles larges (minimum 44x44 points)
- **VoiceOver** (iOS) et **TalkBack** (Android) : labels accessibles sur tous les éléments interactifs
- Contraste suffisant pour la lisibilité en toutes conditions
- Support des tailles de texte dynamiques du système
