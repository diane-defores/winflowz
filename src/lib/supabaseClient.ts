/**
 * Supabase Client Module
 * 
 * This module provides a centralized way to create and manage Supabase clients
 * throughout the application. It implements the Singleton pattern for browser
 * contexts and supports both client-side and server-side rendering (SSR).
 * 
 * Key features:
 * - Singleton pattern prevents multiple client instances in the browser
 * - Separate server-side client creation for SSR/API routes
 * - PKCE (Proof Key for Code Exchange) flow for enhanced OAuth security
 * - Test mode support with mock client injection
 * - Cookie-based session management for SSR
 * 
 * @module supabaseClient
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'
import type { AstroCookies } from 'astro'

/**
 * Validates and returns the Supabase URL from environment variables.
 * 
 * Fallback chain: SUPABASE_URL -> PUBLIC_SUPABASE_URL
 * The PUBLIC_ prefix variant is needed during Vercel build time when
 * private env vars may not be available.
 * 
 * @throws {Error} If no valid URL is found or URL format is invalid
 * @returns {string} Validated Supabase project URL
 */
function validateSupabaseUrl(): string {
  // During build time, SUPABASE_URL may not be set, so we fallback to PUBLIC_SUPABASE_URL
  // which is exposed by Vercel during the build process
  const url = import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
  
  if (!url) {
    throw new Error('La variable d\'environnement SUPABASE_URL est manquante');
  }
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.error('Erreur de validation URL:', error);
    throw new Error(`L'URL Supabase n'est pas valide: ${url}`);
  }
}

/**
 * Validates and returns the Supabase anonymous key from environment variables.
 * 
 * Fallback chain: SUPABASE_PUBLISHABLE_KEY -> PUBLIC_SUPABASE_PUBLISHABLE_KEY -> PUBLIC_SUPABASE_ANON_KEY
 * 
 * The key is validated by checking:
 * - It starts with 'eyJ' (base64 encoded JWT header)
 * - Minimum length of 20 characters
 * 
 * @throws {Error} If no valid key is found or key format is invalid
 * @returns {string} Validated Supabase anonymous key (JWT format)
 */
function validateSupabaseKey(): string {
  // During build time, SUPABASE_PUBLISHABLE_KEY may not be set, so we fallback to PUBLIC_ variants
  // which are exposed by Vercel during the build process
  const key = import.meta.env.SUPABASE_PUBLISHABLE_KEY || 
              import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
              import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  
  if (!key) {
    throw new Error('La variable d\'environnement SUPABASE_PUBLISHABLE_KEY est manquante');
  }
  // JWT tokens start with 'eyJ' which is base64 for '{"' (JSON object start)
  if (!key.startsWith('eyJ') || key.length < 20) {
    throw new Error('La clé Supabase n\'est pas valide');
  }
  return key;
}

/**
 * Singleton class for managing the Supabase client instance.
 * 
 * Why Singleton? In browser environments, creating multiple Supabase clients
 * can cause issues with:
 * - Session state synchronization (each client has its own auth listener)
 * - Memory leaks from duplicate event subscriptions
 * - Race conditions during authentication flows
 * 
 * This singleton ensures one client instance is shared across the entire
 * browser application while providing separate server-side clients for
 * each SSR request (important for request isolation).
 * 
 * The class also supports test mode with mock client injection to enable
 * unit testing without actual Supabase connections.
 */
export class SupabaseClientSingleton {
  private static instance: SupabaseClient<Database> | null = null;
  private static isInitializing = false;  // Prevents race conditions during initialization
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
   * Creates a Supabase client with specified authentication options.
   * 
   * This internal method handles the actual client creation with PKCE flow
   * for enhanced security during OAuth authentication. The PKCE flow prevents
   * authorization code interception attacks.
   * 
   * Custom storage implementation ensures localStorage is only accessed in
   * browser environments, avoiding SSR errors.
   * 
   * @param options - Configuration for session handling
   * @returns Configured Supabase client instance
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
    // If we're in test mode and a mock client exists, return the mock
    if (this.isTestMode() && this.mockClient) {
      console.log("Utilisation du mock client Supabase");
      return this.mockClient;
    }

    const supabaseUrl = validateSupabaseUrl();
    const supabaseKey = validateSupabaseKey();

