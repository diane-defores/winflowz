---
title: "Ergonomie & Confort d'Utilisation"
description: "Rends ton poste Windows agreable et efficace avec les bons reglages et outils"
sidebar:
  label: "Ergonomie"
  order: 4
---

> L'ergonomie numerique, ce n'est pas du luxe. C'est ce qui fait la difference entre finir ta journee fatigue ou finir ta journee en forme.

## Explorateur de fichiers : au-dela de l'Explorateur Windows

L'Explorateur Windows fait le travail, mais il existe des alternatives bien plus puissantes.

| Outil | Points forts | Ideal pour |
|-------|-------------|------------|
| **Files** | Interface moderne, onglets, double panneau | Utilisateurs qui veulent du beau et du fonctionnel |
| **Directory Opus** | Scriptable, colonnes personnalisees, FTP integre | Power users (payant) |
| **One Commander** | Double panneau, themes, gratuit | Alternative solide a l'Explorateur |
| **Total Commander** | Classique, double panneau, plugins | Utilisateurs old-school |

## Gestionnaire de presse-papiers : CopyQ

Par defaut, `Ctrl + C` ecrase ce que tu avais copie avant. C'est absurde quand on y pense. Un gestionnaire de presse-papiers garde un historique de tout ce que tu copies.

**CopyQ** est open-source, gratuit et puissant :

- Historique illimite de tes copies (texte, images, fichiers)
- Recherche dans l'historique
- Onglets pour organiser tes clips par categorie
- Scripts et raccourcis personnalisables
- Synchronisation possible entre machines

**Raccourci a retenir** : `Ctrl + Shift + V` pour ouvrir l'historique et choisir quoi coller.

## Bureaux virtuels

Windows 10 et 11 proposent des bureaux virtuels, mais peu de gens les utilisent. C'est pourtant un outil de focus redoutable.

### Organisation recommandee

- **Bureau 1** : Communication (mail, messagerie, calendrier)
- **Bureau 2** : Travail principal (editeur, navigateur de recherche)
- **Bureau 3** : Outils secondaires (terminal, bases de donnees, fichiers)
- **Bureau 4** : Personnel (musique, reseaux sociaux)

### Raccourcis essentiels

| Action | Raccourci |
|--------|-----------|
| Vue des bureaux | `Win + Tab` |
| Creer un bureau | `Win + Ctrl + D` |
| Fermer le bureau actif | `Win + Ctrl + F4` |
| Bureau suivant / precedent | `Win + Ctrl + Droite/Gauche` |

**Astuce** : deplace une fenetre vers un autre bureau en faisant `Win + Tab`, puis glisse-la sur le bureau cible.

## Organisation des fenetres

Windows 11 a introduit les **Snap Layouts** (`Win + Z`), mais ca reste basique. Pour aller plus loin, regarde le chapitre dedie au tiling dans ce module.

En attendant, retiens ces raccourcis natifs :

| Action | Raccourci |
|--------|-----------|
| Snap a gauche / droite | `Win + Gauche/Droite` |
| Maximiser / restaurer | `Win + Haut/Bas` |
| Minimiser tout | `Win + D` |
| Secouer pour minimiser les autres | Attrape la barre de titre et secoue |

## Barre des taches et menu Demarrer

- **Desencombre ta barre des taches** : ne garde que les 5-7 apps que tu utilises quotidiennement
- **Desactive les widgets** (Windows 11) : clic droit sur la barre > Parametres de la barre des taches
- **Desactive la recherche Bing** dans le menu Demarrer : c'est possible via le Registre ou des outils comme ExplorerPatcher

## Gerer les applications au demarrage

Chaque application qui se lance au demarrage rallonge ton temps de boot et consomme des ressources en arriere-plan.

1. Ouvre le **Gestionnaire des taches** (`Ctrl + Shift + Echap`)
2. Va dans l'onglet **Demarrage**
3. Desactive tout ce qui n'est pas essentiel

**Regle** : si tu n'utilises pas une app tous les jours, elle n'a rien a faire dans le demarrage.

## Confort visuel

### AutoDarkMode

Bascule automatiquement entre le theme clair le jour et le theme sombre la nuit. Tu configures les horaires une fois et tu n'y penses plus.

### f.lux

Reduit la lumiere bleue de ton ecran le soir. Tes yeux te remercieront. Windows a une fonction "Eclairage nocturne" integree, mais f.lux offre un controle plus fin.

### Jiffy Reader

Une extension navigateur qui applique le principe de la **lecture bionique** : les premieres lettres de chaque mot sont mises en gras, ce qui accelere la lecture en guidant ton regard. Essaie-le pendant une semaine — beaucoup de gens ne reviennent pas en arriere.

### Luciole

**Luciole** est une police open source concue specialement pour les personnes malvoyantes. Ses formes de caracteres maximisent la lisibilite et reduisent la fatigue visuelle — meme si tu as une vue normale. Ideale pour de longues sessions de lecture a l'ecran, que ce soit dans ton editeur de code, ton navigateur ou tes documents.

## Hot Corners avec WinXCorners

Sur macOS, les coins actifs declenchent des actions quand tu pousses la souris dans un coin de l'ecran. WinXCorners apporte cette fonctionnalite a Windows.

**Exemples de configuration :**

- **Coin superieur gauche** : Vue des taches (`Win + Tab`)
- **Coin superieur droit** : Bureau (`Win + D`)
- **Coin inferieur gauche** : Recherche
- **Coin inferieur droit** : Verrouillage (`Win + L`)

C'est subtil, mais une fois que tu t'y habitues, c'est un gain de temps constant.
