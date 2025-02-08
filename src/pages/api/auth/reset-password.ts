export const prerender = false;
import type { APIRoute } from "astro";
import { createServerSupabase } from "@/lib/supabaseClient";

export const POST: APIRoute = async ({ request }) => {
  try {
    let email: string | undefined;

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      email = body.email;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      email = formData.get('email')?.toString();
    }

    if (!email) {
      return new Response(
        JSON.stringify({
          error: "missing-email",
          message: "Email is required"
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.PUBLIC_SITE_URL}/auth/reset-password`
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: "reset-failed",
          message: error.message
        }),
        { 
          status: error.status || 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Password reset instructions sent",
        data
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error during password reset:", error);
    return new Response(
      JSON.stringify({
        error: "server-error",
        message: "An error occurred during password reset"
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 