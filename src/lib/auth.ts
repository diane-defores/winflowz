/**
 * Authentication Helpers Module
 * 
 * This module provides a unified interface for common authentication operations,
 * abstracting the complexity of working with Supabase Auth in both client and
 * server contexts. All functions automatically select the appropriate Supabase
 * client based on the execution environment.
 * 
 * Key features:
 * - Environment-aware client selection (browser vs server)
 * - Comprehensive error handling with user-friendly messages
 * - Email validation and rate limit handling
 * - OAuth integration support
 * 
 * @module auth
 */

import { getSupabase, createServerSupabase } from './supabaseClient'

/**
 * Checks if a user is currently authenticated.
 * 
 * Uses environment-appropriate Supabase client to verify session existence.
 * Note: This checks for a valid session, not just a token. The session may
 * have been invalidated server-side even if tokens exist locally.
 * 
 * @returns Promise<boolean> - true if user has an active session
 */
export async function isUserLoggedIn() {
  const supabase = typeof window !== 'undefined' ? getSupabase() : createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

/**
 * Retrieves the currently authenticated user's data.
 * 
 * Unlike getSession(), this makes a network request to verify the user
 * exists and the token is valid. Use this when you need fresh user data
 * or need to verify authentication server-side.
 * 
 * @returns Promise<User | null> - Current user object or null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = typeof window !== 'undefined' ? getSupabase() : createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Signs out the current user and clears their session.
 * 
 * Supabase automatically handles cookie/localStorage cleanup based on
 * the client configuration. After signOut, all auth tokens are invalidated.
 * 
 * @returns Promise<{ error: AuthError | null }> - Error if signout failed
 */
export async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut()
  // Supabase automatically cleans up cookies
  return { error }
}

/**
 * Authenticates a user with email and password.
 * 
 * Uses Supabase's signInWithPassword which verifies credentials and
 * returns session tokens. The session is automatically persisted based
 * on client configuration.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with session data on success, or error on failure
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

/**
 * Registers a new user account with email verification.
 * 
 * This function implements a comprehensive registration flow with:
 * - Client-side email format validation (before API call)
 * - Duplicate email detection with user-friendly messaging
 * - Rate limit handling (HTTP 429 responses)
 * - Detection of already-sent confirmation emails
 * 
 * The registration triggers an email confirmation flow. Users must verify
 * their email before they can sign in. The redirect URL includes the
 * locale for proper i18n handling in the confirmation callback.
 * 
 * @param email - User's email address
 * @param password - User's chosen password
 * @param locale - Current locale for redirect URL (default: 'en')
 * @returns Promise with user data on success, or error message on failure
 */
export async function signUpWithEmail(email: string, password: string, locale: string = 'en') {
  const supabase = getSupabase();
  // Include locale in redirect URL for proper i18n handling after email confirmation
  const redirectUrl = `${import.meta.env.PUBLIC_SITE_URL}/auth/callback?lang=${locale}`

  try {
    // Validate email format before making API call to provide immediate feedback
    if (!isValidEmail(email)) {
      return {
        data: null,
        error: {
          message: 'Veuillez entrer une adresse email valide.'
        }
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    
    if (error) {
      // Translate common errors to user-friendly messages in French
      if (error.message.includes('User already registered')) {
        return {
          data: null,
          error: {
            message: 'Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.'
          }
        }
      }
      
      // Handle rate limiting from Supabase
      if (error.status === 429) {
        return {
          data: null,
          error: {
            message: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.'
          }
        }
      }
      
      return { data: null, error }
    }

    // Detect if a confirmation email was already sent (user re-registering)
    // This happens when user exists but hasn't confirmed their email yet
    if (data.user && !data.user.email_confirmed_at && data.user.confirmation_sent_at) {
      return {
        data: null,
        error: {
          message: 'Un email de confirmation a déjà été envoyé à cette adresse. Veuillez vérifier votre boîte de réception ou vos spams.'
        }
      }
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription'
      }
    }
  }
}

/**
 * Initiates OAuth authentication with Google.
 * 
 * This redirects the user to Google's OAuth consent screen. After
 * successful authentication, Google redirects back to the callback URL
 * where the auth code is exchanged for session tokens via PKCE flow.
 * 
 * @returns Promise with OAuth redirect data or error
 */
export async function signInWithGoogle() {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${import.meta.env.PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  return { data, error }
}

/**
 * Sends a password reset email to the specified address.
 * 
 * The reset link in the email redirects to the provided URL where
 * the user can set a new password. The link includes a one-time
 * token that expires after a short period.
 * 
 * @param email - Email address to send reset link to
 * @param redirectUrl - Path to redirect after clicking reset link
 * @returns Promise with success status or error
 */
export async function resetPasswordForEmail(email: string, redirectUrl: string) {
  const supabase = getSupabase();
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.PUBLIC_SITE_URL}${redirectUrl}`,
  })
}

/**
 * Updates the current user's password.
 * 
 * Requires an active session (user must be logged in or have a valid
 * reset token). The old password is not required when using a reset token.
 * 
 * @param password - The new password to set
 * @returns Promise with updated user data or error
 */
export async function updateUserPassword(password: string) {
  const supabase = getSupabase();
  return await supabase.auth.updateUser({ password })
}

/**
 * Retrieves the current authentication session.
 * 
 * Returns the cached session if available. Unlike getUser(), this does
 * not make a network request to verify the session. Use for quick
 * session checks where fresh data is not critical.
 * 
 * @returns Promise with session data (may be null if not authenticated)
 */
export async function getSession() {
  const supabase = typeof window !== 'undefined' ? getSupabase() : createServerSupabase();
  return await supabase.auth.getSession()
}

/**
 * Validates email format using a simple regex pattern.
 * 
 * Pattern checks for: local-part@domain.tld
 * - No spaces allowed anywhere
 * - At least one character before and after @
 * - At least one dot after @ with characters on both sides
 * 
 * Note: This is basic validation. Full RFC 5322 compliance is more complex
 * and typically left to email verification.
 * 
 * @param email - Email address to validate
 * @returns boolean - true if email format is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
} 