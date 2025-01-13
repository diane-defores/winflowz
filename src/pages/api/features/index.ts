import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';
import type { Feature } from '@/types/roadmap';

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!request.body) {
      console.error('No request body provided');
      return new Response(JSON.stringify({ error: 'No body provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const body = await request.json();
    console.log('Received request body:', body);
    
    const { title, description, projectId } = body;
    
    if (!title || !description || !projectId) {
      console.error('Missing required fields:', { title, description, projectId });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Attempting to insert feature:', {
      title,
      description,
      projectId,
      status: 'considering',
      votes: 0
    });

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

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Successfully inserted feature:', data);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 