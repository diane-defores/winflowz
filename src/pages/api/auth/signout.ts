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

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const supabase = createServerSupabase();
    
    // Récupérer le token de session depuis les cookies
    const authCookie = request.headers.get('cookie')?.split(';')
      .find(cookie => cookie.trim().startsWith('sb-access-token='));
    
    if (!authCookie) {
      return new Response(
        JSON.stringify({
          error: 'no-session',
          message: 'Aucune session active trouvée'
        }),
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    // Déconnexion via Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      return new Response(
        JSON.stringify({
          error: 'signout-failed',
          message: error.message
        }),
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Supprimer les cookies de session
    const cookieOptions = 'Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
    const clearCookies = {
      ...corsHeaders,
      'Set-Cookie': [
        `sb-access-token=; ${cookieOptions}`,
        `sb-refresh-token=; ${cookieOptions}`
      ].join(', ')
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Déconnexion réussie'
      }),
      { 
        status: 200,
        headers: clearCookies
      }
    );
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return new Response(
      JSON.stringify({
        error: 'internal-error',
        message: 'Une erreur est survenue lors de la déconnexion'
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
};