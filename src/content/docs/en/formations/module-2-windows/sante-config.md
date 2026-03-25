---
title: "System Health & Configuration"
description: "Diagnose, clean up, and optimize your Windows system with the right tools."
sidebar:
  label: "System Health"
  order: 2
---

> A healthy system is the foundation of everything else. There is no point installing productivity tools on a machine that is already lagging.

## Diagnose disk space

Before you optimize anything, you need to know where your storage is going. Two tools stand out for this.

### Disk analysis tools

| Tool | Type | Strengths |
|------|------|-----------|
| **SpaceSniffer** | Visual treemap | Instant view of large files, zoom-based navigation |
| **TreeSize Free** | Tree view | Size sorting, export, context menu integration |
| **WizTree** | Tree view | Direct MFT reading, extremely fast on NTFS drives |

**Practical tip**: run SpaceSniffer on your C: drive first. The biggest blocks jump out immediately. You will probably discover cache folders or old installs you had forgotten about.

## Optimize your DNS

By default, your PC uses your internet provider's DNS. That is often slow and sometimes filtered. Changing DNS is free and takes two minutes.

### The best public DNS providers

| Provider | Primary address | Secondary address | Main advantage |
|----------|-----------------|------------------|----------------|
| **Cloudflare** | 1.1.1.1 | 1.0.0.1 | Speed |
| **Quad9** | 9.9.9.9 | 149.112.112.112 | Security (blocks malicious domains) |
| **Google** | 8.8.8.8 | 8.8.4.4 | Reliability and global coverage |

### How to change your DNS

1. Open **Settings > Network and Internet > Wi-Fi** (or Ethernet)
2. Click your network, then **DNS server assignment > Edit**
3. Switch to **Manual**, enable **IPv4**
4. Enter the addresses for the provider you chose
5. Save and test with `nslookup google.com` in the terminal

**Our recommendation**: Cloudflare for raw speed, Quad9 if security is your priority.

## Package managers

Installing software by downloading it from websites is a thing of the past. Package managers automate installation, updates, and uninstallation.

### Chocolatey vs Scoop

| Criterion | Chocolatey | Scoop |
|----------|------------|-------|
| **Installation** | Requires admin | Works without admin |
| **Catalog** | ~10,000 packages | ~5,000 packages |
| **Philosophy** | Installs like a classic .exe | Installs into a user folder |
| **Updates** | `choco upgrade all` | `scoop update *` |
| **Best for** | Desktop software (Chrome, VS Code) | CLI and dev tools |

**In practice**, many power users use both: Chocolatey for big desktop apps, Scoop for command-line tools.

```powershell
# Install Chocolatey (as admin)
Set-ExecutionPolicy Bypass -Scope Process -Force
irm https://community.chocolatey.org/install.ps1 | iex

# Install Scoop (no admin)
irm get.scoop.sh | iex
```

## Assess the security of your workstation

Take five minutes to check these points:

- **Windows Update**: is everything up to date? Security updates are non-negotiable.
- **Antivirus**: Windows Defender is more than enough. Uninstall third-party antivirus tools that slow your machine down.
- **Firewall**: turn it on and configure it. Check under Settings > Privacy and Security.
- **Accounts**: disable the default admin account, use a standard account for day-to-day work.

## Puter: your computer in the cloud

Puter is an interesting concept: a full desktop environment accessible from a browser. It is useful as a backup if your main machine breaks, or if you need to access a workstation from anywhere.

It is not a replacement for your PC, but a complement. Keep it in mind for emergency situations.

## System health checklist

- [ ] Analyze disk space and remove unnecessary files
- [ ] Configure a fast and secure DNS
- [ ] Install a package manager
- [ ] Check Windows updates
- [ ] Uninstall unnecessary preinstalled software (bloatware)
