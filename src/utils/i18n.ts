import type { Language, Translation } from '@/types/i18n';

// Fonction pour obtenir la langue depuis l'URL
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  return lang === 'fr' ? 'fr' : 'en';
}

// Fonction pour charger les traductions UI communes
export async function useUI(lang: Language) {
  const translations = await import(`../content/i18n/${lang}/ui.json`);
  return translations as Translation;
}

// Fonction pour charger les traductions spécifiques
export async function useTranslations(lang: Language, page: string) {
  const translations = await import(`../content/i18n/${lang}/${page}.json`);
  return translations as Translation;
}

// Fonction pour charger les routes traduites
export async function useRoutes(lang: Language) {
  const routes = await import(`../content/i18n/${lang}/routes.json`);
  return routes as Translation;
}

// Fonction pour obtenir l'URL traduite
export async function getLocalizedPath(lang: Language, path: string): Promise<string> {
  const routes = await useRoutes(lang);
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length === 0) return '/';

  const localizedSegments = segments.map(segment => {
    return routes[segment] || segment;
  });

  return lang === 'en' 
    ? `/${localizedSegments.join('/')}` 
    : `/fr/${localizedSegments.join('/')}`;
}

// Fonction pour obtenir les liens alternatifs pour le SEO
export async function getAlternateLinks(currentPath: string) {
  const enPath = await getLocalizedPath('en', currentPath);
  const frPath = await getLocalizedPath('fr', currentPath);

  return [
    { href: `https://winflowz.com${enPath}`, hreflang: 'en' },
    { href: `https://winflowz.com${frPath}`, hreflang: 'fr' }
  ];
}

// Fonction pour obtenir les métadonnées d'une page
export async function getPageMeta(lang: Language, page: keyof MetaTranslations) {
  const meta = await useMeta(lang);
  return {
    ...meta[page],
    alternateLinks: await getAlternateLinks(page)
  };
} 