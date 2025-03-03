import type { MiddlewareHandler } from 'astro'
import type { APIContext, MiddlewareNext } from 'astro'
import { createServerSupabase } from '../lib/supabaseClient'

// Utiliser Redis ou une autre solution de cache en production
const attempts = new Map<string, { count: number; timestamp: number }>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5 // 5 tentatives par fenêtre

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0] : 'unknown'
}

function cleanupOldAttempts() {
  const now = Date.now()
  for (const [key, data] of attempts.entries()) {
    if (now - data.timestamp > WINDOW_MS) {
      attempts.delete(key)
    }
  }
}

export const onRequest: MiddlewareHandler = async (context: APIContext, next: MiddlewareNext) => {
  const { request } = context

  // Ne pas appliquer le rate limiting sur les routes non-auth
  const isAuthRoute = request.url.includes('/api/auth/')
  if (!isAuthRoute) {
    return next()
  }

  const clientIp = getClientIp(request)
  const now = Date.now()

  // Nettoyer les anciennes tentatives
  cleanupOldAttempts()

  // Récupérer ou initialiser les tentatives pour cette IP
  const attempt = attempts.get(clientIp) || { count: 0, timestamp: now }

  // Réinitialiser le compteur si la fenêtre est expirée
  if (now - attempt.timestamp > WINDOW_MS) {
    attempt.count = 0
    attempt.timestamp = now
  }

  // Vérifier si le nombre maximum de tentatives est atteint
  if (attempt.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((WINDOW_MS - (now - attempt.timestamp)) / 1000 / 60)
    
    return new Response(
      JSON.stringify({
        error: 'too-many-requests',
        message: `Trop de tentatives. Réessayez dans ${timeLeft} minutes.`
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(timeLeft * 60)
        }
      }
    )
  }

  // Incrémenter le compteur
  attempt.count++
  attempts.set(clientIp, attempt)

  // Ajouter les en-têtes de rate limit
  const response = await next()
  const headers = new Headers(response.headers)
  headers.set('X-RateLimit-Limit', String(MAX_ATTEMPTS))
  headers.set('X-RateLimit-Remaining', String(MAX_ATTEMPTS - attempt.count))
  headers.set('X-RateLimit-Reset', String(Math.ceil((attempt.timestamp + WINDOW_MS) / 1000)))

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
} 