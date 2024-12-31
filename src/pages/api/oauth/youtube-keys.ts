import type { APIRoute } from 'astro';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// Configuration du rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite à 100 requêtes par fenêtre
});

// Liste des origines autorisées (à ajuster selon vos besoins)
const allowedOrigins = [
  'app://obsidian.md', // Pour le plugin Obsidian
  'capacitor://localhost', // Pour l'app mobile
  'http://localhost' // Pour le développement local
];

// Vérification du token d'authentification
function verifyPluginToken(token: string | null): boolean {
  // TODO: Implémenter une vérification plus robuste
  const validToken = import.meta.env.PLUGIN_AUTH_TOKEN;
  return token === validToken;
}

export const get: APIRoute = async ({ request }) => {
  try {
    // Vérification CORS
    const origin = request.headers.get('Origin');
    if (!origin || !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Origine non autorisée' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérification du token
    const authToken = request.headers.get('X-Plugin-Token');
    if (!verifyPluginToken(authToken)) {
      return new Response(JSON.stringify({ error: 'Token invalide' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Rate limiting
    // Note: Dans un environnement serverless, vous devrez peut-être utiliser
    // un store externe (Redis, etc.) pour le rate limiting
    try {
      await new Promise((resolve, reject) => {
        limiter(request as any, {} as any, (error: any) => {
          if (error) reject(error);
          resolve(true);
        });
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Trop de requêtes' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Logger l'accès
    console.log(`Accès aux clés OAuth YouTube - Origin: ${origin} - Date: ${new Date().toISOString()}`);

    // Récupérer les clés depuis les variables d'environnement
    const clientId = import.meta.env.YOUTUBE_CLIENT_ID;
    const clientSecret = import.meta.env.YOUTUBE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: 'Configuration manquante' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Retourner les clés
    return new Response(JSON.stringify({
      clientId,
      clientSecret,
      expiresIn: 3600 // 1 heure
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Plugin-Token',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 