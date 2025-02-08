import type { Language } from '@/types'

export const defaultLocale = 'en'
export const locales: Language[] = ['en', 'fr']

export const showDefaultLocale = false

type RouteMap = {
  [key: string]: string
}

export const routes: {
  en: RouteMap
  fr: RouteMap
} = {
  en: {
    'products': 'products',
    'about': 'about',
    'contact': 'contact',
    'blog': 'blog',
    'roadmap': 'roadmap',
    'services': 'services',
    'privacy': 'privacy',
    'terms': 'terms',
    'disclaimer': 'disclaimer',
    'copyright': 'copyright',
    'legal': 'legal'
  },
  fr: {
    'products': 'produits',
    'about': 'a-propos',
    'contact': 'contact',
    'blog': 'blog',
    'roadmap': 'roadmap',
    'services': 'services',
    'privacy': 'confidentialite',
    'terms': 'conditions-utilisation',
    'disclaimer': 'avertissement',
    'copyright': 'droits-auteur',
    'legal': 'mentions-legales'
  }
} 