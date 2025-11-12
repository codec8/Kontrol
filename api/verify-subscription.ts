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

    // Get customer's subscriptions
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

