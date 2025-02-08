import type { MiddlewareHandler } from 'astro'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:4321',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true',
}

export const corsMiddleware: MiddlewareHandler = async (context, next) => {
  // Gérer les requêtes OPTIONS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  // Obtenir la réponse du prochain middleware
  const response = await next()

  // Ajouter les en-têtes CORS à la réponse
  const responseHeaders = new Headers(response.headers)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    responseHeaders.set(key, value)
  })

  // Cloner la réponse avec les nouveaux en-têtes
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  })
}