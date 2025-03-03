import type { MiddlewareHandler } from 'astro'
import { defaultLocale, locales, routes } from '../i18n/config'
import type { Language } from '../types'

interface Locals extends App.Locals {
  lang: Language
}

export const i18nMiddleware: MiddlewareHandler = async ({ url, locals, redirect }, next) => {
  const pathname = url.pathname

  // Si nous sommes à la racine
  if (pathname === '/') {
    locals.lang = defaultLocale
    return next()
  }

  // Extraire le premier segment de l'URL
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  // Déterminer la langue de manière sûre
  let currentLang = defaultLocale as Language
  if (locales.includes(firstSegment as Language)) {
    currentLang = firstSegment as Language
  }

  // Stocker la langue dans locals
  locals.lang = currentLang

  // Si nous sommes sur une route avec paramètres (ex: [...blog_slug].astro)
  if (segments.length > 1) {
    const routeBase = segments[1].split('_')[0] // Extrait 'blog' de 'blog_slug'
    
    if (currentLang === 'fr') {
      // Vérifier si nous avons une traduction pour cette route
      const frRoute = routes.fr[routeBase]
      if (frRoute) {
        return next()
      }
      
      // Si nous sommes sur la version française d'une route anglaise
      if (Object.keys(routes.en).includes(routeBase)) {
        const enRoute = routeBase
        const frRoute = routes.fr[enRoute]
        if (frRoute) {
          return redirect(`/fr/${frRoute}${segments.slice(2).join('/')}`)
        }
      }
    } else {
      // Pour les routes anglaises
      const enRoute = routes.en[routeBase]
      if (enRoute) {
        return next()
      }
    }
  }

  // Pour les routes statiques
  if (currentLang === 'fr') {
    const pathWithoutLang = '/' + segments.slice(1).join('/')
    const routeExists = Object.values(routes.fr).some(fr => pathWithoutLang === `/${fr}`)
    if (routeExists) {
      return next()
    }

    const enRoute = Object.entries(routes.fr).find(([en]) => pathWithoutLang === `/${en}`)
    if (enRoute) {
      return redirect(`/fr/${enRoute[1]}`)
    }
  } else {
    const routeExists = Object.values(routes.en).some(en => pathname === `/${en}`)
    if (routeExists) {
      return next()
    }

    const frRoute = Object.entries(routes.fr).find(([en, fr]) => pathname === `/fr/${fr}`)
    if (frRoute) {
      return redirect(`/${frRoute[0]}`)
    }
  }

  // Si aucune redirection n'est nécessaire, continuer
  return next()
} 