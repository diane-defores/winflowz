/**
 * Main Middleware Entry Point
 * 
 * This module composes and orchestrates all application middleware in the
 * correct execution order. Astro executes middleware for every request,
 * so routing logic here determines which middleware applies to which paths.
 * 
 * Middleware architecture:
 * - API routes: Only CORS middleware (authentication handled in route handlers)
 * - Page routes: i18n detection first, then auth guard for protected pages
 * 
 * @module middleware/index
 */

import { sequence } from 'astro:middleware';
import type { MiddlewareHandler, APIContext, MiddlewareNext } from 'astro';
import { corsMiddleware } from './cors';
import { i18nMiddleware } from './i18n';
import { authGuardMiddleware } from './authGuard';

/**
 * Main middleware handler that routes requests to appropriate middleware chains.
 * 
 * The routing logic ensures:
 * - API requests get CORS headers for cross-origin access
 * - Page requests get i18n locale detection and auth protection
 * - The sequence() helper chains multiple middleware in order
 */
const mainMiddleware: MiddlewareHandler = async (context: APIContext, next: MiddlewareNext) => {
  const url = new URL(context.request.url);
  
  // API routes need CORS but handle their own authentication
  if (url.pathname.startsWith('/api/')) {
    return corsMiddleware(context, next);
  }
  
  // Page routes: first detect locale, then check authentication
  // The sequence ensures i18n runs before authGuard so locals.lang is set
  return sequence(i18nMiddleware, authGuardMiddleware)(context, next);
};

export const onRequest = mainMiddleware; 