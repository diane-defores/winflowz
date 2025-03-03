import type { MiddlewareHandler } from 'astro'
import { createServerSupabase } from '../lib/supabaseClient'
import type { APIContext, MiddlewareNext } from 'astro'

export const onRequest: MiddlewareHandler = async (context: APIContext, next: MiddlewareNext) => {
  const { request } = context
  const supabase = createServerSupabase()

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = request.url.includes('/dashboard') || 
                          request.url.includes('/account') ||
                          request.url.includes('/api/protected')

  if (!isProtectedRoute) {
    return next()
  }

  try {
    // Récupérer la session depuis les cookies
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      // Si c'est une route API, renvoyer une erreur JSON
      if (request.url.includes('/api/')) {
        return new Response(
          JSON.stringify({
            error: 'unauthorized',
            message: 'Vous devez être connecté pour accéder à cette ressource'
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }

      // Sinon, rediriger vers la page de connexion
      return Response.redirect(new URL('/signin', request.url), 302)
    }

    // Ajouter les informations de session au contexte
    context.locals.session = session
    context.locals.user = session.user

    return next()
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error)
    
    return new Response(
      JSON.stringify({
        error: 'auth-error',
        message: 'Une erreur est survenue lors de la vérification de l\'authentification'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 