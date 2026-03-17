---
title: "Opérations sur Médias & Fichiers"
description: "Outils pour manipuler archives cloud, images, CSV et fichiers en lot — gagne du temps sur les tâches répétitives."
sidebar:
  label: "Médias & Fichiers"
  order: 7
---

Les opérations sur fichiers et médias sont les tâches ingrates que tout le monde fait manuellement. Avec les bons outils, ce qui prenait 30 minutes se fait en 30 secondes.

> Automatise les tâches répétitives ou elles te voleront tes journées, une par une.

## Archives cloud

### Cloudzip

Cloudzip te permet de manipuler des archives (ZIP, RAR, 7z) directement dans le cloud sans les télécharger entièrement :

| Fonction | Avantage |
|----------|----------|
| **Exploration en ligne** | Parcours le contenu sans télécharger |
| **Extraction sélective** | Télécharge uniquement les fichiers dont tu as besoin |
| **Prévisualisation** | Visualise images et documents avant extraction |
| **Gain de bande passante** | Pas besoin de télécharger une archive de 2 Go pour un fichier de 5 Mo |

---

## Manipulation d'images

### Magic Copy

Magic Copy utilise l'IA pour extraire des éléments d'une image en un clic :

- **Détourage intelligent** — sélectionne un objet et extrais-le du fond
- **Copier-coller** entre images sans Photoshop
- **Extension navigateur** — fonctionne directement sur les images du web
- **Aucune compétence graphique requise**

### Autres outils image utiles

| Outil | Fonction |
|-------|----------|
| **ShareX** | Capture d'écran avancée + annotation + upload automatique |
| **GIMP** | Édition d'images complète, open source |
| **Squoosh** | Compression d'images web (Google, en ligne) |
| **XnConvert** | Conversion et traitement d'images en lot |

---

## Outils CSV et données tabulaires

### Qsv

Qsv est un outil en ligne de commande ultra-rapide pour manipuler des fichiers CSV :

- **Filtrage** par colonnes, valeurs ou expressions régulières
- **Tri** sur n'importe quelle colonne, même sur des fichiers de plusieurs Go
- **Statistiques** : moyenne, médiane, min, max en une commande
- **Jointure** entre fichiers CSV comme une base de données
- **Dédoublonnage** automatique

### Cas d'usage concrets

```
# Afficher les 10 premières lignes
qsv slice -l 10 data.csv

# Filtrer les lignes où la colonne "status" vaut "active"
qsv search -s status "active" data.csv

# Statistiques sur toutes les colonnes numériques
qsv stats data.csv
```

---

## Opérations de fichiers en lot

### Renommage en masse

| Outil | Type | Avantage |
|-------|------|----------|
| **PowerRename** (PowerToys) | GUI | Intégré à l'explorateur Windows, regex supporté |
| **Bulk Rename Utility** | GUI | Le plus complet, des dizaines d'options |
| **rename** (CLI) | Terminal | Script Perl ultra-flexible |

### Conversion en lot

- **FFmpeg** pour la vidéo et l'audio (tout format vers tout format)
- **ImageMagick** pour les images (`mogrify -format webp *.png`)
- **Pandoc** pour les documents (markdown → PDF, DOCX → HTML, etc.)
- **LibreOffice CLI** pour les fichiers Office en lot

---

## Traitement en lot : la méthode

### 1. Identifie le pattern

Avant d'automatiser, repère la tâche répétitive :
- "Je convertis 20 images en WebP chaque semaine"
- "Je renomme mes captures d'écran avec la date"
- "J'extrais les mêmes colonnes d'un CSV chaque mois"

### 2. Choisis le bon outil

- **Tâche simple et ponctuelle** → outil GUI (PowerRename, XnConvert)
- **Tâche récurrente** → script CLI (FFmpeg, ImageMagick, qsv)
- **Tâche complexe multi-étapes** → script PowerShell ou Python

### 3. Sauvegarde le script

Crée un dossier `~/scripts/` et stocke tes commandes récurrentes. Un script de 3 lignes qui t'économise 10 minutes par semaine vaut de l'or.

---

## Bonnes pratiques

1. **Teste toujours sur une copie** avant de lancer un traitement en lot sur tes originaux
2. **Nomme tes scripts clairement** : `convert-png-to-webp.sh`, pas `script3.sh`
3. **Documente tes commandes** avec un commentaire en première ligne
4. **Automatise les tâches que tu fais plus de 3 fois** — la 4ème fois devrait être la dernière fois manuelle
5. **Vérifie les résultats** après chaque batch — un mauvais regex peut renommer 500 fichiers n'importe comment
