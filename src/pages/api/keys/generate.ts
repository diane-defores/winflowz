export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabaseClient';
import { createCustomApiKey } from '../../../lib/api-keys';

export const post: APIRoute = async ({ request }) => {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer les données du formulaire
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const expiration = formData.get('expiration') as string;
    const permissions = formData.getAll('permissions[]') as string[];

    if (!name) {
      return new Response(JSON.stringify({ error: 'Le nom est requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer la clé API
    const { apiKey, keyData } = await createCustomApiKey({
      userId: user.id,
      name,
      expiration,
      permissions
    });

    // Retourner la clé (elle ne sera plus jamais accessible après)
    return new Response(JSON.stringify({
      key: apiKey,
      id: keyData.id,
      name: keyData.name,
      permissions: keyData.permissions,
      expires_at: keyData.expires_at
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 