    return createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        storageKey: 'sb-auth-token',
        autoRefreshToken: options.autoRefreshToken,
        persistSession: options.persistSession,
        detectSessionInUrl: options.detectSessionInUrl,
        flowType: "pkce",  // PKCE provides protection against authorization code interception
        // Custom storage adapter that gracefully handles SSR (no window object)
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
   * Creates a Supabase client optimized for server-side usage (SSR/API routes).
   * 
   * Server clients differ from browser clients in key ways:
   * - No session persistence (each request is independent)
   * - No URL session detection (prevents SSR hydration mismatches)
   * - No automatic token refresh (handled per-request)
   * - No-op storage adapter (sessions aren't persisted server-side)
   * 
   * This ensures proper request isolation in server environments where
   * multiple users' requests are handled by the same process.
   * 
   * @returns Supabase client configured for server-side usage
   */
  public static createServerClient(): SupabaseClient<Database> {
    // If we're in test mode and a mock client exists, return the mock
    if (this.isTestMode() && this.mockClient) {
      console.log("Utilisation du mock client Supabase (server)");
      return this.mockClient;
    }

    const supabaseUrl = validateSupabaseUrl();
    const supabaseKey = validateSupabaseKey();

    return createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
        flowType: "pkce",
        // No-op storage for server-side (no localStorage available)
        storage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      }
    });
  }

  /**
   * Gets or creates the singleton Supabase client instance.
   * 
   * Behavior differs by environment:
   * - Server-side: Always creates a new server client (no persistence needed)
   * - Browser: Returns cached instance or creates new one if needed
   * 
   * The isInitializing flag prevents race conditions when multiple components
   * try to access the client simultaneously during initial page load.
   * 
   * @returns The shared Supabase client instance
   */
  public static getInstance(): SupabaseClient<Database> {
    // If we're in test mode and a mock client exists, return the mock
    if (this.isTestMode() && this.mockClient) {
      console.log("Utilisation du mock client Supabase (instance)");
      return this.mockClient;
    }

    // Server-side: Create fresh client for each request (no singleton needed)
    if (typeof window === 'undefined') {
      return this.createServerClient();
    }

    // Browser: Use singleton pattern with race condition protection
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
        
        // Expose client on window for debugging in development mode only
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
   * Resets the singleton instance and clears all state.
   * 
   * Use cases:
   * - Test teardown (reset between test cases)
   * - Environment changes (switching Supabase projects)
   * - Clearing corrupted client state
   * 
   * Warning: In production browser usage, calling this may cause
   * authentication state issues. Use with caution.
   */
  public static resetInstance(): void {
    this.instance = null;
    this.isInitializing = false;
    this.mockClient = null;
  }

  /**
   * Injects a mock Supabase client for testing purposes.
   * 
   * When set, all client creation methods will return this mock instead
   * of creating real Supabase clients. This enables unit testing without
   * network dependencies.
   * 
   * @param client - The mock client to use for all Supabase operations
   */
  public static setMockClient(client: SupabaseClient<Database>): void {
    console.log("Configuration du mock client Supabase");
    this.mockClient = client;
  }
}

/**
 * Convenience function to get the Supabase client instance.
 * 
 * Automatically selects the appropriate client type based on environment:
 * - Browser: Returns singleton instance with session persistence
 * - Server: Returns new client for request isolation
 * 
 * @returns Supabase client appropriate for the current environment
 */
export function getSupabase(): SupabaseClient<Database> {
  return SupabaseClientSingleton.getInstance();
}

/**
 * Creates a Supabase client specifically for server-side usage.
 * 
 * Use this in API routes and server-side rendering contexts where
 * session persistence is not needed and request isolation is important.
 * 
 * @returns New Supabase client configured for server usage
 */
export function createServerSupabase(): SupabaseClient<Database> {
  return SupabaseClientSingleton.createServerClient();
}

/**
 * Lazily-initialized Supabase client instance.
 * 
 * Defers initialization until first access, which prevents build-time
 * errors when environment variables are not yet available.
 * 
 * Use only in client-side code. For server-side, use createServerSupabase().
 */
let _supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabaseInstance(): SupabaseClient<Database> {
  if (!_supabaseInstance) {
    _supabaseInstance = getSupabase();
  }
  return _supabaseInstance;
}

/**
 * Proxy-wrapped Supabase client for backwards compatibility.
 * 
 * Uses a Proxy to intercept property access and forward to the singleton,
 * allowing lazy initialization without changing the import syntax for
 * existing code that uses `import { supabase } from './supabaseClient'`.
 * 
 * Performance note: Proxy overhead is negligible compared to network
 * operations. For new code, prefer getSupabaseInstance() for clarity.
 * 
 * Use only in client-side code. For server-side, use createServerSupabase().
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return Reflect.get(getSupabaseInstance(), prop);
  }
});

/**
 * Injects a mock Supabase client for testing.
 * 
 * @param client - The mock client to use in place of real Supabase clients
 */
export function setMockSupabaseClient(client: SupabaseClient<Database>): void {
  SupabaseClientSingleton.setMockClient(client);
}

/**
 * Creates a Supabase client with Astro cookie-based session management.
 * 
 * This variant is designed for SSR contexts where sessions need to persist
 * across page loads via HTTP-only cookies. Unlike the basic server client,
 * this client can maintain user sessions between requests.
 * 
 * Cookie configuration:
 * - httpOnly: true - Prevents XSS attacks from accessing session tokens
 * - secure: true (production only) - Ensures cookies only sent over HTTPS
 * - sameSite: 'lax' - Provides CSRF protection while allowing navigation
 * - maxAge: 7 days - Balances security with user convenience
 * 
 * @param cookies - Astro's cookie API for reading/writing HTTP cookies
 * @returns Supabase client with cookie-based session persistence
 */
export function createServerSupabaseClient(cookies: AstroCookies): SupabaseClient<Database> {
  const supabaseUrl = validateSupabaseUrl();
  const supabaseKey = validateSupabaseKey();

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
      autoRefreshToken: true,
      flowType: "pkce",
      // Custom storage adapter that maps to HTTP cookies
      storage: {
        getItem: (key: string) => {
          const cookie = cookies.get(key);
          if (cookie) {
            return cookie.value;
          }
          return null;
        },
        setItem: (key: string, value: string) => {
          cookies.set(key, value, {
            path: '/',
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
          });
        },
        removeItem: (key: string) => {
          cookies.delete(key, {
            path: '/'
          });
        }
      }
    }
  });
} 