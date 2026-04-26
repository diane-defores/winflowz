---
artifact: business_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-03-18"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "business"
owner: "unknown"
confidence: "medium"
risk_level: "medium"
docs_impact: "yes"
security_impact: "unknown"
evidence:
  - "package.json"
  - "app/(tabs)/index.tsx"
  - "app/(tabs)/clipboard.tsx"
  - "hooks/useVoiceRecording.ts"
  - "convex/schema.ts"
depends_on: []
supersedes: []
next_review: "2026-05-26"
next_step: "$sf-docs update"
---

# Business — VoiceFlowz

## Statut de preuve

Ce document distingue l'état actuel du produit de la vision commerciale. Les capacités marquées `implemented` sont visibles dans le code actuel. Les capacités marquées `planned` ne doivent pas être utilisées comme promesse publique tant qu'elles ne sont pas implémentées et vérifiées.

## Mission

Libérer les mains des professionnels grâce à la dictée vocale intelligente, en transformant la parole en texte propre et exploitable rapidement.

## Proposition de valeur

VoiceFlowz est une application mobile de dictée vocale et de synchronisation de clipboard. Le produit combine une transcription locale gratuite, une transcription cloud via Whisper quand l'utilisateur fournit une clé OpenAI, un nettoyage IA optionnel via Claude quand l'utilisateur fournit une clé Anthropic, et un historique synchronisé via Convex.

## Capacités actuelles

| Capacité | Statut | Preuve |
|---|---|---|
| Dictée locale on-device | implemented | `expo-speech-recognition`, `useVoiceRecording` |
| Dictée avancée Whisper | implemented | `lib/whisper.ts`, clé OpenAI stockée localement |
| Nettoyage IA Claude | implemented | `lib/ai-cleanup.ts`, clé Anthropic optionnelle |
| Historique de transcriptions | implemented | `convex/transcriptions.ts`, écran Voice |
| Clipboard partagé via Convex | implemented | `convex/clipboard.ts`, écran Clipboard |
| Overlay Android natif | implemented | `modules/floating-overlay`, `OverlayBridge` |
| Authentification Clerk | planned | dépendance présente, pas encore branchée dans les écrans |
| Quotas gratuits / premium | planned | aucune logique de quota ou billing dans le code |
| Modèles de nettoyage personnalisés | planned | table `snippets` disponible, pas d'interface dédiée complète |

## Modèle commercial

Le modèle cible est freemium, mais la logique de pricing, de quota, de billing et de droits premium n'est pas implémentée dans le code actuel.

### Offre actuelle vérifiée

- L'utilisateur peut enregistrer et transcrire depuis l'application.
- Les clés OpenAI et Anthropic sont saisies dans les réglages et stockées sur l'appareil via `expo-secure-store`.
- La synchronisation Convex utilise encore un identifiant local temporaire (`local-user`) tant que Clerk n'est pas branché.

### Offre cible à ne pas promettre publiquement sans implémentation

- 30 minutes gratuites par jour.
- Dictée illimitée premium.
- Priorité API.
- Modèles de nettoyage personnalisés prêts à l'emploi.
- Authentification et droits premium partagés avec WinFlowz.

## Persona principal

**Le Multitâche**

- Professionnel mobile : commercial, consultant, manager ou indépendant.
- Rédige des emails, notes de réunion et comptes-rendus en déplacement.
- Enchaîne les contextes de travail et veut capturer l'information sans taper.
- Valorise la vitesse, la précision et la disponibilité immédiate du texte.

## Marché cible

- **Segment** : productivité mobile, dictée vocale, voice-to-text.
- **Usage prioritaire** : transformer une pensée ou une note vocale courte en texte exploitable.
- **Contrainte produit** : ne pas promettre une sécurité, une conformité, un quota ou une disponibilité cloud non vérifiés par l'implémentation.

## Avantage concurrentiel

1. **Pipeline hybride** : transcription locale pour l'usage rapide, Whisper pour la précision, Claude pour le nettoyage quand les clés sont configurées.
2. **Overlay Android** : possibilité de déclencher la dictée hors de l'écran principal, selon les permissions système.
3. **Clipboard partagé** : les transcriptions peuvent être copiées ou envoyées vers un clipboard synchronisé.

## Stratégie Go-to-Market

- Lancement initial auprès d'utilisateurs techniques ou power users capables de configurer leurs clés API.
- Positionnement à court terme : outil de productivité personnel en bêta technique.
- Positionnement futur : module voice-first de l'écosystème WinFlowz, après intégration Clerk, quotas et packaging premium.

## Métriques clés

| Métrique | Statut | Description |
|---|---|---|
| Minutes transcrites | planned | Nécessite instrumentation produit |
| Nombre de transcriptions | implemented partially | Déductible de Convex par utilisateur local |
| Utilisation du clipboard partagé | implemented partially | Déductible de `clipboardItems` |
| Conversion premium | planned | Nécessite billing et auth |
| Taux d'erreur transcription | planned | Nécessite instrumentation |
