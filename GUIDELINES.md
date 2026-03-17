# Guidelines — WinFlowz

## Langue et ton

- **Bilinguisme** : le site est disponible en anglais et en français via le système i18n. L'anglais est la langue par défaut pour maximiser la portée internationale
- **Ton** : professionnel mais accessible, orienté résultats, sans jargon technique inutile
- **Formulations** : directes, concrètes, centrées sur le bénéfice utilisateur

## Design

### Direction artistique
- **Glass morphism** : effets de transparence et de flou pour une esthétique moderne
- **Smooth scrolling** : défilement fluide via Lenis
- **View Transitions** : transitions de pages natives Astro pour une navigation sans rechargement
- **Mode sombre** : supporté nativement

### Branding visuel
- **Palette** : rainbow spectrum exclusivement. Pas d'orange, de bleu ni d'indigo en couleur dominante
- Se référer à `BRANDING.md` pour les spécifications complètes de la charte graphique

## Architecture technique

### Stack principal
- **Astro** : SSG pour le site marketing et les pages de contenu
- **Vue** : composants interactifs (SFC) intégrés dans les pages Astro
- **Starlight** : thème Astro pour la documentation, structurée par catégorie de produit et d'outil
- **UnoCSS / Tailwind** : classes utilitaires pour le styling

### Performance
- `font-display: swap` pour les polices personnalisées
- Optimisation des images (formats modernes, lazy loading)
- Vendor chunk splitting pour le JavaScript

### SEO
- Meta tags complets sur chaque page
- Images Open Graph générées
- Sitemap XML automatique
- Données structurées (JSON-LD)

## Code

### Conventions
- Composants Astro (`.astro`) pour les pages et layouts
- Composants Vue SFC (`.vue`) pour l'interactivité
- Classes utilitaires UnoCSS/Tailwind pour le styling
- TypeScript pour la logique applicative

### Documentation
- Starlight pour la documentation publique
- Organisation par catégorie de produit et d'outil
- Exemples de code systématiques

## Écosystème

- **Authentification** : Clerk, partagée avec VoiceFlowz
- **Backend** : Convex, partagé avec VoiceFlowz pour la synchronisation temps réel
- **Cohérence** : mêmes principes de design et de branding à travers tous les produits de l'écosystème
