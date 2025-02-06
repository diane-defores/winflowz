import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

class SupabaseClientSingleton {
  private static instance: SupabaseClient<Database> | null = null;
  private static isInitializing = false;

  private constructor() {
    // Empêcher l'instanciation directe
  }

  private static createBaseClient(options: { persistSession: boolean } = { persistSession: true }): SupabaseClient<Database> {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Les variables d\'environnement Supabase sont manquantes');
    }

    return createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        storageKey: 'winflowz-auth-token',
        persistSession: options.persistSession,
        detectSessionInUrl: options.persistSession,
        autoRefreshToken: options.persistSession,
      },
    });
  }

  public static createServerClient(): SupabaseClient<Database> {
    return this.createBaseClient({ persistSession: false });
  }

  public static getInstance(): SupabaseClient<Database> {
    if (typeof window === 'undefined') {
      return this.createServerClient();
    }

    if (!this.instance && !this.isInitializing) {
      this.isInitializing = true;
      try {
        console.log("Initialisation du client Supabase");
        const client = this.createBaseClient({ persistSession: true });

        if (!client || !client.auth) {
          throw new Error('Le client Supabase n\'a pas été correctement initialisé');
        }

        this.instance = client;
        (window as any).supabase = client;
        console.log("Client Supabase créé avec succès");
      } catch (error) {
        console.error("Erreur lors de la création du client Supabase:", error);
        throw error;
      } finally {
        this.isInitializing = false;
      }
    }

    return this.instance!;
  }
}

// Export une fonction pour obtenir l'instance
export function getSupabase(): SupabaseClient<Database> {
  return SupabaseClientSingleton.getInstance();
}

// Export une fonction pour obtenir un client serveur
export function createServerSupabase(): SupabaseClient<Database> {
  return SupabaseClientSingleton.createServerClient();
}

// Export l'instance unique
export const supabase = getSupabase(); 