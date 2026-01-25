/**
 * API Key Generation Endpoint
 * 
 * Allows authenticated users to create custom API keys with specified
 * name, expiration, and permission settings. These user-generated keys
 * differ from purchase-linked keys in that users have full control over
 * their configuration.
 * 
 * Important: The plain text API key is returned only once in this response.
 * We only store the hash, so the key cannot be retrieved later. Users must
 * save their key immediately after generation.
 * 
 * @module api/keys/generate
 */

export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabaseClient';
import { createCustomApiKey } from '../../../lib/api-keys';

/**
 * POST handler to generate a new API key.
 * 
 * Request requirements:
 * - Authorization header with valid Bearer token
 * - Form data with: name (required), expiration (optional), permissions[] (optional)
 * 
 * Returns the plain text key (show once) and key metadata.
 * Status 201 indicates resource created.
 */
export const post: APIRoute = async ({ request }) => {
  try {
    // Authenticate request using Supabase JWT
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

    // Parse key configuration from form data
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

    // Generate the key with specified options
    const { apiKey, keyData } = await createCustomApiKey({
      userId: user.id,
      name,
      expiration,
      permissions
    });

    // Return the plain text key - this is the only time it can be retrieved!
    // The database only stores the hash for security
    return new Response(JSON.stringify({
      key: apiKey,        // Show this to user ONCE - cannot be retrieved later
      id: keyData.id,
      name: keyData.name,
      permissions: keyData.permissions,
      expires_at: keyData.expires_at
    }), {
      status: 201,        // 201 Created - new resource was created
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