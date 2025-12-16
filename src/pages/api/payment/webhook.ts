/**
 * Stripe Webhook Handler
 * 
 * This endpoint receives and processes webhook events from Stripe. Webhooks
 * are the primary mechanism for handling asynchronous payment events like
 * successful charges, failed payments, and refunds.
 * 
 * Security: Stripe signs all webhook payloads with a secret. We verify this
 * signature to ensure the request actually came from Stripe and wasn't
 * tampered with in transit.
 * 
 * Flow for successful payment:
 * 1. Stripe sends payment_intent.succeeded event
 * 2. We verify the signature
 * 3. Create a purchase record in the database
 * 4. Generate an API key for the purchased product
 * 5. (TODO) Send confirmation email with the API key
 * 
 * @module api/payment/webhook
 */

import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createApiKeyForPurchase } from '../../../lib/api-keys';
import { supabase } from '../../../lib/supabaseClient';

// Disable static pre-rendering - this must run server-side
export const prerender = false;

// Initialize Stripe client with secret key for server-side operations
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

// Webhook signing secret for payload verification
const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

/**
 * POST handler for Stripe webhook events.
 * 
 * Important: The raw request body must be used for signature verification.
 * Do not parse JSON before calling constructEvent.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Stripe includes a signature header with every webhook request
    const sig = request.headers.get('stripe-signature');
    const payload = await request.text();

    if (!sig || !endpointSecret) {
      return new Response(JSON.stringify({ error: 'Signature manquante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the webhook signature to ensure authenticity
    // This throws an error if signature is invalid
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(JSON.stringify({ error: 'Signature invalide' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle the payment_intent.succeeded event - triggered when payment completes
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Metadata was attached when creating the payment intent
      const { user_id, product_id } = paymentIntent.metadata;

      // Record the successful purchase in our database
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id,
          product_id,
          payment_intent_id: paymentIntent.id,
          status: 'completed',
          amount: paymentIntent.amount  // Amount in cents
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Purchase creation error:', purchaseError);
        return new Response(JSON.stringify({ error: 'Erreur lors de la création de l\'achat' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Generate an API key for the purchased product
      try {
        const { apiKey } = await createApiKeyForPurchase(user_id, product_id);

        // TODO: Send confirmation email with the API key
        // The key should only be shown once, so email is important

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('API key creation error:', error);
        return new Response(JSON.stringify({ error: 'Erreur lors de la création de la clé API' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Acknowledge receipt of unhandled events
    // Stripe expects a 2xx response to mark the webhook as delivered
    return new Response(JSON.stringify({ received: true }), {
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