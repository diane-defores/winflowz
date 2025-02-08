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
        { status: 400 }
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
            message: "This email is already registered"
          }),
          { status: 400 }
        );
      }
      return new Response(
        JSON.stringify({
          error: "auth-error",
          message: error.message
        }),
        { status: error.status || 400 }
      );
    }

    // Succès - Supabase gère automatiquement la session
    return new Response(
      JSON.stringify({
        success: true,
        message: "Please check your email to confirm your account",
        data: {
          user: data.user
        }
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(
      JSON.stringify({
        error: "server-error",
        message: "An error occurred during registration"
      }),
      { status: 500 }
    );
  }
};