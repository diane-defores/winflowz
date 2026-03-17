---
title: "Flow Launcher"
description: "Guide complet de Flow Launcher : configuration, intégration Vivaldi, raccourcis et pourquoi ça change tout."
sidebar:
  label: "Flow Launcher"
  order: 6
---

Flow Launcher est le lanceur de productivité open source pour Windows qui remplace la recherche du menu Démarrer, le gestionnaire de fichiers et une dizaine de clics par jour.

> Une fois que tu as goûté à un lanceur clavier, revenir à la souris pour ouvrir une app te semblera aussi archaïque qu'un modem 56k.

## Qu'est-ce que Flow Launcher ?

Flow Launcher est un lanceur d'applications au clavier : tu appuies sur un raccourci, tu tapes quelques lettres, tu appuies sur Entrée. Terminé.

### Ce qu'il fait

| Fonction | Exemple |
|----------|---------|
| **Lancer une app** | Tape `fire` → ouvre Firefox |
| **Chercher un fichier** | Tape `> rapport Q1` → trouve le fichier |
| **Calculer** | Tape `15 * 1.2` → affiche le résultat |
| **Chercher sur le web** | Tape `g astro starlight` → recherche Google |
| **Ouvrir un signet** | Tape `b projet` → ouvre le signet Vivaldi |
| **Commandes système** | Tape `shutdown`, `restart`, `sleep` |

---

## Installation et configuration

### Installation

1. Télécharge depuis [flow-launcher.com](https://www.flow-launcher.com/)
2. Installe et lance — Flow Launcher démarre avec Windows
3. Le raccourci par défaut est `Alt + Espace`

### Configuration recommandée

- **Raccourci** : garde `Alt + Espace` (universel et ergonomique)
- **Thème** : choisis un thème sombre sobre — tu vas le voir 50 fois par jour
- **Nombre de résultats** : 5-6 maximum pour ne pas surcharger
- **Position** : centré en haut de l'écran (zone de regard naturelle)

---

## Intégration avec les signets Vivaldi

L'un des super-pouvoirs de Flow Launcher : accéder à tes signets Vivaldi directement depuis le lanceur.

### Configuration

1. Installe le plugin **Bookmarks** dans Flow Launcher (Settings → Plugin Store)
2. Pointe-le vers le fichier de signets Vivaldi :
   `%LOCALAPPDATA%\Vivaldi\User Data\Default\Bookmarks`
3. Définis un préfixe d'action : `b` (pour bookmarks)

### Utilisation

- `b projet` → affiche tous les signets contenant "projet"
- `b github winflowz` → ouvre directement le repo
- Plus besoin d'ouvrir le navigateur pour chercher un signet

---

## Raccourcis et plugins essentiels

### Plugins recommandés

| Plugin | Préfixe | Fonction |
|--------|---------|----------|
| **Everything** | aucun | Recherche de fichiers ultra-rapide |
| **Bookmarks** | `b` | Accès aux signets du navigateur |
| **Calculator** | aucun | Calculs directs dans la barre |
| **Shell** | `>` | Exécute des commandes terminal |
| **Clipboard History** | `cb` | Historique du presse-papier |
| **Colors** | `#` | Prévisualisation et conversion de couleurs |

### Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Alt + Espace` | Ouvrir/fermer Flow Launcher |
| `Tab` | Autocomplétion |
| `Entrée` | Ouvrir le premier résultat |
| `Ctrl + Entrée` | Ouvrir le dossier parent du fichier |
| `Shift + Entrée` | Exécuter en administrateur |

---

## Pourquoi un lanceur change tout

### Le calcul

- **50 actions/jour** où tu cherches une app, un fichier ou un signet
- **Sans lanceur** : 5-10 secondes par action (menu Démarrer, navigateur, explorateur)
- **Avec lanceur** : 1-2 secondes par action
- **Gain** : ~5-7 minutes par jour, ~25-35 minutes par semaine

Mais le vrai gain n'est pas le temps — c'est le **flow**. Tu ne quittes jamais ton clavier, tu ne perds jamais ta concentration pour chercher un outil. Ton intention se transforme directement en action.

### Avant / Après

| Avant | Après |
|-------|-------|
| Clic menu Démarrer → chercher → cliquer | `Alt+Espace` → 3 lettres → `Entrée` |
| Ouvrir le navigateur → signets → dossier → clic | `Alt+Espace` → `b mot-clé` → `Entrée` |
| Ouvrir l'explorateur → naviguer → chercher | `Alt+Espace` → `> nom-fichier` → `Entrée` |
| Ouvrir la calculatrice → taper → lire | `Alt+Espace` → `15*1.2` → lire le résultat |

---

## Astuces avancées

1. **Personnalise les mots-clés** — renomme tes apps fréquentes pour des alias courts
2. **Désactive les plugins inutiles** — moins de bruit dans les résultats
3. **Utilise les raccourcis web** — `yt [terme]` pour YouTube, `gh [repo]` pour GitHub
4. **Épingle les résultats fréquents** — ils apparaîtront en premier
5. **Combine avec Everything** — Flow Launcher + Everything = recherche instantanée totale
