---
title: "Terminal & Ligne de Commande"
description: "Decouvre le terminal Windows et les outils CLI modernes pour gagner en efficacite"
sidebar:
  label: "Terminal"
  order: 6
---

> Le terminal, c'est l'outil que tout le monde ignore jusqu'au jour ou il decouvre a quel point c'est puissant.

## Pourquoi le terminal ?

L'interface graphique est intuitive, mais elle a un plafond. Certaines operations prennent 30 secondes en ligne de commande et 5 minutes a la souris : renommer 200 fichiers, chercher un texte dans un projet, installer 10 logiciels d'un coup.

Le terminal n'est pas reserve aux developpeurs. C'est un outil de productivite pour quiconque veut aller plus vite.

## Windows Terminal : le hub central

Windows Terminal est l'application officielle de Microsoft qui regroupe tous tes shells dans une seule fenetre avec des onglets.

**Pourquoi l'utiliser :**
- Onglets et panneaux divises
- Profils personnalisables par shell
- Themes et polices configurables
- Raccourcis clavier complets
- Support GPU pour le rendu du texte

**Installation** : disponible dans le Microsoft Store ou via `winget install Microsoft.WindowsTerminal`.

### Raccourcis essentiels

| Action | Raccourci |
|--------|-----------|
| Nouvel onglet | `Ctrl + Shift + T` |
| Fermer l'onglet | `Ctrl + Shift + W` |
| Diviser horizontalement | `Alt + Shift + -` |
| Diviser verticalement | `Alt + Shift + =` |
| Naviguer entre les panneaux | `Alt + Fleches` |
| Palette de commandes | `Ctrl + Shift + P` |

## PowerShell 7 vs CMD

CMD est un vestige des annees 80. PowerShell 7 est un shell moderne, cross-platform et oriente objet.

| Critere | CMD | PowerShell 7 |
|---------|-----|-------------|
| **Age** | 1987 | 2020+ |
| **Sorties** | Texte brut | Objets .NET |
| **Scripts** | .bat | .ps1 |
| **Cross-platform** | Non | Oui (Windows, macOS, Linux) |
| **Autocompletion** | Basique | Intelligente (PSReadLine) |
| **Pipeline** | Texte | Objets structures |

**Installe PowerShell 7** : `winget install Microsoft.PowerShell`. C'est different du PowerShell 5.1 preinstalle avec Windows.

### Naviguer dans les dossiers

```powershell
# Se deplacer
cd C:\Users\TonNom\Documents
cd ..          # Remonter d'un niveau
cd ~           # Aller au dossier utilisateur

# Lister le contenu
ls             # Liste simple
ls -la         # Liste detaillee (alias de Get-ChildItem)

# Creer et supprimer
mkdir MonDossier
Remove-Item MonDossier -Recurse
```

## WSL : Linux dans Windows

WSL (Windows Subsystem for Linux) te donne un vrai environnement Linux sans machine virtuelle. C'est indispensable si tu travailles avec des outils Linux ou du developpement web.

```powershell
# Installer WSL avec Ubuntu
wsl --install

# Lancer Linux
wsl
```

Une fois dans WSL, tu as acces a tout l'ecosysteme Linux : apt, bash, ssh, git, node, python — tout fonctionne nativement.

## Outils CLI modernes

Les outils classiques ont des alternatives modernes, plus rapides et plus lisibles.

| Outil classique | Alternative moderne | Avantage |
|----------------|-------------------|----------|
| `find` | **fd** | Syntaxe intuitive, rapide, ignore .gitignore |
| `grep` | **ripgrep (rg)** | 10x plus rapide, respect du .gitignore |
| `cat` | **bat** | Coloration syntaxique, numeros de ligne |
| `ls` | **eza** (ex-exa) | Icones, couleurs, vue arborescente |
| `cd` | **zoxide** | Apprend tes dossiers frequents, `z proj` au lieu de `cd C:\long\chemin\projet` |
| Recherche floue | **fzf** | Filtre interactif pour fichiers, historique, tout |

### Installer ces outils

```powershell
# Avec Scoop (recommande pour les outils CLI)
scoop install ripgrep fd bat eza fzf zoxide
```

## Emulateurs de terminal alternatifs

Si Windows Terminal ne te convient pas :

| Emulateur | Points forts |
|-----------|-------------|
| **WezTerm** | Configure en Lua, GPU-accelere, multiplexeur integre |
| **Alacritty** | Ultra-rapide, minimaliste, GPU-accelere |
| **Tabby** | Interface moderne, SSH integre, plugins |
| **Hyper** | Base sur Electron, themes web, extensible |

**Notre recommandation** : reste sur Windows Terminal sauf si tu as un besoin specifique. C'est solide, bien integre et activement maintenu par Microsoft.

## Premier reflexe terminal

La prochaine fois que tu dois faire une operation sur plusieurs fichiers, resiste a l'envie d'utiliser la souris. Cherche la commande equivalent. En une semaine de pratique, tu ne reviendras plus en arriere pour ces taches-la.
