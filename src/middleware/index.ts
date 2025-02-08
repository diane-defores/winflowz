import { sequence } from 'astro:middleware';
import type { MiddlewareHandler } from 'astro';
import { corsMiddleware } from './cors';
import { i18nMiddleware } from './i18n';
import { authGuardMiddleware } from './authGuard';

// Séquence des middlewares dans l'ordre d'exécution
const mainMiddleware: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  
  // Appliquer CORS uniquement pour les routes API
  if (url.pathname.startsWith('/api/')) {
    return corsMiddleware(context, next);
  }
  
  // Pour les autres routes, appliquer i18n et authGuard dans l'ordre
  return sequence(i18nMiddleware, authGuardMiddleware)(context, next);
};

export const onRequest = mainMiddleware; 