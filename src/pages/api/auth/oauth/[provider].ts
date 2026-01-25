export const prerender = false;

import type { APIRoute } from "astro";
import { createServerSupabase } from "@/lib/supabaseClient";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:4327',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

const OAUTH_SCOPES = {
  google: 'email profile',
  github: 'user:email',
  facebook: 'email,public_profile'
} as const;

type Provider = keyof typeof OAUTH_SCOPES;

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    const supabase = createServerSupabase();
    const provider = params.provider as Provider;
    const { redirectTo } = await request.json();

    if (!Object.keys(OAUTH_SCOPES).includes(provider)) {
      return new Response(
        JSON.stringify({
          error: 'invalid-provider',
          message: 'Provider non supporté. Providers disponibles : ' + Object.keys(OAUTH_SCOPES).join(', ')
        }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Générer l'URL de connexion OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectTo || `${new URL(request.url).origin}/auth/callback`,
        scopes: OAUTH_SCOPES[provider],
        queryParams: provider === 'facebook' ? {
          // Options spécifiques à Facebook
          display: 'popup',
          auth_type: 'rerequest',
          auth_nonce: crypto.randomUUID()
        } : undefined
      }
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: 'oauth-error',
          message: error.message
        }),
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Rediriger vers l'URL de connexion OAuth
    return redirect(data.url);
  } catch (error) {
    console.error('Erreur lors de la connexion OAuth:', error);
    return new Response(
      JSON.stringify({
        error: 'internal-error',
        message: 'Une erreur est survenue lors de la connexion OAuth'
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}; 