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
  // Vérifier si la requête accepte du JSON
  const acceptHeader = request.headers.get('accept');
  if (!acceptHeader?.includes('application/json')) {
    return new Response(
      JSON.stringify({
        error: "invalid-content-type",
        message: "This endpoint only accepts application/json"
      }),
      { 
        status: 406,
        headers: corsHeaders
      }
    );
  }

  try {
    let email: string | undefined;
    let password: string | undefined;

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      password = body.password;
    } else {
      return new Response(
        JSON.stringify({
          error: "invalid-content-type",
          message: "Content-Type must be application/json"
        }),
        { 
          status: 415,
          headers: corsHeaders
        }
      );
    }

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "missing-fields",
          message: "Email and password are required"
        }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${import.meta.env.PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        return new Response(
          JSON.stringify({
            error: "user-exists",
            message: "This email is already registered",
            success: false
          }),
          { 
            status: 400,
            headers: corsHeaders
          }
        );
      }
      return new Response(
        JSON.stringify({
          error: "auth-error",
          message: error.message
        }),
        { 
          status: error.status || 400,
          headers: corsHeaders
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Please check your email to confirm your account",
        data: {
          user: data.user
        }
      }),
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(
      JSON.stringify({
        error: "server-error",
        message: "An error occurred during registration"
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}; 