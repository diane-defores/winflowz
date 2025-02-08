import { defineConfig } from 'vitest/config'
import path from 'path'
import dotenv from 'dotenv'

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' })

// Polyfill pour TextEncoder/TextDecoder
if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  globalThis.TextEncoder = TextEncoder
  globalThis.TextDecoder = TextDecoder
}

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
      ],
    },
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 