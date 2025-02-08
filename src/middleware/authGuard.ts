import type { MiddlewareHandler } from 'astro'
import { createServerSupabase } from '../lib/supabaseClient'

export const authGuardMiddleware: MiddlewareHandler = async ({ request }, next) => {
  const url = new URL(request.url)
  const isAuthPage = url.pathname.startsWith('/auth/')
  const isDashboardPage = url.pathname.startsWith('/dashboard')
  const isCallbackPage = url.pathname === '/auth/callback'
  const isApiRoute = url.pathname.startsWith('/api/')

  // Ne pas bloquer les routes API et la page de callback OAuth
  if (isApiRoute || isCallbackPage) {
    return next()
  }

  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  // Protection des routes du dashboard - Redirection vers login si non connecté
  if (!session && isDashboardPage) {
    return Response.redirect(`${url.origin}/auth/login`)
  }

  // Protection des routes d'auth - Redirection vers dashboard si déjà connecté
  if (session && isAuthPage && !isCallbackPage) {
    return Response.redirect(`${url.origin}/dashboard`)
  }

  return next()
} 