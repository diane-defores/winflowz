import { ROUTES, getLocalizedPath } from './routing'
import type { Language } from '@/types'

interface SocialLinks {
  facebook: string
  twitter: string
  github: string
  linkedin: string
  instagram: string
}

interface NavigationLink {
  name: string
  url: string
}

interface FooterSection {
  section: string
  links: NavigationLink[]
}

function getNavLinks(lang: Language = 'en'): NavigationLink[] {
  return [
    { name: lang === 'fr' ? 'Accueil' : 'Home', url: getLocalizedPath(lang, 'index') },
    { name: lang === 'fr' ? 'Applications' : 'Apps', url: getLocalizedPath(lang, 'products') },
    { name: 'Roadmap', url: getLocalizedPath(lang, 'roadmap') },
    { name: lang === 'fr' ? 'Services' : 'Services', url: getLocalizedPath(lang, 'services') },
    { name: 'Blog', url: getLocalizedPath(lang, 'blog') },
    { name: 'Contact', url: getLocalizedPath(lang, 'contact') },
  ]
}

function getFooterLinks(lang: Language = 'en'): FooterSection[] {
  return [
    {
      section: lang === 'fr' ? 'Écosystème' : 'Ecosystem',
      links: [
        { name: lang === 'fr' ? 'Cours' : 'Courses', url: getLocalizedPath(lang, 'welcome') },
        { name: lang === 'fr' ? 'Applications' : 'Apps', url: getLocalizedPath(lang, 'products') },
        { name: 'Services', url: getLocalizedPath(lang, 'services') },
      ],
    },
    {
      section: lang === 'fr' ? 'Entreprise' : 'Company',
      links: [
        { name: lang === 'fr' ? 'À propos' : 'About us', url: getLocalizedPath(lang, 'about') },
        { name: 'Blog', url: getLocalizedPath(lang, 'blog') },
        { name: lang === 'fr' ? 'Avertissement' : 'Disclaimer', url: getLocalizedPath(lang, 'disclaimer') },
        { name: lang === 'fr' ? 'Droits d\'auteur' : 'Copyright policy', url: getLocalizedPath(lang, 'copyright') },
        { name: lang === 'fr' ? 'Conditions d\'utilisation' : 'Terms of use', url: getLocalizedPath(lang, 'terms') },
        { name: lang === 'fr' ? 'Politique de confidentialité' : 'Privacy policy', url: getLocalizedPath(lang, 'privacy') },
      ],
    },
  ]
}

export const socialLinks: SocialLinks = {
  facebook: "#",
  twitter: "#",
  github: "https://github.com/dianedef/winflowz",
  linkedin: "#",
  instagram: "#",
}

export default {
  getNavLinks,
  getFooterLinks,
  socialLinks,
}