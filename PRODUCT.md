---
artifact: product_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "product"
owner: "unknown"
confidence: "medium"
risk_level: "medium"
docs_impact: "yes"
security_impact: "unknown"
evidence:
  - "app/(tabs)/index.tsx"
  - "app/(tabs)/clipboard.tsx"
  - "app/(tabs)/settings.tsx"
  - "hooks/useVoiceRecording.ts"
  - "components/OverlayBridge.tsx"
depends_on:
  - "BUSINESS.md@0.1.0"
  - "BRANDING.md@0.1.0"
supersedes: []
next_review: "2026-05-26"
next_step: "$sf-docs update"
---

# Product — VoiceFlowz

## Problème utilisateur

Les utilisateurs mobiles produisent souvent du texte dans des contextes où taper est lent, peu pratique ou interrompt le flux de travail. VoiceFlowz vise à transformer rapidement la parole en texte copiable, modifiable et réutilisable.

## Utilisateurs cibles

- Professionnels mobiles qui rédigent des notes, emails ou comptes-rendus courts.
- Power users qui acceptent de configurer leurs propres clés API pour obtenir une meilleure transcription.
- Utilisateurs Android qui veulent déclencher la dictée depuis d'autres applications via un overlay.

## Workflows cœur

### Dictée rapide

1. L'utilisateur ouvre l'onglet Voice.
2. Il choisit le mode gratuit ou avancé.
3. Il enregistre sa voix.
4. VoiceFlowz affiche le texte.
5. L'utilisateur copie, modifie ou envoie le texte vers le clipboard partagé.

### Mode avancé

1. L'utilisateur ajoute une clé OpenAI dans Settings.
2. Il passe en mode Advanced.
3. L'app enregistre un fichier audio local.
4. Le fichier est envoyé à Whisper.
5. Le texte est nettoyé localement ou via Claude si une clé Anthropic est configurée.

### Clipboard partagé

1. L'app surveille le clipboard local.
2. Les nouveaux contenus sont ajoutés à Convex.
3. L'utilisateur peut copier, épingler ou supprimer les éléments listés.

### Overlay Android

1. L'utilisateur active les permissions Android dans Settings.
2. Le bouton flottant déclenche l'enregistrement.
3. Le résultat est copié ou injecté selon les permissions disponibles.

## Fonctionnalités implémentées

- Onglet Voice avec transcription locale et avancée.
- Historique des transcriptions via Convex.
- Édition d'une transcription sauvegardée.
- Envoi d'une transcription vers le clipboard partagé.
- Onglet Clipboard avec polling local, synchronisation Convex, pin et suppression.
- Onglet Settings pour clés API, langue, permissions overlay et logs.
- Overlay Android natif avec pont JS.

## Fonctionnalités prévues

- Authentification Clerk réellement branchée.
- Isolation des données par compte utilisateur réel.
- Quotas, premium, billing et droits d'accès.
- Interface complète pour snippets et dictionnaire personnel.
- Instrumentation produit pour métriques d'usage.

## Non-goals actuels

- Ne pas promettre une solution entreprise ou conformité avancée.
- Ne pas promettre une synchronisation multi-utilisateur sécurisée tant que `TEMP_USER_ID` existe.
- Ne pas promettre de quotas gratuits ou premium tant que la logique de droits n'existe pas.
- Ne pas présenter le stockage Convex comme chiffré de bout en bout sans preuve technique.
