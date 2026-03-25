---
title: "Automation"
description: "Automate repetitive Windows tasks with macros, scripts, and launchers."
sidebar:
  label: "Automation"
  order: 5
---

> If you do the same thing more than three times, it is time to automate it.

## Macro recorders

The idea is simple: record a sequence of actions (clicks, keystrokes), then replay it whenever you want. No coding required.

### Recommended tools

| Tool | Complexity | Strengths |
|------|------------|-----------|
| **TinyTask** | Very simple | Single file, no installation, ideal for quick macros |
| **Jitbit Macro Recorder** | Medium | Clear interface, can edit steps after recording |
| **Pulover's Macro Creator** | Advanced | Generates AutoHotkey code, bridge to advanced automation |

**Typical use cases**: filling out a recurring form, renaming files in bulk, sending a template message, running a testing routine.

### Macro recorder limitations

Recorded macros are fragile. If a window moves or a button shifts, the macro fails. For robust automation, you need scripting.

## AutoHotkey: automation without limits

AutoHotkey (AHK) is a scripting language built for Windows. It lets you create shortcuts, remap keys, automate tasks, and even build graphical interfaces.

### Concrete examples

**Remap a key:**
```txt
; Turn Caps Lock into Escape
CapsLock::Esc
```

**Create a text shortcut:**
```txt
; Typing "@@" inserts your email address
::@@::your.email@example.com
```

**Launch an app with a shortcut:**
```txt
; Win + N opens Notepad
#n::Run, notepad.exe
```

**Shortcut for multi-line text:**
```txt
; Ctrl + Shift + S inserts a signature
^+s::
SendInput, Best regards,{Enter}Your Name{Enter}Your Title
return
```

### How to get started with AHK

1. Install AutoHotkey v2 from the official website
2. Create a `.ahk` file with Notepad
3. Write your first script (start with a simple remap)
4. Double-click the file to run it
5. Put your essential scripts in the Startup folder so they launch automatically

## Browser automation

### Automa

Automa is a browser extension that lets you automate web workflows through a visual block-based interface. No code required.

**What you can do:**
- Fill out forms automatically
- Extract data from web pages (light scraping)
- Chain actions across multiple pages
- Schedule recurring runs

### Browser Automation Studio (BAS)

BAS is more powerful than Automa, but also more complex. It handles proxies, multiple profiles, and advanced scenarios. Use it when Automa is no longer enough.

## Application launchers

Opening an app through the Start menu is slow. A launcher lets you type a few letters and open anything instantly.

### Launcher comparison

| Launcher | Speed | Extra features | Open-source |
|----------|-------|----------------|-------------|
| **Flow Launcher** | Fast | Plugins, calculator, web search | Yes |
| **Listary** | Very fast | Explorer integration, file search | No (freemium) |
| **Wox** | Fast | Plugins, themes | Yes |
| **PowerToys Run** | Fast | Built into PowerToys, no separate install | Yes |

**Our recommendation**: Flow Launcher for its active community and plugin ecosystem, or PowerToys Run if you already use PowerToys.

### Universal shortcut

Set your launcher to `Alt + Space`. That is the de facto standard. Press it, type, validate - three gestures to open anything.

## Launch programs at startup

To launch a program or script automatically:

1. Press `Win + R`, type `shell:startup`, and confirm
2. Drop a **shortcut** (not the original file) for your program into that folder
3. That is it. At the next boot, it will launch automatically.

## Introduction to RPA

RPA (Robotic Process Automation) takes automation to the professional level. Instead of automating one task, you automate whole processes.

**OpenIAP** is an open-source RPA platform that lets you:
- Orchestrate workflows across multiple applications
- Manage task queues
- Connect software robots to APIs

It is an advanced topic, but if you work with repetitive processes at scale, it is worth a look.
