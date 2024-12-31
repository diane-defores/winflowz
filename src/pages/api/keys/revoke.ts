import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

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

    // Récupérer l'ID de la clé
    const formData = await request.formData();
    const keyId = formData.get('keyId') as string;

    if (!keyId) {
      return new Response(JSON.stringify({ error: 'ID de clé requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier que l'utilisateur possède cette clé
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('id', keyId)
      .single();

    if (keyError || !keyData) {
      return new Response(JSON.stringify({ error: 'Clé non trouvée' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (keyData.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Révoquer la clé
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ status: 'expired' })
      .eq('id', keyId);

    if (updateError) {
      console.error('Database error:', updateError);
      return new Response(JSON.stringify({ error: 'Erreur lors de la révocation de la clé' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
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