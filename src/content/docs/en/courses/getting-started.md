---
title: Getting Started with WinFlowz
description: Learn the basics of WinFlowz and start your first project
sidebar:
  label: Getting Started
  order: 1
courseData:
  translations:
    en:
      title: "Getting Started with WinFlowz"
      description: "Learn the basics of WinFlowz and start your first project"
      objectives: 
        - "Understand WinFlowz's core concepts"
        - "Set up your development environment"
        - "Create and configure your first project"
      prerequisites:
        - "Basic understanding of web development"
        - "Familiarity with command line interface"
    fr:
      title: "Débuter avec WinFlowz"
      description: "Apprenez les bases de WinFlowz et commencez votre premier projet"
      objectives:
        - "Comprendre les concepts fondamentaux de WinFlowz"
        - "Configurer votre environnement de développement"
        - "Créer et configurer votre premier projet"
      prerequisites:
        - "Connaissances de base en développement web"
        - "Familiarité avec l'interface en ligne de commande"
  duration: "2h"
  level: "beginner"
  components:
    - type: "video"
      data:
        url: "https://example.com/intro-video"
        duration: "10:00"
        title: "Introduction to WinFlowz"
    - type: "exercise"
      data:
        title: "Environment Setup"
        instructions: "Follow the steps to install and configure WinFlowz"
        steps:
          - "Install Node.js and pnpm"
          - "Clone the starter repository"
          - "Install dependencies"
---

import CourseHeader from '@components/ui/starlight/CourseHeader.astro';

<CourseHeader frontmatter={frontmatter} lang={currentLocale} />

## Introduction

WinFlowz is a powerful suite of tools designed to optimize your development workflow. In this course, we'll explore the essential features and guide you through creating your first project.

## Installation

1. First, make sure you have Node.js installed on your system
2. Install pnpm globally:
   ```bash
   npm install -g pnpm
   ```
3. Create a new project:
   ```bash
   pnpm create winflowz-app my-project
   ```

## Configuration

The basic configuration includes several important steps:

1. **Project Initialization**
   ```bash
   cd my-project
   pnpm install
   ```

2. **Environment Setup**
   - Create an `.env` file at the project root
   - Add your environment variables

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

## Next Steps

Once your environment is configured, you can:
- Explore the complete documentation
- Join our Discord community
- Follow our advanced tutorials 