import { vi, beforeAll, afterAll, afterEach } from 'vitest'
import { preview } from 'vite'
import type { PreviewServer } from 'vite'
import { setMockSupabaseClient } from '@/lib/supabaseClient'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Configuration globale
declare global {
  var BASE_URL: string
}
global.BASE_URL = 'http://localhost:4321'

let viteServer: PreviewServer

const mockUser = {
  id: '123',
  email: 'test@example.com',
  role: 'authenticated',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  user: mockUser,
}

const mockClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
    signInWithPassword: vi.fn().mockImplementation(({ email, password }) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({ data: { session: mockSession }, error: null })
      }
      return Promise.resolve({ 
        data: null, 
        error: { 
          message: 'Invalid credentials', 
          status: 401,
          name: 'AuthError'
        } 
      })
    }),
    signUp: vi.fn().mockImplementation(({ email }) => {
      if (email === 'existing@example.com') {
        return Promise.resolve({ 
          data: null, 
          error: { 
            message: 'User already registered', 
            status: 400,
            name: 'AuthError'
          } 
        })
      }
      return Promise.resolve({ 
        data: { 
          user: mockUser, 
          session: mockSession 
        }, 
        error: null 
      })
    }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
    admin: {
      listUsers: vi.fn().mockResolvedValue({ data: { users: [mockUser] }, error: null }),
      deleteUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  },
  // Ajout des propriétés requises par SupabaseClient
  supabaseUrl: 'http://localhost:54321',
  supabaseKey: 'test-key',
  realtime: { connect: vi.fn(), disconnect: vi.fn() },
  realtimeUrl: 'ws://localhost:54321',
  rest: { baseUrl: 'http://localhost:54321' },
  headers: {},
  from: vi.fn(),
  schema: vi.fn(),
  rpc: vi.fn(),
  channel: vi.fn(),
  getChannels: vi.fn(),
  removeChannel: vi.fn(),
  removeAllChannels: vi.fn(),
  queryBuilder: vi.fn(),
  storage: { from: vi.fn() },
  functions: { invoke: vi.fn() }
} as unknown as SupabaseClient<Database>

export async function startTestServer() {
  console.log('Configuration du mock client Supabase')
  setMockSupabaseClient(mockClient)
  
  viteServer = await preview()
  return viteServer
}

export async function stopTestServer() {
  if (viteServer) {
    await viteServer.httpServer.close()
  }
}

beforeAll(async () => {
  await startTestServer()
})

afterAll(async () => {
  await stopTestServer()
})

afterEach(() => {
  vi.clearAllMocks()
}) 