import { describe, expect, it, vi } from 'vitest'
import { isUserLoggedIn, signInWithEmail, signUpWithEmail } from '@/lib/auth'
import { getSupabase, createServerSupabase } from '@/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

const mockUser: User = {
  id: '123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString()
}

const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser
}

class MockAuthError extends Error {
  status: number
  code: string
  __isAuthError: true = true

  constructor(message: string, code: string = 'invalid_credentials', status: number = 400) {
    super(message)
    this.name = 'AuthError'
    this.status = status
    this.code = code
  }
}

const mockSupabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    })
  }
}

vi.mock('@/lib/supabaseClient', () => ({
  getSupabase: vi.fn(() => mockSupabaseClient),
  createServerSupabase: vi.fn(() => mockSupabaseClient)
}))

describe('Auth Functions', () => {
  describe('isUserLoggedIn', () => {
    it('devrait retourner true si une session existe', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: '123' } } },
        error: null
      })

      const result = await isUserLoggedIn()
      expect(result).toBe(true)
    })

    it('devrait retourner false si aucune session n\'existe', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValueOnce({
        data: { session: null },
        error: null
      })

      const result = await isUserLoggedIn()
      expect(result).toBe(false)
    })
  })

  describe('signInWithEmail', () => {
    it('devrait réussir avec des identifiants valides', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: { id: '123' }, session: { user: { id: '123' } } },
        error: null
      })

      const result = await signInWithEmail('test@example.com', 'password123')
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('devrait échouer avec des identifiants invalides', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      })

      const result = await signInWithEmail('test@example.com', 'wrongpassword')
      expect(result.error).toBeDefined()
      if (result.error) {
        expect(result.error.message).toBe('Invalid credentials')
      }
    })
  })

  describe('signUpWithEmail', () => {
    it('devrait réussir avec un nouvel email', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
        data: { user: { id: '123', email: 'test@example.com' }, session: null },
        error: null
      })

      const result = await signUpWithEmail('test@example.com', 'password123')
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('devrait échouer avec un email déjà utilisé', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: new MockAuthError('User already registered')
      })

      const result = await signUpWithEmail('existing@example.com', 'password123')
      expect(result.error).toBeDefined()
      if (result.error) {
        expect(result.error.message).toBe('Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.')
      }
    })

    it('devrait valider le format de l\'email', async () => {
      const result = await signUpWithEmail('invalid-email', 'password123')
      expect(result.error).toBeDefined()
      if (result.error) {
        expect(result.error.message).toContain('email valide')
      }
    })
  })
}) 