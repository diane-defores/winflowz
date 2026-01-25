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
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({
          error: 'missing-fields',
          message: 'Le mot de passe actuel et le nouveau mot de passe sont requis'
        }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Vérifier que l'utilisateur est connecté
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return new Response(
        JSON.stringify({
          error: 'unauthorized',
          message: 'Vous devez être connecté pour changer votre mot de passe'
        }),
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    // Vérifier le mot de passe actuel en essayant de se connecter
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: currentPassword
    });

    if (signInError) {
      return new Response(
        JSON.stringify({
          error: 'invalid-password',
          message: 'Le mot de passe actuel est incorrect'
        }),
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    // Changer le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return new Response(
        JSON.stringify({
          error: 'update-failed',
          message: updateError.message
        }),
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mot de passe modifié avec succès'
      }),
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return new Response(
      JSON.stringify({
        error: 'internal-error',
        message: 'Une erreur est survenue lors du changement de mot de passe'
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}; 