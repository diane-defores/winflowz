/**
 * Purchase Completion Endpoint
 * 
 * Finalizes a product purchase after payment has been confirmed. This endpoint
 * is called from the frontend after Stripe payment confirmation succeeds.
 * 
 * Note: This provides an alternative to webhook-based fulfillment. While
 * webhooks are more reliable (they work even if the user closes the browser),
 * this endpoint provides immediate response for better UX.
 * 
 * Flow:
 * 1. Verify user authentication
 * 2. Validate product exists
 * 3. Record purchase in database
 * 4. Generate API key for product access
 * 5. Return purchase confirmation with API key
 * 
 * @module api/purchase/complete
 */

export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabaseClient';
import { createApiKeyForPurchase } from '../../../lib/api-keys';

/**
 * POST handler to complete a purchase and generate API key.
 * 
 * Request requirements:
 * - Authorization header with valid Bearer token
 * - Form data with: productId, paymentIntentId
 * 
 * Returns purchase details and the plain text API key (shown once).
 */
export const post: APIRoute = async ({ request }) => {
  try {
    // Authenticate request using Supabase JWT
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

    // Extract purchase details from form data
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const paymentIntentId = formData.get('paymentIntentId') as string;

    if (!productId || !paymentIntentId) {
      return new Response(JSON.stringify({ error: 'Données manquantes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify product exists and get pricing info
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

    // Record the purchase in the database
    // Note: In production, verify the paymentIntentId with Stripe API
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

    // Generate API key for accessing the purchased product
    const { apiKey, keyData } = await createApiKeyForPurchase(user.id, productId);

    // TODO: Send confirmation email with the API key
    // Important since the key is only shown once

    // Return purchase confirmation with the API key
    // The key is displayed once - user must save it now
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
      apiKey  // Show this ONCE - cannot be retrieved later
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