import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabaseClient';

export const POST: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Feature ID is required' }), {
        status: 400,
      });
    }

    // Incrémenter le compteur de votes
    const { data, error } = await supabase.rpc('increment_feature_votes', {
      feature_id: id
    });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}; 