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

### Storage is not just about free space

Managing storage is not only about "freeing up space." It is also about continuity of work, security, and your ability to recover quickly when something breaks.

A badly managed workstation on the storage side often leads to:
- unnecessary slowdowns
- missing or incomplete backups
- files scattered across too many places
- chaotic recovery after failure, theft, human error, or corruption

In other words: if you lose your data, you do not only lose files. You lose time, context, confidence, and sometimes weeks of work.

### Backup: the invisible discipline that saves real professionals

Backups are not just an "IT admin" topic. They are a very concrete productivity topic.

The minimum serious distinction is:
- **working storage**: what you use every day
- **backup**: a recoverable copy if the first device fails or if you make a mistake

A good basic approach is:
- keep important files in clear, deliberate locations
- avoid depending on a single drive or a single device
- maintain at least one local or external backup
- ideally combine local and remote backup depending on how sensitive your data is

The real reflex is not "I hope I do not lose anything." The real reflex is:
- if my PC dies today, how much work can I recover cleanly tomorrow?

If the answer is vague, the system is not secure yet.

## Optimize your DNS

When you type an address into your browser, your PC does not go straight to the site. It first queries a **DNS server** to translate the domain name into an IP address. In practice, DNS is a translator for the web.

The important point is that DNS is not neutral. A slow, badly configured, filtering, or unreliable DNS can create the feeling that:
- the web is slow
- some sites take too long to open
- a service is "broken" when the real issue is mostly name resolution

By default, your PC often uses your internet provider's DNS. That is not necessarily terrible, but it is not always the best option for speed, reliability, or privacy.

Changing DNS is free and takes two minutes.

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

The right way to think about it is not: "changing DNS will magically fix the internet."

The right way to think about it is:
- DNS can be a real small bottleneck
- it can also be an important control point
- and it is worth checking before blaming Windows, your browser, or a cloud application

If you just changed DNS and behavior still feels inconsistent, `ipconfig /flushdns` can also help clear the local cache.

### NextDNS: when you want control over filtering

If you want to go further than a simple public DNS, **NextDNS** is a very interesting option. It is a configurable DNS service that can block:
- trackers
- ads
- malicious domains
- specific sites or site categories based on your own rules

Its value is that it works more broadly than a single browser extension. You can clean part of your traffic at the system or network level with much finer control.

You just need to understand its role clearly:
- **Cloudflare** = speed
- **Quad9** = simple security
- **NextDNS** = control, filtering, customization

For an advanced user, NextDNS can become a strong base layer for reducing digital noise and certain distractions before they even reach the browser.

### Where to change DNS: PC or router?

You can change DNS at two levels:
- **on the PC**: useful for testing or personalizing one machine
- **on the router**: useful if you want the same logic applied across your whole network

The right choice depends on your goal:
- quick test or individual need: change DNS on the PC
- global consistency at home or at work: change it at the router level

## Package managers

Installing software by downloading it from websites is a thing of the past. Package managers automate installation, updates, and uninstallation.

On Windows, the modern reflex is to favor the command line. Installing tools through CLI gives you a setup that is more reproducible, faster to rebuild, and easier to document. Instead of clicking through ten different websites, you keep a clear list of what you install and can replay that logic on another machine.

### Winget first, winstall second

**winget** is Microsoft's official package manager. It should be your default.

Examples:

```powershell
# Search for a package
winget search powertoys

# Install a tool
winget install Microsoft.PowerToys

# Upgrade all supported packages
winget upgrade --all
```

**winstall** is useful as a visual layer on top of winget. You select applications in the browser, and it generates the corresponding `winget` command or a `.bat` / `.ps1` script. That makes it a good bridge between visual discovery and command-line execution.

The right way to think about winstall is not “replace the CLI.” It is:
- browse the `winget` catalog quickly
- prepare a clean selection
- then move back to a reproducible script or command workflow

In other words, **winstall helps you prepare**, but **winget remains the serious foundation** of the setup.

### When to use the Microsoft Store

