# Stripe Subscription Setup Guide

This guide will help you set up Stripe subscriptions for the Financial Calendar Tool.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your app deployed to Vercel (or another platform that supports serverless functions)

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
   - Use test keys for development (`pk_test_...` and `sk_test_...`)
   - Use live keys for production (`pk_live_...` and `sk_live_...`)

## Step 2: Create a Product and Price

1. In Stripe Dashboard, go to **Products** → **Add product**
2. Fill in:
   - **Name**: "Financial Calendar Pro" (or your preferred name)
   - **Description**: "Unlimited entries, unlimited time range, and advanced features"
   - **Pricing**: 
     - **Recurring**: Monthly
     - **Price**: $4.99 (or your preferred price)
3. Click **Save product**
4. Copy the **Price ID** (starts with `price_...`)

## Step 3: Set Up Environment Variables

### For Local Development

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Stripe keys:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_PRICE_ID=price_your_price_id_here
   STRIPE_WEBHOOK_SECRET=whsec_placeholder
   ```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `STRIPE_SECRET_KEY` (use production key for production, test key for preview)
   - `STRIPE_PUBLISHABLE_KEY` (optional, if you need it in frontend)
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET` (see Step 4)

## Step 4: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your app about subscription events (payments, cancellations, etc.).

### For Local Development (using Stripe CLI)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:5173/api/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_...`) and add it to `.env`

### For Production (Vercel)

1. Deploy your app to Vercel first
2. In Stripe Dashboard, go to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Set the endpoint URL to: `https://your-domain.com/api/webhook`
5. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_...`)
8. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Try to add more than 15 entries (should show upgrade prompt)
3. Click "Upgrade to Pro" button
4. Complete test checkout with Stripe test card: `4242 4242 4242 4242`
5. Verify subscription status updates after checkout

## Step 6: Go Live

1. Switch to live mode in Stripe Dashboard
2. Update environment variables in Vercel with live keys
3. Update webhook endpoint to use production URL
4. Test with a real payment (you can refund it)

## Troubleshooting

### Subscription not verifying after checkout

- Check that webhook endpoint is correctly configured
- Verify `STRIPE_WEBHOOK_SECRET` matches the webhook signing secret
- Check Vercel function logs for errors

### API errors

- Ensure `STRIPE_SECRET_KEY` is correct
- Verify `STRIPE_PRICE_ID` matches your created price
- Check that API keys match the environment (test vs live)

### Webhook not receiving events

- Verify webhook URL is accessible
- Check webhook endpoint is listening to correct events
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:5173/api/webhook`

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

