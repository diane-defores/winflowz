---
title: "Sante & Configuration Systeme"
description: "Diagnostique, nettoie et optimise ton systeme Windows avec les bons outils"
sidebar:
  label: "Sante systeme"
  order: 2
---

> Un systeme en bonne sante, c'est la fondation de tout le reste. Inutile d'installer des outils de productivite sur une machine qui rame.

## Diagnostiquer l'espace disque

Avant d'optimiser quoi que ce soit, tu dois savoir ou part ton espace. Deux outils se distinguent pour ca.

### Outils d'analyse disque

| Outil | Type | Points forts |
|-------|------|-------------|
| **SpaceSniffer** | Treemap visuel | Vue instantanee des gros fichiers, navigation par zoom |
| **TreeSize Free** | Arborescence | Tri par taille, export, integration menu contextuel |
| **WizTree** | Arborescence | Lecture MFT directe, ultra-rapide sur les disques NTFS |

**Conseil pratique** : lance SpaceSniffer sur ton disque C: en premier. Les blocs les plus gros sautent aux yeux immediatement. Tu vas probablement decouvrir des dossiers de cache ou des anciennes installations que tu avais oublies.

## Optimiser ton DNS

Par defaut, ton PC utilise le DNS de ton fournisseur d'acces. C'est souvent lent et parfois filtrant. Changer de DNS, c'est gratuit et ca prend deux minutes.

### Les meilleurs DNS publics

| Fournisseur | Adresse primaire | Adresse secondaire | Atout principal |
|-------------|-----------------|--------------------|-----------------|
| **Cloudflare** | 1.1.1.1 | 1.0.0.1 | Rapidite (le plus rapide au monde) |
| **Quad9** | 9.9.9.9 | 149.112.112.112 | Securite (bloque les domaines malveillants) |
| **Google** | 8.8.8.8 | 8.8.4.4 | Fiabilite et couverture mondiale |

### Comment changer ton DNS

1. Ouvre **Parametres > Reseau et Internet > Wi-Fi** (ou Ethernet)
2. Clique sur ton reseau, puis **Attribution du serveur DNS > Modifier**
3. Passe en **Manuel**, active **IPv4**
4. Entre les adresses du fournisseur choisi
5. Enregistre et teste avec un `nslookup google.com` dans le terminal

**Notre recommandation** : Cloudflare pour la vitesse brute, Quad9 si la securite est ta priorite.

## Gestionnaires de paquets

Installer des logiciels en telechargement depuis des sites web, c'est du siecle dernier. Les gestionnaires de paquets automatisent l'installation, la mise a jour et la desinstallation.

### Chocolatey vs Scoop

| Critere | Chocolatey | Scoop |
|---------|-----------|-------|
| **Installation** | Necessite admin | Fonctionne sans admin |
| **Catalogue** | ~10 000 paquets | ~5 000 paquets |
| **Philosophie** | Installe comme un .exe classique | Installe dans un dossier utilisateur |
| **Mises a jour** | `choco upgrade all` | `scoop update *` |
| **Ideal pour** | Logiciels desktop (Chrome, VS Code) | Outils CLI et dev |

**En pratique**, beaucoup de power users utilisent les deux : Chocolatey pour les gros logiciels, Scoop pour les outils en ligne de commande.

```powershell
# Installer Chocolatey (en admin)
Set-ExecutionPolicy Bypass -Scope Process -Force
irm https://community.chocolatey.org/install.ps1 | iex

# Installer Scoop (sans admin)
irm get.scoop.sh | iex
```

## Evaluer la securite de ton poste

Prends cinq minutes pour verifier ces points :

- **Windows Update** : tout est a jour ? Les mises a jour de securite sont non-negociables.
- **Antivirus** : Windows Defender suffit largement. Desinstalle les antivirus tiers qui ralentissent ta machine.
- **Pare-feu** : active et configure. Verifie dans Parametres > Confidentialite et securite.
- **Comptes** : desactive le compte admin par defaut, utilise un compte standard au quotidien.

## Puter : ton ordinateur dans le cloud

Puter est un concept interessant : un environnement de bureau complet accessible depuis un navigateur. C'est utile comme solution de secours si ta machine principale tombe en panne, ou pour acceder a un poste de travail depuis n'importe ou.

Ce n'est pas un remplacement de ton PC, mais un complement. Garde-le dans un coin de ta tete pour les situations d'urgence.

## Checklist sante systeme

- [ ] Analyser l'espace disque et supprimer les fichiers inutiles
- [ ] Configurer un DNS rapide et securise
- [ ] Installer un gestionnaire de paquets
- [ ] Verifier les mises a jour Windows
- [ ] Desinstaller les logiciels inutiles preinstalles (bloatware)
