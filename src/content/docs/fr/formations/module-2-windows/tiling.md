---
title: "Gestion des Fenetres & Tiling"
description: "Organise tes fenetres efficacement avec le tiling et les outils de gestion de fenetres Windows"
sidebar:
  label: "Tiling"
  order: 7
---

> Un ecran bien organise, c'est un esprit bien organise. Le tiling transforme ton bureau en espace de travail structure.

## Pourquoi la gestion des fenetres compte

Combien de fois par jour fais-tu Alt+Tab pour retrouver une fenetre perdue ? Combien de fois redimensionnes-tu manuellement deux fenetres cote a cote ? Ces micro-interruptions cassent ta concentration.

Le **tiling** (disposition automatique des fenetres) resout ce probleme. Chaque fenetre a sa place, visible et accessible, sans chevauchement.

## FancyZones : la reference sur Windows

FancyZones fait partie de **Microsoft PowerToys**, un ensemble d'utilitaires gratuits de Microsoft. C'est de loin la meilleure solution de tiling sur Windows.

### Installation

```powershell
winget install Microsoft.PowerToys
```

### Creer tes zones

1. Ouvre les parametres PowerToys > FancyZones
2. Clique sur **Lancer l'editeur de disposition**
3. Choisis un modele ou cree une disposition personnalisee
4. Definis tes zones en les dessinant sur l'ecran

### Dispositions recommandees

**Pour un ecran large (ultrawide ou 27"+) :**
- 3 colonnes : principale au centre (50%), secondaires sur les cotes (25% chacune)

**Pour un ecran standard (24") :**
- 2 colonnes egales pour le travail cote a cote
- 1 grande + 2 empilees pour le focus avec references

**Pour du multi-ecran :**
- Ecran principal : 2-3 zones de travail
- Ecran secondaire : communication + monitoring

### Utilisation au quotidien

| Action | Comment |
|--------|---------|
| Placer dans une zone | Maintiens `Shift` en deplacant la fenetre |
| Changer de zone au clavier | `Win + Ctrl + Alt + Fleches` |
| Switcher de disposition | Configure un raccourci dans les parametres |

**Astuce** : cree plusieurs dispositions et bascule entre elles selon ton activite. Une disposition pour le code, une pour la redaction, une pour la communication.

## AquaSnap : ameliorer le snap natif

Si tu trouves FancyZones trop complexe, AquaSnap est une alternative plus simple qui ameliore le comportement de snap natif de Windows.

**Ce qu'il ajoute :**
- Snap sur les coins (quarts d'ecran)
- Fenetres aimantees qui se collent entre elles
- Redimensionnement simultane de fenetres adjacentes
- Fenetres toujours au premier plan (epingle)
- Transparence des fenetres inactives

## Autres outils

| Outil | Approche | Ideal pour |
|-------|---------|------------|
| **WindowGrid** | Grille overlay au clic droit | Placement precis sans configuration |
| **MaxTo** | Regions predefinies par ecran | Multi-ecran avance |
| **Divvy** | Grille de placement rapide | Simplicite, raccourci unique |
| **GlazeWM** | Vrai tiling manager automatique | Utilisateurs venant de Linux (i3/sway) |
| **Komorebi** | Tiling manager scriptable | Power users qui veulent un i3 sur Windows |

## Tiling automatique vs manuel

Sur Linux, les tiling window managers (i3, Sway, Hyper) gerent **automatiquement** la position de chaque fenetre. Tu ouvres une app, elle prend sa place. Tu en ouvres une deuxieme, l'espace se divise.

Sur Windows, ce niveau d'automatisation est plus difficile a atteindre. **GlazeWM** et **Komorebi** s'en approchent, mais ils demandent de la configuration et peuvent entrer en conflit avec certaines applications.

**Notre recommandation** : commence par FancyZones. C'est le meilleur equilibre entre puissance et stabilite. Si tu veux aller plus loin, teste GlazeWM.

## Workflow clavier complet

L'objectif ultime : ne jamais toucher la souris pour organiser tes fenetres. Voici un workflow type :

1. **Lancer une app** : `Alt + Espace` (via ton lanceur) > tape le nom > Entree
2. **Placer la fenetre** : `Win + Ctrl + Alt + Fleche` pour l'envoyer dans une zone
3. **Basculer entre fenetres** : `Alt + Tab` ou mieux, des raccourcis dedies par app
4. **Changer de bureau** : `Win + Ctrl + Gauche/Droite`
5. **Maximiser/restaurer** : `Win + Haut`

### Raccourcis natifs a connaitre

| Action | Raccourci |
|--------|-----------|
| Snap gauche / droite | `Win + Gauche/Droite` |
| Snap quart d'ecran | `Win + Gauche` puis `Win + Haut/Bas` |
| Maximiser | `Win + Haut` |
| Minimiser | `Win + Bas` |
| Minimiser tout | `Win + D` |
| Deplacer vers un autre ecran | `Win + Shift + Gauche/Droite` |

## Par ou commencer

1. Installe **PowerToys** et active FancyZones
2. Cree **2 dispositions** : une pour le focus, une pour le multitache
3. Force-toi a utiliser `Shift + drag` pendant une semaine
4. Ajoute progressivement les raccourcis clavier
5. Quand c'est devenu naturel, explore GlazeWM si tu veux aller plus loin
