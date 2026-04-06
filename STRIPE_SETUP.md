# Stripe Integration Setup Guide

This application uses Stripe for secure payment processing. Follow these steps to configure Stripe for your checkout system.

## Quick Setup Steps

### 1. Get Your Stripe Secret Key

1. Visit [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign in or create a Stripe account
3. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)

### 2. Configure Stripe Secret in Supabase

The Stripe secret key is automatically available as an environment variable in your Edge Functions. No manual configuration needed.

### 3. Create Stripe Price IDs

You need to create three products in Stripe with their corresponding price IDs:

1. **Quick Start Action Plan - $27**
   - Go to [Stripe Products](https://dashboard.stripe.com/products)
   - Click "Add product"
   - Name: "Quick Start Action Plan"
   - Price: $27 (one-time payment)
   - Copy the Price ID (starts with `price_`)

2. **Grant Readiness Audit - $97**
   - Create another product
   - Name: "Grant Readiness Audit"
   - Price: $97 (one-time payment)
   - Copy the Price ID

3. **Audit + Strategy Session - $197**
   - Create another product
   - Name: "Audit + Strategy Session"
   - Price: $197 (one-time payment)
   - Copy the Price ID

### 4. Update Price IDs in Code

Open `src/config/pricing.ts` and replace the placeholder price IDs:

```typescript
// Replace these with your actual Stripe Price IDs
stripePriceId: 'price_action_plan_27',     // Replace with your actual Price ID
stripePriceId: 'price_strategy_audit_97',   // Replace with your actual Price ID
stripePriceId: 'price_strategy_session_197' // Replace with your actual Price ID
```

## Testing Your Integration

### Test Mode

1. Use test mode Price IDs (they start with `price_test_`)
2. Use [Stripe test cards](https://stripe.com/docs/testing#cards):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

### Production Mode

1. Create products with live Price IDs (start with `price_`)
2. Update your `.env` file with live Stripe secret key
3. Test with real cards (only small amounts recommended for initial tests)

## Post-Purchase Flows

After successful payment, users are redirected based on their purchase:

- **$27 Action Plan** → `/upsell` (with upgrade options)
- **$97 Strategy Audit** → `/detailed-results` (what they'll receive)
- **$197 Strategy Session** → `/schedule-session` (booking page)

## Troubleshooting

### "Stripe is not configured" Error

This means the STRIPE_SECRET_KEY environment variable is not set in your Supabase project.

### Payment Not Processing

1. Check that your Price IDs are correct in `src/config/pricing.ts`
2. Verify your Stripe account is active
3. Check Stripe Dashboard logs for detailed error messages

### Wrong Amount Charged

Make sure the `price` field in `src/config/pricing.ts` matches the actual price configured in Stripe.

## Security Notes

- Never expose your Stripe Secret Key in client-side code
- The secret key is securely stored in Supabase Edge Functions
- All checkout sessions are created server-side for security
- Customer emails are automatically associated with Stripe checkout sessions

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
