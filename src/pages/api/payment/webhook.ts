import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createApiKeyForPurchase } from '../../../lib/api-keys';
import { supabase } from '../../../lib/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const post: APIRoute = async ({ request }) => {
  try {
    const sig = request.headers.get('stripe-signature');
    const payload = await request.text();

    if (!sig || !endpointSecret) {
      return new Response(JSON.stringify({ error: 'Signature manquante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier la signature du webhook
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

    // Gérer l'événement
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { user_id, product_id } = paymentIntent.metadata;

      // Créer l'entrée dans la table purchases
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id,
          product_id,
          payment_intent_id: paymentIntent.id,
          status: 'completed',
          amount: paymentIntent.amount
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

      // Générer la clé API
      try {
        const { apiKey, keyData } = await createApiKeyForPurchase(user_id, product_id);

        // Envoyer un email avec la clé API
        // TODO: Implémenter l'envoi d'email

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

    // Gérer les autres événements si nécessaire
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