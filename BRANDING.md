---
artifact: brand_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: winflowz
created: "2026-04-25"
updated: "2026-04-27"
status: reviewed
source_skill: sf-docs
scope: brand
owner: "Diane"
confidence: medium
risk_level: medium
security_impact: unknown
docs_impact: yes
brand_voice: "Practical, calm, direct, Windows-first, bilingual."
trust_posture: "No hype, no fabricated proof, no unsupported performance claims."
depends_on: []
supersedes: []
evidence: []
next_review: "unknown"
next_step: /sf-docs audit BRANDING.md
---
# Branding — WinFlowz

This file defines the brand contract used by product pages, marketing pages, and editorial content. It focuses on reliable guidance, not speculative design details.

## Brand Core

- Name: `WinFlowz`
- Core promise: improve real Windows workflows through structured education and practical systems
- Commercial center: `Windows Mastery`
- Language posture: bilingual (`en` and `fr`) with parity on key commercial surfaces

## Tagline Direction

Primary tagline:

`Optimize your Windows workflow`

French equivalent used when localized copy requires symmetry:

`Optimise ton workflow Windows`

## Voice And Tone

Voice characteristics:

- direct and operational, not abstract
- calm and credible, not aggressive or hyperbolic
- system-focused (workflow, decisions, habits), not feature-list copy
- pragmatic for professionals, solo creators, and learners

Tone constraints:

- no fabricated social proof, metrics, or testimonial claims
- no "all-in-one miracle" language
- no anti-Mac rhetoric; stay pro-Windows and practical

## Messaging Hierarchy

1. `Windows Mastery` is the lead offer and narrative center.
2. Blog/docs content educates and qualifies users.
3. Companion pages support the main promise without diluting the positioning.

## Claim Policy

Allowed claims:

- Windows-first workflow positioning
- structured learning and practical implementation
- bilingual publishing and localized surfaces
- gated learning flow where implemented in product routes

Forbidden without explicit in-repo source:

- revenue numbers and growth percentages
- customer volume claims
- quantified outcomes for users
- "industry leader" positioning statements

## Localization Rules

- Keep `en` and `fr` offer pages aligned in intent and CTA.
- Localize examples and phrasing, not just literal wording.
- If one language changes offer structure, update the other in the same batch.

## Brand Review Trigger

- update this file when offer naming changes
- update this file when brand voice or audience strategy shifts
- verify all major copy updates against this contract before publish


---

## Iconography & Visual Elements

### Icon Sources
- **Astro Starlight Icons**: Used via `@astrojs/starlight/components`
- **Custom SVG Icons**: Located in `src/components/ui/icons/`

### Decorative Elements

#### Hero Section Gradient Blur
```css
background: linear-gradient(to right, #44BCFF, #FF44EC, #FF675E);
opacity: 0.30;
filter: blur(24px); /* Tailwind's blur-lg equivalent */
```

#### Page Background (Starlight)
```css
background: 
  linear-gradient(215deg, var(--overlay-yellow), transparent 40%),
  radial-gradient(var(--overlay-yellow), transparent 40%) no-repeat center center / cover,
  radial-gradient(var(--overlay-yellow), transparent 65%) no-repeat center center / cover;
background-blend-mode: overlay;
```

### Logo Assets
| File | Location | Purpose |
|------|----------|---------|
| `WinFlowz.png` | `/public/WinFlowz.png` | OG Image, Social sharing |
| `WinFlowz.png` | `/public/images/WinFlowz.png` | Alternative location |
| `WinFlowz.png` | `/src/images/WinFlowz.png` | Source image |
| `banner-pattern.svg` | `/public/banner-pattern.svg` | Decorative pattern |

---

## Animation & Motion

### Link Hover Animation (Rainbow Underline)

