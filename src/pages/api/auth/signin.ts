export const prerender = false;
import type { APIRoute } from "astro";
import { createServerSupabase } from "@/lib/supabaseClient";

export const POST: APIRoute = async ({ request }) => {
  try {
    let email: string | undefined;
    let password: string | undefined;

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      password = body.password;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      email = formData.get('email')?.toString();
      password = formData.get('password')?.toString();
    }

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: "missing-fields",
          message: "Email and password are required"
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: "auth-failed",
          message: error.message
        }),
        { 
          status: error.status || 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Supabase gère automatiquement les cookies
    return new Response(
      JSON.stringify({
        message: "Login successful",
        data: {
          user: data.user
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({
        error: "server-error",
        message: "An error occurred during login"
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};