import { describe, expect, it, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { createServerSupabase } from '@/lib/supabaseClient'
import { startTestServer, stopTestServer } from '../../setup-server'

interface ExtendedResponse extends Response {
  data?: any
}

const BASE_URL = 'http://localhost:4321'
const testEmail = 'test@example.com'
const testPassword = 'password123'

describe('Auth API Endpoints', () => {
  beforeAll(async () => {
    await startTestServer()
  })

  afterAll(async () => {
    await stopTestServer()
  })

  async function fetchWithCredentials(url: string, options: RequestInit = {}): Promise<ExtendedResponse> {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    })

    // Gérer les réponses OPTIONS
    if (response.status === 204) {
      return response
    }

    // Pour les autres réponses, vérifier le type de contenu
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      const extendedResponse: ExtendedResponse = response
      extendedResponse.data = data
      return extendedResponse
    }

    return response
  }

  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toMatch(/Please check your email|Registration successful/)
    })

    it('devrait rejeter un email déjà utilisé', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: testPassword,
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('user-exists')
      expect(data.message).toBe('This email is already registered')
      expect(data.success).toBe(false)
    })

    it('devrait rejeter une requête sans email', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: testPassword,
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('missing-fields')
    })
  })

  describe('POST /api/auth/signin', () => {
    it('devrait connecter un utilisateur valide', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.message).toBe('Login successful')
      expect(data.data.user).toBeDefined()
      
      const cookies = response.headers.get('set-cookie')
      expect(cookies).toContain('sb-access-token')
      expect(cookies).toContain('sb-refresh-token')
    })

    it('devrait rejeter des identifiants invalides', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: 'wrong-password',
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('auth-failed')
    })
  })

  describe('POST /api/auth/reset-password', () => {
    it('devrait accepter une demande de réinitialisation valide', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.message).toBe('Password reset instructions sent')
    })

    it('devrait rejeter une demande sans email', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('missing-email')
    })
  })

  afterEach(async () => {
    // Nettoyer les utilisateurs de test
    const supabase = createServerSupabase()
    const { data } = await supabase.auth.admin.listUsers()
    const testUser = data?.users?.find(user => user.email === testEmail)
    if (testUser?.id) {
      await supabase.auth.admin.deleteUser(testUser.id)
    }
  })
}) 