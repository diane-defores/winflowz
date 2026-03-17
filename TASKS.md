# WinFlowz Formation — Backlog

> Audit date: 2026-03-09
> Course: 39 pages across 8 modules (FR)
> Benchmark: Ali Abdaal LifeOS, Tiago Forte BASB, Thomas Frank, August Bradley PPV

---

## Dashboard

| Module | Pages | Quality | Priority fixes |
|--------|-------|---------|---------------|
| I — Productivité | 7 | A | Exercises, sources, cross-links |
| II — Windows | 7 | A- | Cross-links, exercises |
| III — Temps & Énergie | 3 | A | Weekly review page, exercises |
| IV — Actions | 3 | B+ | Troubleshooting, tool workflow, setup guide |
| V — Consommer | 4 | B | Restructure, deepen, connect to PKM |
| VI — Connaissances | 8 | B+ | Reorder, decision trees, minimal setup, backlinks concept |
| VII — Social | 6 | A | Privacy notes, cross-links |
| VIII — Raccourcis | 1 | B | Add Slack/Teams/VSCode, deepen |
| Hub page | 1 | B | Progression path, CTA |

---

## 🔴 Critical — Missing from any professional course

- [ ] **Exercises & deliverables per module** — Every module should produce a tangible artifact (ton système de tâches, ton workflow de capture, ton template de revue hebdo). Top courses (BASB, LifeOS) all do this. Currently: zero exercises across 39 pages.
- [ ] **Weekly review as keystone habit** — Every major course converges on this as THE most important practice. We don't have a dedicated page. Add to Module III or IV: structured 60-90 min ritual (process tasks, review energy data, digital declutter, set intentions).
- [ ] **AI integration depth** — "Utilise l'IA partout" is not enough in 2026. Need concrete AI workflows: prompt templates for prioritization, AI-assisted weekly review, ChatGPT for brainstorming, AI note summarization. MIT now has a dedicated course on "Personal Productivity in the Age of AI".
- [ ] **Learning objectives** — Each page should start with "À la fin de cette leçon, tu sauras..." (2-3 bullet points). Currently: none.
- [ ] **Cross-references between modules** — Concepts repeat across modules without linking. Examples: Backwardation (M4) should reference PKM for research; Focus (M1) should link to Timeboxing (M3); Discipline habits should link to Habit trackers (M4). Currently: zero cross-links.

## 🟠 High — Would significantly improve quality

- [ ] **Module V (Consommer) restructure** — Weakest module. Pages feel disconnected. Restructure as a consumption pipeline: Trouver → Filtrer → Lire → Synthétiser. Add decision tree for tool selection.
- [ ] **Module VI reorder** — "Consommer & Réfléchir" (order 8) is foundational but listed last. Move to order 2 (after index). Current order makes reader build systems before learning how to consume intentionally.
- [ ] **"Getting Started" quick-start guide** — Top courses all have this. Add a page to Module I or hub: "Week 1: the minimum viable setup in 15 minutes. Week 4: your full system." Prevents tool overload paralysis.
- [ ] **Failure recovery** — What to do when the system breaks. No course teaches this well (identified gap across industry). Huge differentiator opportunity. Add to Module IV or III.
- [ ] **Module VI tool overload** — 30+ tools across 8 pages. Add "Minimum Viable PKM" sidebar: the 3 tools you actually need to start (ex: Flow Launcher + Obsidian + Hoarder). Decision trees instead of lists.
- [ ] **Obsidian/Logseq missing** — Module VI covers PKM but doesn't mention the two dominant PKM tools of 2025-26. No mention of backlinks, graph view, or linked thinking — which is the core innovation in modern PKM.
- [ ] **Source citations** — Several stats are unsourced: "24 min to refocus" (Gloria Mark, 2004), "66 days for habits" (Lally et al., 2009), "147 min/day social media" (outdated, now ~2h30). Add inline sources.
- [ ] **Module VIII expand** — Missing entire categories: Slack, Teams, VSCode/developer shortcuts, Windows 11-specific (Snap Layouts). Add app-specific shortcut sub-sections.

## 🟡 Medium — Would make the course great

