---
title: "Capture & Collect"
description: "Tools and methods for archiving the web, recording your screen, managing media, and never losing anything."
sidebar:
  label: "Capture"
  order: 2
---

Capture is the first step in PKM. If you do not capture it, you will forget it. And what you forget cannot inspire you or serve you later.

> Capture first, organize later. The worst enemy of capture is organizational perfectionism.

## Web archiving

### [Monolith](https://github.com/Y2Z/monolith)

Monolith saves a complete web page as a single HTML file - images, CSS, and scripts included. No external dependencies, no broken links.

| Advantage | Detail |
|----------|--------|
| **Single file** | Everything is embedded in one .html file |
| **Offline** | Works without an internet connection after saving |
| **Command line** | Easy to automate in scripts |
| **Fidelity** | Rendering is almost identical to the original page |

### [Webscape](https://webscape.co.za/)

Webscape is a central hub for organizing everything you capture:

- **Collections** to categorize information by topic or project
- **Workspaces** to separate your different work contexts
- **Full-text search** across all your saved content
- **Quick actions** - create a Google Calendar event, send a LinkedIn message, all without leaving the app

### [Hoarder](https://karakeep.app/)

Hoarder is a self-hostable bookmarking tool that goes beyond simple bookmarks:

- **Automatic saving** of the full page content
- **Full-text search** across everything you have saved
- **Tags and collections** for topic-based organization
- **Open API** for integrating it into your workflow

---

## Screen recording

### [Screenpipe](https://screenpi.pe/)

Screenpipe continuously records everything happening on your screen and makes it searchable. It is a visual memory of your work.

- **Continuous capture** - everything is recorded in the background
- **Built-in OCR** - on-screen text is recognized and indexed
- **Time-based search** - find what you were doing at any moment
- **Local only** - your data stays on your machine

---

## Compression and media tools

Before you store anything, compress it. A lighter file is a healthier disk.

| Tool | Type | Use |
|-------|------|-----|
| [FFmpeg](https://www.ffmpeg.org/) | Video/audio | Compression, conversion, track extraction |
| [ImageMagick](https://imagemagick.org/) | Images | Resizing, batch conversion |
| [7-Zip](https://www.7-zip.org/) | Archives | Maximum compression, open format |

---

## Media readers

### [Thorium Reader](https://thorium.edrlab.org/en/)

Thorium Reader is an open-source ebook reader that supports EPUB, PDF, and audiobooks:

- **Clean interface** for distraction-free reading
- **Annotations and highlights** you can export
- **OPDS catalog support** for accessing online libraries
- **Accessibility** - text-to-speech, typography customization

---

## Photo management

### [Tonfotos](https://tonfotos.com/)

Tonfotos organizes your photo library with face recognition and geolocation, all locally:

- **Face recognition** to find photos of a person
- **Automatic timeline** view
- **No cloud** - everything stays on your drive
- **Duplicate detection** to free up space

---

## Digital file organization

### Core principles

1. **One folder = one project or one area** - no giant "Misc" folder
2. **Naming convention**: `YYYY-MM-DD_description_v1.ext`
3. **Single inbox**: one intake folder, emptied every week
4. **Max 3 levels** of depth in the folder tree
5. **Archive does not mean delete**: move to an Archive folder instead of deleting

### Digital asset management

For creatives and information collectors:

- **Separate sources from outputs** - raw material vs finished content
- **Version important files** - `_v1`, `_v2`, or better yet, a Git repository
- **Tag metadata** whenever possible - it makes future retrieval easier
- **Use 3-2-1 backups**: 3 copies, 2 different media, 1 off-site
