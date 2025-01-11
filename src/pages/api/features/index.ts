import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';
import type { Feature } from '@/types/roadmap';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const { title, description, projectId } = body;
    
    if (!title || !description || !projectId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from('features')
      .insert([
        {
          title,
          description,
          projectId,
          status: 'considering',
          votes: 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 201,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}; 