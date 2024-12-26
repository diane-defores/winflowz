import { createClient } from '@supabase/supabase-js';

// Créer le client Supabase avec les variables d'environnement
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonctions d'authentification
export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, locale: string = 'en') {
  const redirectUrl = `${window.location.origin}/auth/callback?lang=${locale}`;
  console.log('Tentative d\'inscription avec:', { email, locale });
  console.log('URL de redirection:', redirectUrl);
  
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });
  
  console.log('Résultat de l\'inscription:', {
    success: !result.error,
    error: result.error?.message,
    user: result.data?.user?.id
  });
  
  return result;
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