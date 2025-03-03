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
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({
          error: 'missing-email',
          message: 'L\'adresse email est requise'
        }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Envoyer l'email de vérification via Supabase
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: 'verification-failed',
          message: error.message
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
        message: 'Email de vérification envoyé avec succès'
      }),
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    return new Response(
      JSON.stringify({
        error: 'internal-error',
        message: 'Une erreur est survenue lors de l\'envoi de l\'email de vérification'
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}; 