- [ ] **"Next lesson" navigation** — Each page should end with a CTA pointing to the next page. Currently pages just end.
- [ ] **Hub page progression** — Transform formations.mdx into a visual learning path (not just a list). Show recommended order, estimated time per module, visual progress.
- [ ] **Slow productivity / burnout prevention** — Cal Newport's "Slow Productivity" (2024) is now standard. We touch on it (rest, boundaries) but don't name or develop the concept: fewer things, at a natural pace, obsess over quality.
- [ ] **Personalization guidance** — "Ce qui marche pour un influenceur YouTube ne marchera pas pour un développeur freelance." Add a page or section on identifying your productivity personality/cognitive style and adapting the system.
- [ ] **Tone consistency** — Module VII uses Starlight admonitions (:::tip, :::caution) and structured 4-week challenges. Other modules don't. Standardize engagement patterns across all modules.
- [ ] **Privacy/GDPR notes** — Several tools (Hunter.io, LinkedIn Sales Navigator, MailTrack) have privacy implications. Add brief disclaimers.
- [ ] **Reflection prompts** — End each page with "Qu'est-ce que tu vas mettre en place cette semaine ?" Module VII already does this (4-week challenges). Extend to all modules.
- [ ] **Tool pricing/dates** — Add "dernière vérification : mars 2026" to tool tables. Prices change, tools disappear.

## 🟢 Low — Nice to have

- [ ] **EN translation stubs** — Create stub files under `en/formations/` with `draft: true`
- [ ] **Image migration** — Copy images from CONTENU/ to `public/images/cours/`, fix Obsidian references
- [ ] **Community/accountability angle** — Top courses with community have 5x engagement. Even a simple groupe Facebook link + accountability partner suggestion would help.
- [ ] **Video content** — Many source notes reference YouTube videos. Consider embedding key ones or creating course-specific video content.
- [ ] **Measurable outcomes** — BASB reports "40% improvement in notetaking confidence." Define measurable claims: "saves X hours/week," "reduces email time by Y%."
- [ ] **Tiered pricing strategy** — Le contenu est le produit (pas l'affiliation). Industry standard: Basic (97-197€), Premium (297-497€ avec communauté + templates), Accompagné (697-997€ avec coaching). Module I gratuit comme vitrine.
- [ ] **Paywall / gating** — Implémenter le gating sur Starlight : Module I public, Modules II-VIII derrière auth (Clerk) + paiement (Polar.sh). Preview de quelques pages par module pour donner envie.
- [ ] **Cohort option** — Cohort-based courses achieve 85-96% completion vs ~30% self-paced. Consider periodic cohort launches.
- [ ] **Notion/Obsidian templates** — Downloadable templates matching each module's system (weekly review template, PKM starter, habit tracker). Valeur perçue élevée → justifie le prix.

---

## Content gaps identified (new pages to consider)

| Proposed page | Module | Rationale |
|--------------|--------|-----------|
| `revue-hebdomadaire.md` | III or IV | Keystone habit, every top course has this |
| `ia-productivite.md` | I or new | AI workflows for productivity (2026 table stakes) |
| `demarrage-rapide.md` | I (hub) | Quick-start guide, prevents overwhelm |
| `quand-le-systeme-casse.md` | IV | Failure recovery, unique differentiator |
| `productivite-lente.md` | I or III | Slow productivity / burnout prevention |
| `pensee-liee.md` | VI | Backlinks, graph view, linked thinking |
| `personnalise-ton-systeme.md` | I | Cognitive styles, adapting frameworks |

---

## Benchmarking vs top courses

| Feature | WinFlowz | Ali Abdaal | Tiago Forte | Thomas Frank |
|---------|----------|------------|-------------|--------------|
| Modules | 8 | 7 | 6 | 3 |
| Pages | 39 | 38 lessons | ~30 lessons | ~15 lessons |
| Exercises | None | Workbook | Exercises/module | Exercises/module |
| Learning objectives | None | Yes | Yes | Implicit |
| Weekly review | Not taught | Core practice | Core practice | Core practice |
| AI integration | Shallow | Growing | Minimal | Growing |
| Community | None | Pro tier | 3000+ members | Skillshare |
| Cross-references | None | Some | Strong | Some |
| Quick-start | None | Workbook | App quiz | Video 1 |
| Tool-agnostic | Yes (Windows) | Yes | Yes | Notion-focused |
| Failure recovery | None | None | None | None |
| French content | Native | EN only | EN only | EN only |

**Our advantages**: Native French (eux sont EN only), Windows-specific depth, broader scope (8 modules vs 3-7), contenu = produit principal (pas un lead magnet).
**Our gaps**: No exercises, no weekly review, no AI depth, no community, no quick-start, no paywall/gating yet.
**Business model**: Formation payante (tiers). Module I gratuit = vitrine. Affiliation = bonus, pas le core. Templates + communauté = valeur perçue pour tiers supérieurs.
