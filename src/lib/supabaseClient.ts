import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

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