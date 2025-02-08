import type { Language } from '@/types'

interface RouteDefinition {
  en: string
  fr: string
}

export const ROUTES: Record<string, RouteDefinition> = {
  index: {
    en: '',
    fr: ''
  },
  products: {
    en: 'products',
    fr: 'produits'
  },
  contact: {
    en: 'contact',
    fr: 'contact'
  },
  blog: {
    en: 'blog',
    fr: 'blog'
  },
  roadmap: {
    en: 'roadmap',
    fr: 'roadmap'
  },
  services: {
    en: 'services',
    fr: 'services'
  },
  about: {
    en: 'about',
    fr: 'a-propos'
  },
  welcome: {
    en: 'welcome-to-docs',
    fr: 'bienvenue'
  },
  disclaimer: {
    en: 'disclaimer',
    fr: 'avertissement'
  },
  copyright: {
    en: 'copyright',
    fr: 'droits-auteur'
  },
  terms: {
    en: 'terms',
    fr: 'conditions-utilisation'
  },
  privacy: {
    en: 'privacy',
    fr: 'confidentialite'
  }
}

export function generateStaticPaths(routeKey: keyof typeof ROUTES) {
  const route = ROUTES[routeKey]
  return [
    {
      params: { lang: undefined, [routeKey]: route.en },
      props: { lang: 'en' as Language }
    },
    {
      params: { lang: 'fr', [routeKey]: route.fr },
      props: { lang: 'fr' as Language }
    }
  ]
}

export function getLocalizedPath(lang: Language, routeKey: keyof typeof ROUTES): string {
  const route = ROUTES[routeKey]
  const prefix = lang === 'fr' ? '/fr' : ''
  const path = route[lang]
  return path ? `${prefix}/${path}` : prefix || '/'
} 