```css
a::before, a::after {
  background-image: linear-gradient(90deg, 
    #ff0033ff,   /* Red */
    #ff00c8ff,   /* Magenta */
    #ffe500ff,   /* Yellow */
    #00ff44ff,   /* Green */
    #00c8ffff,   /* Cyan */
    #ff0033ff    /* Red (loop) */
  );
  height: 3px;
}

a::before {
  width: 0%;
  transition: width 0.3s ease-in-out;
}

a:hover::before {
  width: 100%;
}

@keyframes gradient-animation {
  0% { background-position: 0% 100%; }
  100% { background-position: 200% 100%; }
}
```

### Logo Gradient Animation

```css
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Duration: 6s (normal), 4s (hover) */
animation: gradient 6s ease infinite;
```

### Glow Pulse Animation

```css
@keyframes pulseGlow {
  0%, 100% {
    transform: scale(1) translateZ(-10px);
    filter: blur(12px);
    border-radius: 45% / 100%;
  }
  50% {
    transform: scale(1.1) translateZ(-10px);
    filter: blur(14px);
    border-radius: 35% / 100%;
  }
}
```

### Transition Defaults
- **Standard**: `transition duration-300`
- **Smooth**: `transition-all duration-200`
- **Complex**: `transition 0.5s cubic-bezier(0.23, 1, 0.32, 1)`

### Smooth Scrolling
```css
html {
  scroll-behavior: smooth;
}
```
Uses Lenis library for enhanced smooth scrolling (`src/assets/styles/lenis.css`).

---

## Component Styles

### Navbar

```css
/* Container */
border-radius: rounded-[36px] (desktop), rounded-[28px] (mobile);
background: bg-white/60 (light), bg-neutral-800/80 (dark);
backdrop-filter: blur(md);
border: 1px solid neutral-200/60 (light), neutral-700/40 (dark);
shadow: shadow-sm (light), shadow-none (dark);

/* Positioning */
position: sticky;
top: 1rem (sm:top-4);
z-index: 50;
```

### Buttons

#### Primary CTA
```css
background: bg-gray-900;
hover: bg-magenta, bg-gradient-rainbow;
color: white;
border-radius: rounded-xl;
padding: px-6 py-2.5 (mobile), px-8 py-3 (desktop);
font-weight: bold;
border: 2px transparent;
transition: all 200ms;
```

#### Secondary CTA
```css
background: bg-neutral-100 (light), bg-zinc-700 (dark);
border: 2px solid gray-400;
hover: bg-magenta, border-magenta;
border-radius: rounded-xl;
padding: px-4 py-2.5 (mobile), px-6 py-3 (desktop);
font-weight: bold;
```

#### Starlight Action Buttons
```css
/* Primary variant */
.action.primary {
  background: var(--sl-color-text-accent);
  color: var(--sl-color-black);
  border-radius: 999rem;
  padding: 0.5rem 1.125rem (mobile), 1rem 1.25rem (desktop);
}

/* Secondary variant */
.action.secondary {
  background: var(--sl-color-black);
  border: 2px solid currentColor;
}
```

### Cards

#### Starlight Asides
```css
/* Tip */
.starlight-aside--tip {
  background: linear-gradient(45deg, #ff00c8, #ffe500);
  color: #2d2d2d;
  border-radius: 0.5rem;
}

/* Note */
.starlight-aside--note {
  background: linear-gradient(45deg, #00c8ff, #00ff44);
  color: #1a1a1a;
  border-radius: 0.5rem;
}
```

### Scrollbar Styling

```css
/* WebKit Browsers */
::-webkit-scrollbar { width: 12px; }
::-webkit-scrollbar-track { background: #ffffff (light), #272727 (dark); }
::-webkit-scrollbar-thumb {
  background: var(--sl-color-accent, #ffcfaa);
  border: 3px solid #ffffff (light), #272727 (dark);
  border-radius: 9999px;
}

/* Firefox */
scrollbar-width: thin;
/* Light mode: accent color on white track */
scrollbar-color: var(--sl-color-accent, #ffcfaa) #ffffff;
/* Dark mode (applied via html.dark): accent color on gray track */
/* html.dark { scrollbar-color: var(--sl-color-accent, #ffcfaa) var(--sl-color-gray-6, #272727); } */
```

