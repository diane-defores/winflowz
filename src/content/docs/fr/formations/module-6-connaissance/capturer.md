---
title: "Capturer & Collecter"
description: "Outils et méthodes pour archiver le web, enregistrer ton écran, gérer tes médias et ne rien perdre."
sidebar:
  label: "Capturer"
  order: 2
---

La capture est la première étape du PKM. Si tu ne captures pas, tu oublies. Et ce que tu oublies ne peut ni t'inspirer ni te servir plus tard.

> Capture d'abord, organise ensuite. Le pire ennemi de la capture, c'est le perfectionnisme organisationnel.

## Archivage web

### Monolith

Monolith sauvegarde une page web complète en un seul fichier HTML — images, CSS et scripts inclus. Pas de dépendance externe, pas de lien cassé.

| Avantage | Détail |
|----------|--------|
| **Fichier unique** | Tout est embarqué dans un seul .html |
| **Hors-ligne** | Fonctionne sans connexion après sauvegarde |
| **Ligne de commande** | Automatisable dans tes scripts |
| **Fidélité** | Rendu quasi identique à la page originale |

### Webscape

Webscape est un hub central pour organiser tout ce que tu captures :

- **Collections** pour catégoriser l'information par thème ou projet
- **Workspaces** pour séparer tes différents contextes de travail
- **Recherche full-text** dans tout ton contenu sauvegardé
- **Commandes rapides** — crée un événement Google, envoie un message LinkedIn, le tout sans quitter l'outil

### Hoarder

Hoarder est un outil de bookmarking auto-hébergeable qui va au-delà du simple signet :

- **Sauvegarde automatique** du contenu complet des pages
- **Recherche full-text** dans tout ce que tu as sauvegardé
- **Tags et collections** pour organiser par thème
- **API ouverte** pour intégrer dans ton workflow

---

## Enregistrement d'écran

### Screenpipe

Screenpipe enregistre en continu tout ce qui se passe sur ton écran et le rend recherchable. C'est une mémoire visuelle de ton travail.

- **Capture continue** — tout est enregistré en arrière-plan
- **OCR intégré** — le texte à l'écran est reconnu et indexé
- **Recherche temporelle** — retrouve ce que tu faisais à n'importe quel moment
- **Local uniquement** — tes données restent sur ta machine

---

## Compression et outils médias

Avant de stocker, compresse. Un fichier plus léger, c'est un disque qui respire.

| Outil | Type | Usage |
|-------|------|-------|
| **FFmpeg** | Vidéo/audio | Compression, conversion, extraction de pistes |
| **ImageMagick** | Images | Redimensionnement, conversion en lot |
| **7-Zip** | Archives | Compression maximale, format ouvert |

---

## Lecteurs de médias

### Thorium Reader

Thorium Reader est un lecteur d'ebooks open source qui supporte EPUB, PDF et audiobooks :

- **Interface épurée** pour une lecture sans distraction
- **Annotations et surlignage** exportables
- **Catalogue OPDS** pour accéder à des bibliothèques en ligne
- **Accessibilité** — synthèse vocale, personnalisation typographique

---

## Gestion de photos

### Tonfotos

Tonfotos organise ta photothèque avec reconnaissance faciale et géolocalisation, le tout en local :

- **Reconnaissance faciale** pour retrouver les photos d'une personne
- **Timeline** chronologique automatique
- **Pas de cloud** — tout reste sur ton disque
- **Détection de doublons** pour libérer de l'espace

---

## Organisation des fichiers numériques

### Principes de base

1. **Un dossier = un projet ou un domaine** — pas de dossier "Divers" fourre-tout
2. **Convention de nommage** : `AAAA-MM-JJ_description_v1.ext`
3. **Inbox unique** : un seul dossier de réception, vidé chaque semaine
4. **3 niveaux max** de profondeur dans l'arborescence
5. **Archive ≠ supprime** : déplace dans un dossier Archive plutôt que de supprimer

### Gestion des actifs numériques

Pour les créatifs et les collectionneurs d'information :

- **Sépare les sources des productions** — matière première vs contenu fini
- **Versionne tes fichiers importants** — `_v1`, `_v2` ou mieux, un dépôt Git
- **Tagge les métadonnées** quand c'est possible — ça facilite la recherche future
- **Sauvegarde 3-2-1** : 3 copies, 2 supports différents, 1 hors-site
