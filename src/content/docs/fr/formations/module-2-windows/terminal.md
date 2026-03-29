---
title: "Terminal & Ligne de Commande"
description: "Découvre le terminal Windows et les outils CLI modernes pour gagner en efficacité"
sidebar:
  label: "Terminal"
  order: 6
---

> Le terminal, c'est l'outil que tout le monde ignore jusqu'au jour où il découvre à quel point c'est puissant.

## Pourquoi le terminal ?

L'interface graphique est intuitive, mais elle a un plafond. Certaines opérations prennent 30 secondes en ligne de commande et 5 minutes à la souris : renommer 200 fichiers, chercher un texte dans un projet, installer 10 logiciels d'un coup.

Le terminal n'est pas réservé aux développeurs. C'est un outil de productivité pour quiconque veut aller plus vite.

## Windows Terminal : le hub central

Windows Terminal est l'application officielle de Microsoft qui regroupe tous tes shells dans une seule fenêtre avec des onglets.

**Pourquoi l'utiliser :**
- Onglets et panneaux divisés
- Profils personnalisables par shell
- Thèmes et polices configurables
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
| Naviguer entre les panneaux | `Alt + Flèches` |
| Palette de commandes | `Ctrl + Shift + P` |

## PowerShell 7 vs CMD

CMD est un vestige des années 80. PowerShell 7 est un shell moderne, cross-platform et orienté objet.

| Critère | CMD | PowerShell 7 |
|---------|-----|-------------|
| **Âge** | 1987 | 2020+ |
| **Sorties** | Texte brut | Objets .NET |
| **Scripts** | .bat | .ps1 |
| **Cross-platform** | Non | Oui (Windows, macOS, Linux) |
| **Autocomplétion** | Basique | Intelligente (PSReadLine) |
| **Pipeline** | Texte | Objets structurés |

**Installe PowerShell 7** : `winget install Microsoft.PowerShell`. C'est différent du PowerShell 5.1 préinstallé avec Windows.

### Naviguer dans les dossiers

```powershell
# Se déplacer
cd C:\Users\TonNom\Documents
cd ..          # Remonter d'un niveau
cd ~           # Aller au dossier utilisateur

# Lister le contenu
ls             # Liste simple
ls -la         # Liste détaillée (alias de Get-ChildItem)

# Créer et supprimer
mkdir MonDossier
Remove-Item MonDossier -Recurse
```

## WSL : Linux dans Windows

WSL (Windows Subsystem for Linux) te donne un vrai environnement Linux sans machine virtuelle. C'est indispensable si tu travailles avec des outils Linux ou du développement web.

```powershell
# Installer WSL avec Ubuntu
wsl --install

# Lancer Linux
wsl
```

Une fois dans WSL, tu as accès à tout l'écosystème Linux : apt, bash, ssh, git, node, python — tout fonctionne nativement.

## Outils CLI modernes

Les outils classiques ont des alternatives modernes, plus rapides et plus lisibles.

| Outil classique | Alternative moderne | Avantage |
|----------------|-------------------|----------|
| `find` | **fd** | Syntaxe intuitive, rapide, ignore .gitignore |
| `grep` | **ripgrep (rg)** | 10x plus rapide, respect du .gitignore |
| `cat` | **bat** | Coloration syntaxique, numéros de ligne |
| `ls` | **eza** (ex-exa) | Icônes, couleurs, vue arborescente |
| `cd` | **zoxide** | Apprend tes dossiers fréquents, `z proj` au lieu de `cd C:\long\chemin\projet` |
| Recherche floue | **fzf** | Filtre interactif pour fichiers, historique, tout |

### Installer ces outils

```powershell
# Avec Scoop (recommandé pour les outils CLI)
scoop install ripgrep fd bat eza fzf zoxide
```

## Émulateurs de terminal alternatifs

Si Windows Terminal ne te convient pas :

| Émulateur | Points forts |
|-----------|-------------|
| **WezTerm** | Configuré en Lua, GPU-accéléré, multiplexeur intégré |
| **Alacritty** | Ultra-rapide, minimaliste, GPU-accéléré |
| **Tabby** | Interface moderne, SSH intégré, plugins |
| **Hyper** | Basé sur Electron, thèmes web, extensible |

**Notre recommandation** : reste sur Windows Terminal sauf si tu as un besoin spécifique. C'est solide, bien intégré et activement maintenu par Microsoft.

## Premier réflexe terminal

La prochaine fois que tu dois faire une opération sur plusieurs fichiers, résiste à l'envie d'utiliser la souris. Cherche la commande équivalente. En une semaine de pratique, tu ne reviendras plus en arrière pour ces tâches-là.

## Ressources officielles

- [Windows Terminal](https://github.com/microsoft/terminal) - le hub central si tu restes sur l'app de Microsoft.
- [PowerShell 7](https://github.com/PowerShell/PowerShell) - le shell moderne à privilégier.
- [WSL](https://learn.microsoft.com/windows/wsl/) - Linux dans Windows.
- [ripgrep](https://github.com/BurntSushi/ripgrep) - la recherche texte ultra-rapide.
- [fd](https://github.com/sharkdp/fd) - la recherche de fichiers simple et rapide.
- [bat](https://github.com/sharkdp/bat) - le `cat` lisible.
- [eza](https://github.com/eza-community/eza) - le `ls` moderne.
- [zoxide](https://github.com/ajeetdsouza/zoxide) - la navigation intelligente entre dossiers.
- [fzf](https://github.com/junegunn/fzf) - la recherche floue interactive.
- [WezTerm](https://wezterm.org/) - le terminal puissant et scriptable.
- [Alacritty](https://alacritty.org/) - le terminal minimaliste et rapide.
- [Tabby](https://github.com/Eugeny/tabby) - le terminal complet avec SSH et clients série.
- [Hyper](https://hyper.is/) - le terminal basé sur Electron et personnalisable.