---

## Theme System (Light/Dark)

### Dark Mode Configuration
```javascript
// tailwind.config.mjs
darkMode: ['class', '[data-theme="dark"]']
```

### Theme Toggle Implementation
- Uses Preline UI's `hs-dark-mode` system
- Toggle buttons with sun (light) and moon (dark) icons
- Transition: 300ms duration

### CSS Variables Approach
The Starlight theme uses CSS custom properties for seamless theme switching:
- `:root` / `:root[data-theme="dark"]` for dark mode
- `:root[data-theme="light"]` for light mode
- `.dark` class as fallback

---

## Internationalization

### Supported Languages
- **English (en)**: Default locale
- **French (fr)**: Secondary locale

### URL Structure
- English: `/`, `/products`, `/about`, etc.
- French: `/fr`, `/fr/produits`, `/fr/a-propos`, etc.

### Route Translations
```javascript
// English routes
'products', 'about', 'contact', 'blog', 'roadmap', 'services',
'privacy', 'terms', 'disclaimer', 'copyright', 'legal'

// French routes
'produits', 'a-propos', 'contact', 'blog', 'roadmap', 'services',
'confidentialite', 'conditions-utilisation', 'avertissement',
'droits-auteur', 'mentions-legales'
```

### Translation Files
- `/src/i18n/en/` - English translations
- `/src/i18n/fr/` - French translations

---

## Asset Inventory

### Fonts
| File | Format | Location |
|------|--------|----------|
| Audiowide-Regular.woff2 | WOFF2 | `/public/fonts/` |

### Images
| File | Location | Purpose |
|------|----------|---------|
| WinFlowz.png | `/public/`, `/public/images/`, `/src/images/` | Logo, OG image |
| banner-pattern.svg | `/public/` | Decorative pattern |
| houston_love.png | `/src/assets/` | Mascot/character |
| exploding-head-much-work.gif | `/public/images/` | Animated reaction |
| hacker-pc.gif | `/public/images/` | Animated illustration |

### Style Files
| File | Location | Purpose |
|------|----------|---------|
| global.css | `/src/assets/styles/` | Global styles, scrollbar |
| starlight.css | `/src/assets/styles/` | Starlight theme overrides |
| lenis.css | `/src/assets/styles/` | Smooth scroll library |

### Component Files (Brand-Related)
| File | Location | Purpose |
|------|----------|---------|
| BrandLogo.astro | `/src/components/` | SVG logo component |
| TextLogo.astro | `/src/components/ui/` | Animated text logo |
| Button.astro | `/src/components/` | Starlight button styles |
| PrimaryCTA.astro | `/src/components/ui/buttons/` | Primary call-to-action |
| SecondaryCTA.astro | `/src/components/ui/buttons/` | Secondary call-to-action |
| ThemeIcon.astro | `/src/components/` | Theme toggle icons |
| ThemePicker.astro | `/src/components/ui/` | Theme selection dropdown |
| LanguagePicker.astro | `/src/components/ui/` | Language selection |

---

## Quick Reference

### Key Brand Colors
```
Rainbow Gradient (ONLY COLORS USED):
Red:     #ff0033
Magenta: #ff00c8
Yellow:  #ffe500
Green:   #00ff44
Cyan:    #00c8ff

Gradient: linear-gradient(45deg, #ff0033, #ff00c8, #ffe500, #00ff44, #00c8ff, #ff0033)
```

### Key Measurements
```
Navbar radius: 36px (desktop), 28px (mobile)
Button radius: rounded-xl (1rem)
Card radius: 0.5rem
Max content width: 85rem
Full width container: 2xl:max-w-screen-2xl
```

### Key Transitions
```
Standard: 300ms
Smooth: 200ms
Complex: 500ms cubic-bezier(0.23, 1, 0.32, 1)
Gradient animation: 6s (normal), 4s (hover)
```

---

*Last Updated: January 10, 2026*
*Source Repository: dianedef/winflowz*
