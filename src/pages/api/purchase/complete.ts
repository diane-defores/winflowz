export const prerender = false;

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { createApiKeyForPurchase } from '../../../lib/api-keys';

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

    // Récupérer les données de l'achat
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const paymentIntentId = formData.get('paymentIntentId') as string;

    if (!productId || !paymentIntentId) {
      return new Response(JSON.stringify({ error: 'Données manquantes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier que le produit existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return new Response(JSON.stringify({ error: 'Produit non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer l'achat dans la base de données
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        product_id: productId,
        payment_intent_id: paymentIntentId,
        status: 'completed',
        amount: product.price
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Purchase error:', purchaseError);
      return new Response(JSON.stringify({ error: 'Erreur lors de l\'enregistrement de l\'achat' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Générer la clé API
    const { apiKey, keyData } = await createApiKeyForPurchase(user.id, productId);

    // Envoyer un email de confirmation avec la clé API
    // TODO: Implémenter l'envoi d'email

    return new Response(JSON.stringify({
      success: true,
      purchase: {
        id: purchase.id,
        amount: purchase.amount,
        created_at: purchase.created_at
      },
      product: {
        name: product.name,
        description: product.description
      },
      apiKey
    }), {
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