---
title: "Media & File Operations"
description: "Tools for handling cloud archives, images, CSVs, and bulk file operations - save time on repetitive tasks."
sidebar:
  label: "Media & Files"
  order: 7
---

Media and file operations are the boring tasks everyone does manually. With the right tools, what used to take 30 minutes takes 30 seconds.

> Automate repetitive tasks, or they will steal your days one by one.

## Cloud archives

### Cloudzip

Cloudzip lets you work with archives (ZIP, RAR, 7z) directly in the cloud without downloading them in full:

| Function | Advantage |
|----------|----------|
| **Online browsing** | Explore contents without downloading |
| **Selective extraction** | Download only the files you actually need |
| **Preview** | View images and documents before extracting |
| **Bandwidth savings** | No need to download a 2 GB archive just to get a 5 MB file |

---

## Image manipulation

### Magic Copy

Magic Copy uses AI to extract elements from an image in one click:

- **Smart cutout** - select an object and separate it from the background
- **Copy and paste** between images without Photoshop
- **Browser extension** - works directly on web images
- **No graphic design skills required**

### Other useful image tools

| Tool | Function |
|-------|----------|
| **ShareX** | Advanced screenshots + annotation + automatic upload |
| **GIMP** | Full-featured open-source image editor |
| **Squoosh** | Web image compression (Google, online) |
| **XnConvert** | Batch image conversion and processing |

---

## CSV and tabular data tools

### Qsv

Qsv is an ultra-fast command-line tool for handling CSV files:

- **Filtering** by columns, values, or regular expressions
- **Sorting** on any column, even in multi-gigabyte files
- **Statistics**: average, median, min, max in one command
- **Joining** CSV files like a database
- **Deduplication** automatically

### Concrete use cases

```text
# Show the first 10 lines
qsv slice -l 10 data.csv

# Filter rows where the "status" column equals "active"
qsv search -s status "active" data.csv

# Statistics on all numeric columns
qsv stats data.csv
```

---

## Batch file operations

### Mass renaming

| Tool | Type | Advantage |
|-------|------|----------|
| **PowerRename** (PowerToys) | GUI | Built into Windows Explorer, regex supported |
| **Bulk Rename Utility** | GUI | The most complete option, dozens of settings |
| **rename** (CLI) | Terminal | Extremely flexible Perl-based scripting |

### Batch conversion

- **FFmpeg** for video and audio (any format to any format)
- **ImageMagick** for images (`mogrify -format webp *.png`)
- **Pandoc** for documents (markdown -> PDF, DOCX -> HTML, etc.)
- **LibreOffice CLI** for Office files in batch

---

## Batch processing: the method

### 1. Identify the pattern

Before automating, spot the repetitive task:
- "I convert 20 images to WebP every week"
- "I rename my screenshots with the date"
- "I extract the same columns from a CSV every month"

### 2. Choose the right tool

- **Simple one-off task** -> GUI tool (PowerRename, XnConvert)
- **Recurring task** -> CLI script (FFmpeg, ImageMagick, qsv)
- **Complex multi-step task** -> PowerShell or Python script

### 3. Save the script

Create a `~/scripts/` folder and store your recurring commands there. A 3-line script that saves you 10 minutes a week is worth gold.

---

## Best practices

1. **Always test on a copy** before running a batch process on your originals
2. **Name your scripts clearly**: `convert-png-to-webp.sh`, not `script3.sh`
3. **Document your commands** with a comment on the first line
4. **Automate tasks you do more than 3 times** - the 4th time should be the last manual one
5. **Check the results** after every batch - a bad regex can rename 500 files into nonsense
