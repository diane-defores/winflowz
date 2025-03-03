import type { Language, Translation, MetaTranslations } from '@/types/i18n';

// Fonction pour obtenir la langue depuis l'URL
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  return lang === 'fr' ? 'fr' : 'en';
}

// Fonction pour charger les traductions UI communes
export async function useUI(lang: Language): Promise<Translation> {
  const translations = await import(`../i18n/${lang}/ui.json`);
  return translations.default;
}

// Fonction pour charger les traductions spécifiques
export async function useTranslations(lang: Language, page: string): Promise<Translation> {
  try {
    const translations = await import(`../i18n/${lang}/${page}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Erreur lors du chargement des traductions pour ${lang}/${page}:`, error);
    return {} as Translation;
  }
}

// Fonction pour charger les routes traduites
export async function useRoutes(lang: Language): Promise<Record<string, string>> {
  const routes = await import(`../i18n/${lang}/routes.json`);
  return routes.default;
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
export async function getAlternateLinks(currentPath: string): Promise<Array<{href: string, hreflang: string}>> {
  const enPath = await getLocalizedPath('en', currentPath);
  const frPath = await getLocalizedPath('fr', currentPath);

  return [
    { href: `https://winflowz.com${enPath}`, hreflang: 'en' },
    { href: `https://winflowz.com${frPath}`, hreflang: 'fr' }
  ];
}

// Fonction pour obtenir les métadonnées d'une page
export async function getPageMeta(lang: Language, page: string): Promise<Translation & { alternateLinks: Array<{href: string, hreflang: string}> }> {
  const meta = await useTranslations(lang, 'meta');
  return {
    ...meta,
    alternateLinks: await getAlternateLinks(page)
  };
}

// Fonction pour obtenir la langue courante
export function getCurrentLocale(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  return lang === "fr" ? "fr" : "en";
} 