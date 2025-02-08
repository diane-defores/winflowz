import { getSupabase, createServerSupabase } from './supabaseClient'

/**
 * Helper pour vérifier si l'utilisateur est connecté
 * @returns boolean indiquant si l'utilisateur est connecté
 */
export async function isUserLoggedIn() {
  const supabase = typeof window !== 'undefined' ? getSupabase() : createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

/**
 * Helper pour obtenir l'utilisateur courant
 * @returns L'utilisateur courant ou null
 */
export async function getCurrentUser() {
  const supabase = typeof window !== 'undefined' ? getSupabase() : createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Helper pour la déconnexion
 */
export async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut()
  // Supabase nettoie automatiquement les cookies
  return { error }
}

/**
 * Helper pour la connexion avec email/password
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
 * Helper pour la création de compte
 * Inclut la validation d'email et la gestion des erreurs
 */
export async function signUpWithEmail(email: string, password: string, locale: string = 'en') {
  const supabase = getSupabase();
  const redirectUrl = `${import.meta.env.PUBLIC_SITE_URL}/auth/callback?lang=${locale}`

  try {
    // Validation basique de l'email
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
      if (error.message.includes('User already registered')) {
        return {
          data: null,
          error: {
            message: 'Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.'
          }
        }
      }
      
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
 * Helper pour la connexion avec Google
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
 * Helper pour la réinitialisation du mot de passe
 */
export async function resetPasswordForEmail(email: string, redirectUrl: string) {
  const supabase = getSupabase();
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.PUBLIC_SITE_URL}${redirectUrl}`,
  })
}

/**
 * Helper pour la mise à jour du mot de passe
 */
export async function updateUserPassword(password: string) {
  const supabase = getSupabase();
  return await supabase.auth.updateUser({ password })
}

/**
 * Helper pour obtenir la session
 */
export async function getSession() {
  const supabase = typeof window !== 'undefined' ? getSupabase() : createServerSupabase();
  return await supabase.auth.getSession()
}

/**
 * Fonction de validation d'email
 * @param email L'email à valider
 * @returns boolean indiquant si l'email est valide
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
} 