import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Fonction de validation d'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Liste des domaines de test autorisés
const TEST_DOMAINS = ['example.com', 'test.com'];

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
  const redirectUrl = `${window.location.origin}/auth/callback?lang=${locale}`;
  console.log('Tentative d\'inscription avec:', { email, locale });
  console.log('URL de redirection:', redirectUrl);

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

    // En développement, vérifier si c'est un email de test
    if (import.meta.env.DEV) {
      const domain = email.split('@')[1];
      if (!TEST_DOMAINS.includes(domain)) {
        console.warn('⚠️ En développement, utilisez des domaines de test:', TEST_DOMAINS.join(', '));
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    
    if (error) {
      // Gérer les erreurs spécifiques de Supabase
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

    // Vérifier si l'utilisateur existe déjà mais n'a pas confirmé son email
    if (data.user && !data.user.email_confirmed_at && data.user.confirmation_sent_at) {
      return {
        data: null,
        error: {
          message: 'Un email de confirmation a déjà été envoyé à cette adresse. Veuillez vérifier votre boîte de réception ou vos spams.'
        }
      };
    }
    
    console.log('Résultat de l\'inscription:', {
      success: true,
      user: data.user?.id,
      email_confirmed: data.user?.email_confirmed_at,
      confirmation_sent: data.user?.confirmation_sent_at
    });
    
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
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// Helper pour la réinitialisation du mot de passe
export async function resetPasswordForEmail(email: string, redirectUrl: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${redirectUrl}`,
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