import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, tier = 'pro' } = req.body;

    // Get the price ID based on tier
    let priceId: string;
    let mode: 'subscription' | 'payment';

    if (tier === 'lifetime') {
      priceId = process.env.STRIPE_LIFETIME_PRICE_ID || 'price_lifetime_placeholder';
      mode = 'payment'; // One-time payment for lifetime
    } else {
      priceId = process.env.STRIPE_PRICE_ID || 'price_placeholder';
      mode = 'subscription'; // Recurring subscription for pro
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin || 'http://localhost:5173'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5173'}`,
      allow_promotion_codes: true,
      metadata: {
        tier: tier, // Store tier in metadata for webhook processing
      },
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}

