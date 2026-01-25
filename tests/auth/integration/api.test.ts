import { describe, expect, it, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { setupSupabaseMock } from '../../mocks/supabase'
import { startTestServer, stopTestServer } from '../../setup-server'
import type { User } from '@supabase/supabase-js'
import { http, HttpResponse } from 'msw'
import { mswServer, setupMswServer } from '../../mocks/test-server'

interface ExtendedResponse extends Response {
  data?: any
}

const BASE_URL = 'http://localhost:4327'
const testEmail = 'test@example.com'
const testPassword = 'password123'

describe('Auth API Endpoints', () => {
  let server: any

  beforeAll(async () => {
    console.log('⏳ Configuration du mock client Supabase')
    const supabase = setupSupabaseMock()
    
    console.log('⏳ Démarrage du serveur de test...')
    try {
      server = await startTestServer()
      console.log('✓ Serveur de test démarré avec succès')
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du serveur:', error)
      throw error
    }
  }, 120000) // 120 secondes de timeout pour le beforeAll

  afterAll(async () => {
    console.log('⏳ Arrêt du serveur de test...')
    try {
      await stopTestServer()
      console.log('✓ Serveur de test arrêté avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de l\'arrêt du serveur:', error)
    }
  })

  async function fetchWithCredentials(url: string, options: RequestInit = {}): Promise<ExtendedResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 secondes timeout

    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': BASE_URL
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include',
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      const text = await response.text()
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      console.log('Response text:', text)

      let data
      try {
        data = text ? JSON.parse(text) : null
      } catch (error) {
        console.error('Error parsing response as JSON:', error)
        console.error('Response text was:', text)
        if (response.status === 500) {
          throw new Error(`Server error: ${text}`)
        }
        throw error
      }

      const extendedResponse: ExtendedResponse = response
      extendedResponse.data = data
      return extendedResponse
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a dépassé le délai d\'attente')
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  setupMswServer()

  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'TestPassword123!'
        })
      })

      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should handle missing email', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'TestPassword123!'
        })
      })

      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.error).toBe('missing-fields')
    })

    it('should handle existing email', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.error).toBe('user-exists')
    })
  })

  describe('POST /api/auth/signin', () => {
    it('should authenticate valid user', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should reject invalid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      })

      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.error).toBe('invalid-credentials')
    })
  })

  describe('POST /api/auth/reset-password', () => {
    it('should handle missing email', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.error).toBe('Email is required')
    })

    it('should handle successful request', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      })

      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('POST /api/auth/signout', () => {
    it('should successfully sign out a user', async () => {
      // D'abord connecter l'utilisateur
      const signInResponse = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      })

      expect(signInResponse.status).toBe(200)
      const cookies = signInResponse.headers.get('set-cookie')
      
      // Ensuite déconnecter l'utilisateur
      const response = await fetch(`${BASE_URL}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        }
      })

      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
      // Vérifier que les cookies sont bien supprimés
      const clearCookies = response.headers.get('set-cookie')
      expect(clearCookies).toContain('Max-Age=0')
    })

    it('should handle signout without active session', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.error).toBe('no-session')
    })
  })

  afterEach(async () => {
    // Nettoyer les utilisateurs de test
    try {
      const supabase = setupSupabaseMock()
      const { data } = await supabase.auth.admin.listUsers()
      const testUser = data?.users?.find((user: User) => user.email === testEmail)
      if (testUser?.id) {
        await supabase.auth.admin.deleteUser(testUser.id)
      }
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage des utilisateurs de test:', error)
    }
  })
}) 