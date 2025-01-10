export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { randomBytes, createHash } from 'crypto';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

function generateApiKey(prefix: string = 'wf'): string {
  const bytes = randomBytes(32);
  const base64 = bytes.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return `${prefix}_${base64}`;
}

function hashApiKey(apiKey: string): string {
  return createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

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

    // Générer la clé API
    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);

    // Calculer la date d'expiration
    let expiresAt: Date | null = null;
    if (expiration !== 'never') {
      const days = parseInt(expiration);
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
    }

    // Sauvegarder la clé dans la base de données
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name,
        key_hash: keyHash,
        permissions,
        expires_at: expiresAt,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Erreur lors de la création de la clé' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Retourner la clé (elle ne sera plus jamais accessible après)
    return new Response(JSON.stringify({
      key: apiKey,
      id: data.id,
      name: data.name,
      permissions: data.permissions,
      expires_at: data.expires_at
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