import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/supabase'

let supabaseInstance: SupabaseClient<Database> | null = null

function createSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Les variables d\'environnement Supabase sont manquantes')
  }

  return typeof window === 'undefined'
    ? createClient<Database>(supabaseUrl, supabaseKey)
    : createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          storageKey: 'winflowz-auth-token',
          persistSession: true,
          detectSessionInUrl: true
        },
      })
}

// Export une instance unique du client Supabase
export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient()
  }
  return supabaseInstance
}

// Export le client Supabase comme une instance unique
export const supabase = getSupabase()

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
export async function signUpWithEmail(email: string, password: string, locale: string = 'en') {
  const redirectUrl = `${import.meta.env.PUBLIC_SITE_URL}/auth/callback?lang=${locale}`;

  try {
    // Validation basique de l'email
    if (!isValidEmail(email)) {
      return {
        data: null,
        error: {
          message: 'Veuillez entrer une adresse email valide.'
        }
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    
    if (error) {
      if (error.message.includes('User already registered')) {
        return {
          data: null,
          error: {
            message: 'Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.'
          }
        };
      }
      
      if (error.status === 429) {
        return {
          data: null,
          error: {
            message: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.'
          }
        };
      }
      
      return { data: null, error };
    }

    if (data.user && !data.user.email_confirmed_at && data.user.confirmation_sent_at) {
      return {
        data: null,
        error: {
          message: 'Un email de confirmation a déjà été envoyé à cette adresse. Veuillez vérifier votre boîte de réception ou vos spams.'
        }
      };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription'
      }
    };
  }
}

// Helper pour la connexion avec Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${import.meta.env.PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  return { data, error }
}

// Helper pour la réinitialisation du mot de passe
export async function resetPasswordForEmail(email: string, redirectUrl: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.PUBLIC_SITE_URL}${redirectUrl}`,
  });
}

// Helper pour la mise à jour du mot de passe
export async function updateUserPassword(password: string) {
  return await supabase.auth.updateUser({ password });
}

// Helper pour obtenir la session
export async function getSession() {
  return await supabase.auth.getSession();
}

// Fonction de validation d'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
} 