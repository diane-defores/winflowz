import { Server } from 'http'
import { handler } from '../dist/server/entry.mjs'
import { config } from 'dotenv'
import path from 'path'

// Charger les variables d'environnement de test
config({ path: path.resolve(process.cwd(), '.env.test') })

let server: Server

export async function startTestServer() {
  if (server) return server

  const port = 4321
  server = new Server(handler)
  
  await new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`Test server running at http://localhost:${port}`)
      resolve()
    })
  })

  return server
}

export async function stopTestServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve))
    server = null
  }
} 