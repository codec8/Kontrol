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
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(200).json({ 
        isActive: false, 
        tier: 'free',
        expiresAt: null 
      });
    }

    // Check for lifetime purchase first (one-time payment)
    const lifetimePriceId = process.env.STRIPE_LIFETIME_PRICE_ID;
    if (lifetimePriceId) {
      const payments = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 100,
      });

      // Check if customer has any successful payment for lifetime product
      for (const payment of payments.data) {
        if (payment.status === 'succeeded') {
          // Get the checkout session to check metadata
          if (payment.metadata?.tier === 'lifetime') {
            return res.status(200).json({
              isActive: true,
              tier: 'lifetime',
              expiresAt: null, // Lifetime never expires
              cancelAtPeriodEnd: false,
            });
          }
        }
      }

      // Also check checkout sessions for lifetime purchases
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 100,
      });

      for (const session of sessions.data) {
        if (session.payment_status === 'paid' && session.metadata?.tier === 'lifetime') {
          return res.status(200).json({
            isActive: true,
            tier: 'lifetime',
            expiresAt: null,
            cancelAtPeriodEnd: false,
          });
        }
      }
    }

    // Check for active subscriptions (Pro tier)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    const hasActiveSubscription = subscriptions.data.length > 0;
    const subscription = hasActiveSubscription ? subscriptions.data[0] : null;

    return res.status(200).json({
      isActive: hasActiveSubscription,
      tier: hasActiveSubscription ? 'pro' : 'free',
      expiresAt: subscription?.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
    });
  } catch (error: any) {
    console.error('Error verifying subscription:', error);
    // On error, default to free tier
    return res.status(200).json({ 
      isActive: false, 
      tier: 'free',
      expiresAt: null 
    });
  }
}

