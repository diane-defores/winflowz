import { createClient } from '@supabase/supabase-js'
import { setMockSupabaseClient } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

export function setupSupabaseMock() {
  const mockClient = createClient<Database>(
    process.env.SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_ANON_KEY || 'test-anon-key'
  )

  // Mock des méthodes d'authentification
  mockClient.auth = {
    ...mockClient.auth,
    admin: {
      ...mockClient.auth.admin,
      listUsers: async () => ({
        data: { users: [] },
        error: null
      }),
      deleteUser: async () => ({
        data: null,
        error: null
      })
    }
  } as any

  setMockSupabaseClient(mockClient)
  return mockClient
} 