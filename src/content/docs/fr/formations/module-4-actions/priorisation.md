---
title: "Priorisation"
description: "Apprends à distinguer l'urgent de l'important avec la matrice d'Eisenhower, le scoring RICE et un processus d'audit de tes tâches."
sidebar:
  label: "Priorisation"
  order: 2
---

Avoir une longue to-do list n'est pas un signe de productivité — c'est un signe que tu n'as pas encore décidé ce qui compte vraiment. La priorisation, c'est **l'art de choisir ce que tu ne feras PAS**.

> "La productivité consiste en grande partie à décider ce que tu ne vas pas faire." — Oliver Burkeman

## La Matrice d'Eisenhower

Classe chaque tâche selon deux axes : **urgence** et **importance**.

| | **Urgent** | **Pas urgent** |
|---|---|---|
| **Important** | **Q1 — Faire immédiatement** | **Q2 — Planifier** |
| **Pas important** | **Q3 — Déléguer** | **Q4 — Éliminer** |

### Les 4 quadrants en détail

**Q1 — Urgent + Important : Crises et deadlines**
Exemples : bug critique en production, deadline client demain, urgence santé.
Action : traite immédiatement. Mais si tu passes ta vie en Q1, ton système est cassé.

**Q2 — Pas urgent + Important : Le quadrant de la croissance**
Exemples : formation, sport, planification stratégique, relations profondes.
Action : **bloque du temps chaque semaine**. C'est ici que se joue ta vie. La plupart des gens négligent Q2 et s'étonnent de stagner.

**Q3 — Urgent + Pas important : Les faux signaux**
Exemples : la plupart des emails, certaines réunions, interruptions de collègues.
Action : délègue, automatise ou regroupe en un seul créneau.

**Q4 — Pas urgent + Pas important : Le bruit**
Exemples : scroll réseaux sociaux, notifications inutiles, perfectionnisme sur des détails.
Action : élimine sans culpabilité.

## Le scoring RICE

Pour les décisions plus complexes (quel projet lancer, quelle feature développer), utilise le modèle RICE :

**Score RICE = (Reach × Impact × Confidence) / Effort**

| Facteur | Description | Échelle |
|---------|-------------|---------|
| **Reach** | Combien de personnes touchées ? | Nombre (ex: 500 users/mois) |
| **Impact** | Quel effet sur l'objectif ? | 0.25 (minimal) → 3 (massif) |
| **Confidence** | Quelle certitude sur ces estimations ? | 50% → 100% |
| **Effort** | Combien de personne-semaines ? | Nombre (ex: 2 semaines) |

Exemple concret :
- Feature A : (1000 × 2 × 80%) / 4 = **400**
- Feature B : (200 × 3 × 90%) / 1 = **540** ← Fais celle-ci d'abord

