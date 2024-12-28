import { createClient } from '@supabase/supabase-js';

// Créer le client Supabase avec les variables d'environnement
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonctions d'authentification
export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

// Fonction de validation d'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Liste des domaines de test autorisés
const TEST_DOMAINS = ['example.com', 'test.com'];

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

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function resetPasswordForEmail(email: string, redirectUrl: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${redirectUrl}`,
  });
}

export async function updateUserPassword(password: string) {
  return await supabase.auth.updateUser({ password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function getUser() {
  return await supabase.auth.getUser();
} 