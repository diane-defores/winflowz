---
artifact: gtm_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "gtm"
owner: "unknown"
confidence: "low"
risk_level: "medium"
docs_impact: "yes"
security_impact: "unknown"
evidence:
  - "BUSINESS.md"
  - "PRODUCT.md"
  - "app/(tabs)/settings.tsx"
depends_on:
  - "BUSINESS.md@0.1.0"
  - "BRANDING.md@0.1.0"
  - "PRODUCT.md@0.1.0"
supersedes: []
next_review: "2026-05-26"
next_step: "$sf-docs update"
---

# GTM — VoiceFlowz

## Statut

Ce GTM est un brouillon basé sur le code et les documents existants. Il ne doit pas être utilisé comme plan de lancement final sans validation du positionnement, du pricing, de l'authentification et des preuves produit.

## Segment prioritaire

Power users mobiles et professionnels indépendants qui :

- rédigent régulièrement des notes courtes ;
- veulent aller plus vite que la saisie clavier ;
- acceptent de configurer leurs propres clés API en phase bêta ;
- comprennent les permissions Android nécessaires pour l'overlay.

## Promesse publique sûre

"VoiceFlowz transforme la voix en texte copiable sur mobile, avec un mode local gratuit et un mode avancé via vos clés API."

## Promesses à éviter pour l'instant

- "Synchronisation sécurisée par compte" tant que Clerk n'est pas branché.
- "Freemium avec quotas" tant que les droits et le billing n'existent pas.
- "Premium illimité" sans infrastructure de quota.
- "Données vocales jamais stockées" sans audit complet du flux audio, des caches natifs et des fournisseurs externes.
- "Prêt entreprise" sans auth, politiques de rétention et garanties sécurité.

## Canaux possibles

- Démo courte auprès d'utilisateurs WinFlowz existants.
- Distribution interne Android APK pour premiers tests.
- Contenu produit orienté workflow : notes de réunion, email rapide, pensée capturée en déplacement.

## Objections probables

| Objection | Réponse actuelle |
|---|---|
| "Mes données vocales sont-elles privées ?" | Mode local disponible ; mode avancé envoie l'audio à OpenAI et le texte à Anthropic si activé. |
| "Est-ce synchronisé entre mes appareils ?" | Oui via Convex dans l'implémentation, mais l'isolation par compte réel attend Clerk. |
| "Faut-il payer ?" | Pas de billing implémenté. Les modes cloud utilisent les clés API de l'utilisateur. |
| "Est-ce utilisable dans d'autres apps ?" | Oui sur Android via overlay si les permissions système sont accordées. |

## Preuves à construire avant lancement public

- Test end-to-end Convex avec vraie URL de déploiement.
- Intégration Clerk et suppression de `TEMP_USER_ID`.
- Politique claire de données et fournisseurs.
- Mesures de latence et fiabilité sur appareils Android réels.
- Positionnement pricing validé par une implémentation de droits.
