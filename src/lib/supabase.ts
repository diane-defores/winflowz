import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper pour vérifier si l'utilisateur est connecté
export async function isUserLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Helper pour obtenir l'utilisateur courant
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper pour la déconnexion
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Helper pour la connexion avec email/password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Helper pour la création de compte
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// Helper pour la connexion avec Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
} 