---
title: "Terminal & Command Line"
description: "Discover the Windows terminal and modern CLI tools to work more efficiently."
sidebar:
  label: "Terminal"
  order: 6
---

> The terminal is the tool everyone ignores until the day they realize how powerful it is.

## Why use the terminal?

The graphical interface is intuitive, but it has limits. Some operations take 30 seconds in the command line and 5 minutes with the mouse: renaming 200 files, searching text in a project, installing 10 programs at once.

The terminal is not just for developers. It is a productivity tool for anyone who wants to move faster.

## Windows Terminal: the central hub

Windows Terminal is Microsoft's official app that brings all your shells together in a single window with tabs.

**Why use it:**
- Tabs and split panes
- Customizable profiles per shell
- Configurable themes and fonts
- Full keyboard shortcut support
- GPU text rendering support

**Installation**: available in the Microsoft Store or via `winget install Microsoft.WindowsTerminal`.

### Essential shortcuts

| Action | Shortcut |
|--------|----------|
| New tab | `Ctrl + Shift + T` |
| Close tab | `Ctrl + Shift + W` |
| Split horizontally | `Alt + Shift + -` |
| Split vertically | `Alt + Shift + =` |
| Move between panes | `Alt + Arrow keys` |
| Command palette | `Ctrl + Shift + P` |

## PowerShell 7 vs CMD

CMD is a relic from the 1980s. PowerShell 7 is a modern, cross-platform, object-oriented shell.

| Criterion | CMD | PowerShell 7 |
|----------|-----|--------------|
| **Age** | 1987 | 2020+ |
| **Output** | Raw text | .NET objects |
| **Scripts** | .bat | .ps1 |
| **Cross-platform** | No | Yes (Windows, macOS, Linux) |
| **Autocomplete** | Basic | Smart (PSReadLine) |
| **Pipeline** | Text | Structured objects |

**Install PowerShell 7**: `winget install Microsoft.PowerShell`. It is different from the preinstalled PowerShell 5.1 that ships with Windows.

### Navigating folders

```powershell
# Move around
cd C:\Users\YourName\Documents
cd ..          # Go up one level
cd ~           # Go to your user folder

# List contents
ls             # Simple list
ls -la         # Detailed list (alias for Get-ChildItem)

# Create and delete
mkdir MyFolder
Remove-Item MyFolder -Recurse
```

## WSL: Linux inside Windows

WSL (Windows Subsystem for Linux) gives you a real Linux environment without a virtual machine. It is essential if you work with Linux tools or web development.

```powershell
# Install WSL with Ubuntu
wsl --install

# Launch Linux
wsl
```

Once inside WSL, you have access to the full Linux ecosystem: apt, bash, ssh, git, node, python - everything works natively.

## Modern CLI tools

Classic tools have modern alternatives that are faster and easier to read.

| Classic tool | Modern alternative | Advantage |
|--------------|-------------------|-----------|
| `find` | **fd** | Intuitive syntax, fast, respects .gitignore |
| `grep` | **ripgrep (rg)** | 10x faster, respects .gitignore |
| `cat` | **bat** | Syntax highlighting, line numbers |
| `ls` | **eza** (formerly exa) | Icons, colors, tree view |
| `cd` | **zoxide** | Learns your frequent folders, `z proj` instead of `cd C:\long\path\to\project` |
| Fuzzy search | **fzf** | Interactive filter for files, history, everything |

### Install these tools

```powershell
# With Scoop (recommended for CLI tools)
scoop install ripgrep fd bat eza fzf zoxide
```

## Alternative terminal emulators

If Windows Terminal is not for you:

| Emulator | Strengths |
|----------|-----------|
| **WezTerm** | Lua-configurable, GPU-accelerated, built-in multiplexer |
| **Alacritty** | Ultra-fast, minimal, GPU-accelerated |
| **Tabby** | Modern interface, built-in SSH, plugins |
| **Hyper** | Electron-based, web themes, extensible |

**Our recommendation**: stick with Windows Terminal unless you have a specific need. It is solid, well integrated, and actively maintained by Microsoft.

## Your first terminal reflex

The next time you need to perform an operation on multiple files, resist the urge to reach for the mouse. Look for the command-line equivalent. After a week of practice, you will never go back for those tasks.

## Official resources

- [Windows Terminal](https://github.com/microsoft/terminal) - the central hub if you stay with Microsoft's app.
- [PowerShell 7](https://github.com/PowerShell/PowerShell) - the modern shell to prioritize.
- [WSL](https://learn.microsoft.com/windows/wsl/) - Linux inside Windows.
- [ripgrep](https://github.com/BurntSushi/ripgrep) - ultra-fast text search.
- [fd](https://github.com/sharkdp/fd) - simple and fast file search.
- [bat](https://github.com/sharkdp/bat) - a readable `cat`.
- [eza](https://github.com/eza-community/eza) - the modern `ls`.
- [zoxide](https://github.com/ajeetdsouza/zoxide) - smart folder navigation.
- [fzf](https://github.com/junegunn/fzf) - interactive fuzzy search.
- [WezTerm](https://wezterm.org/) - the powerful, scriptable terminal.
- [Alacritty](https://alacritty.org/) - the minimalist fast terminal.
- [Tabby](https://github.com/Eugeny/tabby) - the full terminal with SSH and serial clients.
- [Hyper](https://hyper.is/) - the Electron-based, customizable terminal.
