import { defineMiddleware } from "astro:middleware";

const routeMappings = {
  'terms': 'cgu',
  'disclaimer': 'non-responsabilite',
  'privacy': 'confidentialite',
  'copyright': 'droits',
  'legal': 'mentions-legales',
  'products': 'produits',
  'services': 'services',
  'about': 'a-propos',
  'contact': 'contact',
  'blog': 'blog',
  'support': 'support',
  'pricing': 'tarifs',
  'partners': 'partenaires',
  'news': 'actualites',
  'events': 'evenements',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, locals } = context;
  const pathname = url.pathname;
  const lang = pathname.startsWith('/fr/') ? 'fr' : 'en';
  
  // Stocke la langue dans locals pour l'utiliser dans les composants
  locals.lang = lang;

  // Gestion des redirections
  if (lang === 'fr') {
    // Si on est sur une URL en anglais mais qu'on veut du français
    for (const [en, fr] of Object.entries(routeMappings)) {
      if (pathname === `/${en}`) {
        return context.redirect(`/fr/${fr}`);
      }
    }
  } else {
    // Si on est sur une URL en français mais qu'on veut de l'anglais
    for (const [en, fr] of Object.entries(routeMappings)) {
      if (pathname === `/fr/${fr}`) {
        return context.redirect(`/${en}`);
      }
    }
  }

  return next();
}); 