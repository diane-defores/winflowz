import { isUserLoggedIn } from '../lib/supabase'
import type { MiddlewareHandler } from 'astro'

export const authMiddleware: MiddlewareHandler = async ({ request }, next) => {
  const url = new URL(request.url)
  const isAuthPage = url.pathname.startsWith('/auth/')
  const isDashboardPage = url.pathname.startsWith('/dashboard')
  const isCallbackPage = url.pathname === '/auth/callback'

  // Ne pas bloquer la page de callback
  if (isCallbackPage) {
    return next()
  }

  const isLoggedIn = await isUserLoggedIn()

  // Rediriger vers le login si l'utilisateur n'est pas connecté et essaie d'accéder au dashboard
  if (!isLoggedIn && isDashboardPage) {
    return Response.redirect(`${url.origin}/auth/login`)
  }

  // Rediriger vers le dashboard si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (isLoggedIn && isAuthPage && !isCallbackPage) {
    return Response.redirect(`${url.origin}/dashboard`)
  }

  return next()
} 