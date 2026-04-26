---
artifact: brand_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-03-18"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "branding"
owner: "unknown"
confidence: "medium"
risk_level: "low"
docs_impact: "yes"
security_impact: "none"
evidence:
  - "lib/constants.ts"
  - "app/(tabs)/index.tsx"
  - "assets/icon.png"
depends_on:
  - "BUSINESS.md@0.1.0"
supersedes: []
next_review: "2026-05-26"
next_step: "$sf-docs update"
---

# Branding — VoiceFlowz

## Nom et identité

- **Nom** : VoiceFlowz — contraction de Voice + Flow + z, cohérente avec l'écosystème WinFlowz.
- **Promesse courte** : parler, nettoyer, copier.
- **Tagline actuelle dans l'app** : "Speak. Transcribe. Ship."
- **Tagline française utilisable** : "Parle. C'est écrit."

## Identité visuelle

### Cohérence écosystème

VoiceFlowz peut rester visuellement relié à WinFlowz, mais le code actuel utilise surtout une palette mobile sombre avec accents indigo et cyan. La documentation ne doit pas promettre un système visuel complet partagé avec WinFlowz tant que les tokens communs ne sont pas présents dans le repo.

### Couleurs

- **Fond sombre** : `#0f172a`
- **Surface** : `#1e293b`
- **Primaire** : `#6366f1`
- **Accent audio** : `#22d3ee`
- **Texte principal** : `#f8fafc`

### Accent audio

- Onde sonore animée pendant l'enregistrement.
- États visuels clairs : repos, enregistrement, traitement, résultat, erreur.
- Les animations servent le feedback fonctionnel.

## Typographie

- Polices système React Native.
- Hiérarchie simple : titre, sous-titre, résultat, historique.
- Le texte transcrit doit rester lisible et facile à copier ou modifier.

## Ton de voix

- Direct, productif, sans jargon.
- Orienté action : enregistrer, transcrire, copier, envoyer au clipboard partagé.
- Les messages de configuration doivent rester honnêtes sur les prérequis : clé OpenAI, clé Anthropic optionnelle, permissions Android, Convex.

## Valeurs de marque

| Valeur | Signification |
|---|---|
| Rapidité | L'utilisateur obtient vite un texte exploitable. |
| Discrétion | L'application doit rester légère dans le workflow mobile. |
| Précision | Le nettoyage IA améliore le texte sans changer l'intention. |
| Contrôle | Les clés API restent sur l'appareil et les permissions sont explicites. |
