/**
 * Payment Intent Creation Endpoint
 * 
 * Creates a Stripe PaymentIntent for product purchases. A PaymentIntent
 * represents the intent to collect a payment and tracks the lifecycle
 * of that payment through to completion.
 * 
 * Flow:
 * 1. Verify user authentication via Bearer token
 * 2. Look up product details and pricing
 * 3. Create PaymentIntent with user/product metadata
 * 4. Return client secret for frontend Stripe.js integration
 * 
 * The client secret allows the frontend to complete the payment securely
 * without exposing the full PaymentIntent or API keys.
 * 
 * @module api/payment/create-intent
 */

import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabaseClient';

// Disable static pre-rendering - this must run server-side
export const prerender = false;

// Initialize Stripe client with API version for type safety
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

/**
 * POST handler to create a new PaymentIntent.
 * 
 * Request requirements:
 * - Authorization header with valid Bearer token
 * - Form data with productId field
 * 
 * Returns the PaymentIntent client secret for Stripe.js confirmation.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Authenticate the request using Supabase JWT from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the JWT and get user info
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract product ID from form data
    const formData = await request.formData();
    const productId = formData.get('productId') as string;

    if (!productId) {
      return new Response(JSON.stringify({ error: 'ID du produit requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch product details to get current pricing
    // Always use database price, never trust client-provided amounts
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

    // Create PaymentIntent with metadata for webhook processing
    // Metadata links the payment back to user and product for fulfillment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price,  // Amount in cents (e.g., 1000 = €10.00)
      currency: 'eur',
      metadata: {
        user_id: user.id,
        product_id: productId
      }
    });

    // Return client secret - this is safe to expose to the frontend
    // It can only be used to confirm this specific PaymentIntent
    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret
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