RICE te force à comparer objectivement au lieu de suivre ton instinct (souvent biaisé vers ce qui est fun plutôt que ce qui a de l'impact).

## Le processus d'audit de tâches

Chaque semaine, passe ta liste en revue avec ce processus en 5 étapes :

1. **Lister** — Vide tout ce qui traîne dans ta tête et tes outils dans une seule liste
2. **Catégoriser** — Place chaque tâche dans un quadrant Eisenhower
3. **Analyser** — Score les tâches Q1 et Q2 avec RICE si nécessaire
4. **Ajuster** — Élimine Q4, délègue Q3, planifie Q2, exécute Q1
5. **Revoir** — Chaque vendredi, 15 minutes : qu'est-ce qui a avancé, qu'est-ce qui bloque ?

## Les bénéfices concrets

Quand tu priorises correctement :

- **Moins de gaspillage** — tu arrêtes de polir des détails qui n'importent pas
- **Meilleur focus** — tu sais exactement quoi faire en premier chaque matin
- **Gestion du temps améliorée** — tu dis "non" plus facilement (et sans culpabilité)
- **Moins de stress** — l'incertitude diminue quand les priorités sont claires

## Le concept OneTask

Au lieu de jongler entre 5 projets, choisis **un seul objectif principal** par période (semaine ou sprint). Tout le reste est secondaire. Ce n'est pas de la limitation — c'est de la concentration stratégique.

Ta to-do list devrait répondre à une seule question chaque matin : **"Quelle est LA tâche qui, si elle est faite, rend tout le reste plus facile ou inutile ?"**

## [Beeminder](https://www.beeminder.com/) : quand l'engagement devient réel

La plupart des systèmes de productivité échouent au même endroit : au moment où ton toi du présent reprend la main sur le toi du futur. Tu avais décidé de faire du sport, d'écrire, de coder, de prospecter. Puis l'instant arrive, et tu négocies avec toi-même.

Beeminder est intéressant parce qu'il traite ce problème à la racine. Ce n'est pas juste un gestionnaire de tâches. C'est un **commitment device** : tu définis une trajectoire, tu mets de l'argent en jeu, et tu paies si tu dérailles.

### Pourquoi c'est puissant

Le concept repose sur une idée psychologique très forte : nous sommes souvent prêts à sacrifier le long terme pour un soulagement immédiat. Beeminder combat cela en rendant la conséquence du relâchement plus concrète, plus proche, plus douloureuse.

En pratique :
- tu définis un objectif mesurable
- Beeminder trace une ligne rouge à respecter
- si tu passes en dessous, tu "derail"
- un montant est alors prélevé selon ton niveau d'engagement

Cette logique est particulièrement utile si tu souffres de l'un de ces problèmes :
- tu sais exactement quoi faire, mais tu ne le fais pas régulièrement
- tu tiens quelques jours puis tu t'auto-négocies une exception
- tu es très bon pour te raconter des histoires intelligentes sur ton manque de temps
- tu as besoin d'une conséquence externe pour casser les compromis mous

### Ce qui rend Beeminder plus intelligent qu'une simple punition

Beeminder n'est pas seulement "tu rates, tu paies". Leur système inclut des garde-fous conceptuellement intéressants :

- **Pledge schedule** : les montants montent progressivement, au lieu de te jeter d'emblée dans une pénalité absurde
- **Akrasia horizon** : tu ne peux pas rendre ton objectif plus facile immédiatement; beaucoup de changements qui te relâchent ne prennent effet qu'après 7 jours
- **Pledge caps** : tu peux limiter jusqu'où la mise grimpe pour éviter de transformer l'outil en stress toxique
- **Intégrations automatiques** : le concept devient encore plus fort quand la donnée remonte automatiquement, par exemple via RescueTime, Fitbit, Duolingo ou d'autres sources

L'idée de l'**akrasia horizon** est particulièrement brillante : si tu pouvais rendre ton engagement plus facile au moment même où tu veux l'abandonner, tout le système s'effondrerait. Beeminder protège donc l'engagement contre tes humeurs du moment.

### Quand l'utiliser

Beeminder est très bon pour :
- écrire tous les jours
- faire du sport régulièrement
- limiter un usage distrayant
- tenir un rythme de production
- imposer une discipline minimale sur une habitude déjà claire

Il est moins bon si :
- ton objectif est mal défini
- la mesure est floue ou facilement trichable
- ton problème principal est stratégique, pas comportemental
- tu es déjà dans une phase de fragilité où la punition financière risque d'ajouter surtout de la honte ou du stress

### La bonne manière de l'utiliser

Commence petit. Ne choisis pas un montant héroïque pour te prouver que tu es sérieux. Le but est de trouver ton **niveau d'engagement crédible**, celui qui te pousse vraiment à agir sans transformer ta vie en tribunal permanent.

Beeminder ne remplace ni la clarté, ni la priorisation, ni la motivation profonde. Mais pour certaines personnes, c'est l'outil qui transforme enfin une bonne intention en contrainte réelle.