The **Microsoft Store** is not the most powerful installation method, but it is still useful in some cases:
- for Microsoft apps or software deeply integrated into Windows
- for users who want a clean installation path without hunting installers across the web
- for apps whose updates are handled fairly transparently through the Store

Our preferred hierarchy is:
- **winget** if you want a clean, documented, replayable setup
- **Microsoft Store** if you want a simple official install path for a well-supported app
- manual download only when the first two options do not fit

In other words: the Store is not the enemy. It is just not the strongest lever if your goal is a truly reproducible setup.

## Desktop apps vs SaaS: understand what you control

Not all applications live in the same place, and that changes a lot about how you work.

Put simply:
- a **desktop app** runs mainly on your machine
- a **SaaS** runs mainly in the browser or on a remote provider's infrastructure

A desktop app often gives you:
- more local control
- better access to files, shortcuts, and hardware performance
- less dependence on an internet connection
- sometimes a stronger feeling of speed and robustness

A SaaS often gives you:
- access from any device
- easier synchronization
- more natural collaboration
- centralized deployment and updates

But the tradeoffs are not the same.

With a local application, it is often easier to keep control over:
- your files
- your update rhythm
- certain system-level integrations
- part of your privacy and your offline resilience

With a SaaS, you gain sharing convenience, but you also accept more dependence:
- on connectivity
- on the provider
- on its interface changes, pricing, or policies
- on the reality that "your tool lives on someone else's computer"

There is no single right answer. The right reflex is to ask:
- do I need collaboration, or mainly local control?
- do I need access everywhere, or a robust and mastered workstation?
- if the service fails or changes, what do I actually lose?

Taking back control of your work environment also means knowing why you choose a local app, a SaaS, or a mix of both.

### Productivity and digital sovereignty

This matters: productivity is not only about speed. It is also about working with tools you understand, can replace, and whose dependencies you accept consciously.

Dominant suites like Google Workspace or Microsoft 365 often win on:
- convenience
- collaboration
- integration
- habit

But they also ask you to accept tradeoffs:
- your data lives inside an ecosystem you do not really control
- the rules can change without you
- convenience can hide a strong dependency on a single provider

By contrast, more sovereign, more private, or more local tools sometimes give you:
- more control over your data
- a different legal framework
- better resilience if you do not want to become fully captive to one vendor

So the right question is not "Google is bad" or "everything must be self-hosted." The right question is:
- how much convenience am I buying with dependency?
- how much control do I want to preserve over my work environment?

