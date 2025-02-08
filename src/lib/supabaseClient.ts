import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

/**
 * Singleton pour gérer l'instance du client Supabase
 * Assure qu'une seule instance est créée et réutilisée
 */
export class SupabaseClientSingleton {
  private static instance: SupabaseClient<Database> | null = null;
  private static isInitializing = false;
  private static mockClient: SupabaseClient<Database> | null = null;

  private constructor() {
    // Empêcher l'instanciation directe
  }

  /**
   * Vérifie si nous sommes en mode test
   */
  private static isTestMode(): boolean {
    return process.env.NODE_ENV === 'test' || import.meta.env.MODE === 'test';
  }

  /**
   * Crée un client Supabase avec les options spécifiées
   */
  private static createBaseClient(options: { 
    persistSession: boolean,
    detectSessionInUrl?: boolean,
    autoRefreshToken?: boolean
  } = { 
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true
  }): SupabaseClient<Database> {
    // Si nous sommes en mode test et qu'un mock client existe, retourner le mock
    if (this.isTestMode() && this.mockClient) {
      console.log("Utilisation du mock client Supabase");
      return this.mockClient;
    }

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Les variables d\'environnement Supabase sont manquantes');
    }

    return createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        storageKey: 'sb-auth-token',
        autoRefreshToken: options.autoRefreshToken,
        persistSession: options.persistSession,
        detectSessionInUrl: options.detectSessionInUrl,
        flowType: "pkce",
        storage: {
          getItem: (key) => {
            if (typeof window === 'undefined') return null
            return window.localStorage.getItem(key)
          },
          setItem: (key, value) => {
            if (typeof window === 'undefined') return
            window.localStorage.setItem(key, value)
          },
          removeItem: (key) => {
            if (typeof window === 'undefined') return
            window.localStorage.removeItem(key)
          },
        }
      },
    });
  }

  /**
   * Crée un client pour une utilisation côté serveur
   * Sans persistance de session
   */
  public static createServerClient(): SupabaseClient<Database> {
    // Si nous sommes en mode test et qu'un mock client existe, retourner le mock
    if (this.isTestMode() && this.mockClient) {
      console.log("Utilisation du mock client Supabase (server)");
      return this.mockClient;
    }

    return this.createBaseClient({ 
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false
    });
  }

  /**
   * Obtient l'instance unique du client Supabase
   * Crée une nouvelle instance si nécessaire
   */
  public static getInstance(): SupabaseClient<Database> {
    // Si nous sommes en mode test et qu'un mock client existe, retourner le mock
    if (this.isTestMode() && this.mockClient) {
      console.log("Utilisation du mock client Supabase (instance)");
      return this.mockClient;
    }

    if (typeof window === 'undefined') {
      return this.createServerClient();
    }

    if (!this.instance && !this.isInitializing) {
      this.isInitializing = true;
      try {
        console.log("Initialisation du client Supabase");
        const client = this.createBaseClient({
          persistSession: true,
          detectSessionInUrl: true,
          autoRefreshToken: true
        });

        if (!client || !client.auth) {
          throw new Error('Le client Supabase n\'a pas été correctement initialisé');
        }

        this.instance = client;
        
        // Expose le client dans window pour le debugging en développement
        if (import.meta.env.DEV) {
          (window as any).supabase = client;
        }
        
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

  /**
   * Réinitialise l'instance du client
   * Utile pour les tests ou lors du changement d'environnement
   */
  public static resetInstance(): void {
    this.instance = null;
    this.isInitializing = false;
    this.mockClient = null;
  }

  /**
   * Définit un mock client pour les tests
   */
  public static setMockClient(client: SupabaseClient<Database>): void {
    console.log("Configuration du mock client Supabase");
    this.mockClient = client;
  }
}

/**
 * Obtient l'instance du client Supabase
 * @returns SupabaseClient<Database>
 */
export function getSupabase(): SupabaseClient<Database> {
  return SupabaseClientSingleton.getInstance();
}

/**
 * Crée un client Supabase pour une utilisation côté serveur
 * @returns SupabaseClient<Database>
 */
export function createServerSupabase(): SupabaseClient<Database> {
  return SupabaseClientSingleton.createServerClient();
}

/**
 * Instance unique du client Supabase
 * À utiliser uniquement côté client
 */
export const supabase = getSupabase();

/**
 * Définit un mock client pour les tests
 */
export function setMockSupabaseClient(client: SupabaseClient<Database>): void {
  SupabaseClientSingleton.setMockClient(client);
} 