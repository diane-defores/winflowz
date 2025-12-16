/**
 * Authentication Guard Middleware
 * 
 * This middleware protects authenticated routes by checking session status
 * and redirecting appropriately. It implements two key patterns:
 * 
 * 1. Protected Route Guard: Redirects unauthenticated users to login
 * 2. Authenticated Route Guard: Redirects logged-in users away from auth pages
 * 
 * This prevents authenticated users from seeing login/register pages and
 * unauthenticated users from accessing dashboard pages.
 * 
 * @module middleware/authGuard
 */

import type { MiddlewareHandler } from 'astro'
import { createServerSupabase } from '../lib/supabaseClient'

/**
 * Authentication guard middleware that controls access based on session status.
 * 
 * Route protection rules:
 * - /api/* and /auth/callback: Always allowed (needed for auth flows)
 * - /dashboard/*: Requires authentication → redirect to login if not authenticated
 * - /auth/* (except callback): Requires NOT authenticated → redirect to dashboard if logged in
 * 
 * This creates a seamless auth experience where users are always directed
 * to the appropriate page based on their session status.
 */
export const authGuardMiddleware: MiddlewareHandler = async ({ request }, next) => {
  const url = new URL(request.url)
  const isAuthPage = url.pathname.startsWith('/auth/')
  const isDashboardPage = url.pathname.startsWith('/dashboard')
  const isCallbackPage = url.pathname === '/auth/callback'
  const isApiRoute = url.pathname.startsWith('/api/')

  // Never block API routes or OAuth callback - these need to complete their flows
  if (isApiRoute || isCallbackPage) {
    return next()
  }

  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  // Dashboard access requires authentication
  if (!session && isDashboardPage) {
    return Response.redirect(`${url.origin}/auth/login`)
  }

  // Auth pages should redirect authenticated users to dashboard
  // (prevents showing login page to already-logged-in users)
  if (session && isAuthPage && !isCallbackPage) {
    return Response.redirect(`${url.origin}/dashboard`)
  }

  return next()
} 