A smaller alternative like [Internxt](https://internxt.com/) can be worth knowing in that context, not as a universal replacement for Google, but as an example of a cloud tool positioned around privacy, control, and a European base. The main lesson is not the brand. It is the reflex: do not confuse a convenient tool with an invisible dependency.

## Portable or installed: two software philosophies

Many Windows tools exist in two versions:
- **Installer**
- **Portable**

The difference is not cosmetic. It changes how the application lives on your system.

An **installed** version:
- integrates more deeply with Windows
- often creates shortcuts, file associations, and an uninstaller
- more readily stores settings in `AppData` or other system locations
- is usually more natural for a stable primary workstation

A **portable** version:
- can live in any folder or on a USB drive
- often keeps its configuration files next to the executable
- changes the system less
- makes testing, transport, and certain cleaner or more temporary uses easier

So the right question is not "which one is better?" but:
- do I want deep, comfortable integration?
- or do I want a tool that is more self-contained, movable, and easy to isolate?

In practice:
- **Installer** for tools you use every day on your main workstation
- **Portable** for testing, transport, reducing system footprint, or keeping tightly controlled tools inside a dedicated folder

Once again, the central topic is control. The more clearly you understand where your apps and their settings live, the more reproducible and manageable your workstation becomes.

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

## Evaluate whether your machine is actually sufficient

Many people judge a computer through badly interpreted numbers. They look only at GHz, or only at the processor name, and draw conclusions too quickly. In reality, the right question is not "is my machine powerful in theory?" but **is it sufficient for my real use?**

### The components that really change your experience

To be productive, you do not need a benchmark monster. You need a machine that is coherent, responsive, and adapted to your real work.

These are the components that truly matter and why.

#### Processor (CPU)

The processor is the execution brain of the machine. It handles a large part of general computation:
- heavy browsing
- office work
- development
- compression
- exports
- scripts
- multitasking

A better CPU helps most when:
- you keep many applications open at once
- you compile, render, export, or transform a lot of data
- your workflow needs quick responses under load

But avoid the raw-number trap: more GHz does not automatically mean a better machine. Architecture, core count, thermal behavior, and generation matter a lot.

#### Memory (RAM)

RAM is the immediate workspace of your system. The more apps, tabs, heavy files, and parallel contexts you keep open, the more it matters.

When you run out of RAM:
- the machine swaps to disk more often
- everything feels slower
- switching between apps becomes painful
- your workstation loses mental smoothness as much as technical smoothness

Simple reference points:
- **8 GB**: acceptable for light use, but quickly limiting
- **16 GB**: a comfortable baseline for most people
- **32 GB**: very useful for serious multitasking, creative work, development, or heavy tools

#### Storage: SSD first

Storage is not only where files live. It directly affects how fast the whole workstation feels.

An **SSD** changes a lot:
- faster boot
- smoother app launches
- faster search
- less general friction

By contrast, an old spinning hard drive can make an entire PC feel bad even when part of the problem is simply the storage medium.

The right reflex in 2026:
- SSD for the system
- enough free space so you do not work under constant pressure
- a clear backup logic instead of storing everything chaotically

#### Graphics card (GPU)

The GPU is not essential for everyone. For many office or admin workflows, it is not the main factor.

It becomes important if you do:
- 3D
- video editing
- rendering
- gaming
- local AI
- certain accelerated creative tasks

The classic mistake is spending heavily on a GPU that will barely matter in real use.

#### Heat, noise, and stability

A machine that looks "powerful" but is noisy, hot, or unstable can still be bad for productivity.

Why:
- noise is fatiguing
- heat reduces comfort
- throttling reduces real performance
- instability breaks trust and flow

So you should judge real usable power, not just the spec sheet.

#### Screen, keyboard, battery: the false secondaries

These are often treated as details even though they have a massive daily impact.

- a bad screen increases fatigue
- a mediocre keyboard adds friction to every line you type
- weak battery life or an intrusive charger reduces mobility

In other words, productivity does not depend only on "noble" components. It also depends on the concrete ergonomics of the machine.

To answer that seriously, look mainly at:
- **the processor**: architecture, core count, and real behavior under your workloads
- **RAM**: 16 GB is often a comfortable baseline; 32 GB becomes very useful if you keep many heavy tools open
- **storage**: an SSD changes the overall feel dramatically
- **the GPU**: mainly important for 3D, rendering, video, local AI, gaming, or certain creative tools
- **heat and noise**: a machine that looks strong on paper can become mediocre if it throttles quickly

The classic trap is comparing raw numbers without context. A 2.6 GHz CPU is not automatically better than a 1.6 GHz CPU. Architecture, cores, threads, thermal behavior, and workload type matter just as much, often more.

### Simple rule by profile

- **Office work / browsing / admin**: a recent machine with an SSD and 16 GB of RAM is often more than enough
- **Development / serious multitasking**: aim for a decent CPU, 16 to 32 GB of RAM, and comfortable SSD storage
- **Heavy creative work / 3D / video / local AI**: stronger CPU, more RAM, and often a dedicated GPU

### How to check without fooling yourself

The best test is still real usage:
- does your browser lag with many tabs and apps open?
- are exports, compiles, or renders acceptable?
- does the machine get hot enough to hurt comfort?
- are you really missing power, or mainly dealing with a badly organized system?

Benchmarks can help compare hardware, but they should stay secondary. They confirm an intuition; they should not replace real-world experience.

## Check Windows Update regularly

Maintaining a Windows workstation is not just about installing good tools. It is also about preventing the system from drifting too long without fixes. Many stability, compatibility, or security issues come from a machine that has simply been left without updates for too long.

The right reflex is simple:
- open **Settings > Windows Update**
- click **Check for updates**
- install important security fixes without waiting too long
- plan restarts instead of being interrupted by them

The goal is not to obsess over every minor update. The goal is to avoid two traps:
- a workstation that slowly accumulates technical debt and becomes more fragile
- a big wave of updates hitting at the worst possible moment

An up-to-date system does not make you productive by magic. What it does do is remove a lot of invisible friction:
- bugs that have already been fixed elsewhere
- driver or compatibility issues
- avoidable security holes
- strange behaviors you start normalizing even though they just come from a poorly maintained machine

As often, the right strategy is not perfection. It is regular maintenance.

### Go further

- [**IsMyTouchScreenOK**](https://www.softwareok.com/?seite=Microsoft/IsMyTouchScreenOK): a small utility that can be useful if you want to quickly test a touchscreen, check for dead touch points, or validate a device while it is still under warranty.
- [**KeepMouseSpeedOK**](https://www.softwareok.com/?seite=Microsoft/KeepMouseSpeedOK): useful if you want to keep a stable pointer speed and avoid certain changes in mouse feel caused by the system or specific contexts.
- [**AutoPowerOptionsOK**](https://www.softwareok.com/?seite=Microsoft/AutoPowerOptionsOK/Screenshot-0): a small tool worth knowing if you want finer control over certain power behaviors and want to avoid energy settings that feel too rigid for your workflow.
- [**GetPixelColor**](https://www.softwareok.com/?seite=Microsoft/GetPixelColor): handy if you sometimes need to quickly grab an exact on-screen color for design, UI work, or visual inspection.
- [**DontSleep**](https://www.softwareok.com/?seite=Microsoft/DontSleep): genuinely useful when you want to temporarily prevent sleep, hibernation, or auto shutdown during a download, export, render, or remote session.
- [**DirPrintOK**](https://www.softwareok.com/?seite=Freeware/DirPrintOK): can help when you need to quickly export or print a folder listing for inventory, archiving, or administrative sharing.

## Secure deletion: when deleting is not enough

Deleting a file and emptying the recycle bin does not always mean it is truly hard to recover. For everyday use, that is often acceptable. But if you handle sensitive documents, client exports, identity scans, financial files, or temporary archives containing private data, it is useful to distinguish between:
- **deleting to free space**
- **deleting to reduce recovery risk**

### [Blank And Secure](https://www.softwareok.com/?seite=Microsoft/BlankAndSecure)

Blank And Secure is a small portable utility built for that more cautious use case. Its role is not to replace File Explorer for everyday deletion, but to give you a more deliberate way to remove a file or batch of files when confidentiality matters more.

The right mental model is:
- it is not a general cleanup tool
- it is a **sensitive-file handling tool**
- it makes sense for targeted cases, not for your whole drive

Important nuance: on modern SSDs, secure deletion is more nuanced than it was on older spinning drives. So the premium reflex is not “overwrite everything forever.” The better reflex is:
- know which files deserve extra caution
- avoid leaving them around unnecessarily
- understand that security also depends on encryption, storage choices, and the general structure of your workstation

In other words, Blank And Secure can be useful, but it should remain a **targeted tool**, not a blind ritual.

## Assess the security of your workstation

Take five minutes to check these points:
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

## Official resources

- [SpaceSniffer](http://www.uderzo.it/main_products/space_sniffer/) - treemap-based disk analysis.
- [TreeSize Free](https://www.jam-software.com/treesize_free) - the clear tree view for large folders.
- [WizTree](https://www.diskanalyzer.com/) - ultra-fast NTFS volume analysis.
- [NextDNS](https://nextdns.io/) - the configurable filtering DNS.
- [Cloudflare DNS](https://developers.cloudflare.com/1.1.1.1/) - the fast, simple option.
- [Quad9](https://quad9.net/) - the security-focused option.
- [winstall](https://winstall.app/) - the visual layer for preparing `winget` commands or scripts.
- [Blank And Secure](https://www.softwareok.com/?seite=Microsoft/BlankAndSecure) - the cautious deletion tool for sensitive files.
