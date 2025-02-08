---
title: Débuter avec WinFlowz
description: Apprenez les bases de WinFlowz et commencez votre premier projet
sidebar:
  label: Débuter avec WinFlowz
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
        title: "Introduction à WinFlowz"
    - type: "exercise"
      data:
        title: "Configuration de l'environnement"
        instructions: "Suivez les étapes pour installer et configurer WinFlowz"
        steps:
          - "Installer Node.js et pnpm"
          - "Cloner le dépôt de démarrage"
          - "Installer les dépendances"
---

import CourseHeader from '@components/ui/starlight/CourseHeader.astro';

<CourseHeader frontmatter={frontmatter} lang={currentLocale} />

## Introduction

WinFlowz est une suite d'outils puissante conçue pour optimiser votre flux de travail de développement. Dans ce cours, nous allons explorer les fonctionnalités essentielles et vous guider à travers la création de votre premier projet.

## Installation

1. D'abord, assurez-vous d'avoir Node.js installé sur votre système
2. Installez pnpm globalement :
   ```bash
   npm install -g pnpm
   ```
3. Créez un nouveau projet :
   ```bash
   pnpm create winflowz-app mon-projet
   ```

## Configuration

La configuration de base comprend plusieurs étapes importantes :

1. **Initialisation du projet**
   ```bash
   cd mon-projet
   pnpm install
   ```

2. **Configuration de l'environnement**
   - Créez un fichier `.env` à la racine du projet
   - Ajoutez vos variables d'environnement

3. **Démarrage du serveur de développement**
   ```bash
   pnpm dev
   ```

## Prochaines étapes

Une fois votre environnement configuré, vous pouvez :
- Explorer la documentation complète
- Rejoindre notre communauté Discord
- Suivre nos tutoriels avancés 