/**
 * Stripe — billing and payments
 * Activates when STRIPE_SECRET_KEY is set.
 *
 * Usage:
 *   import { stripe, isStripeEnabled } from '@/lib/stripe'
 *   if (!isStripeEnabled) return // billing not configured
 */

import Stripe from 'stripe'

export const isStripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY)

export const stripe = isStripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' })
  : null

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ?? ''

// ── Helpers ────────────────────────────────────────────────────

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId?: string
  successUrl: string
  cancelUrl: string
}) {
  if (!stripe) throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY.')
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    metadata: { userId },
    line_items: [{ price: priceId ?? STRIPE_PRICE_ID, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}

export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  if (!stripe) throw new Error('Stripe is not configured.')
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl })
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) return null
  return stripe.subscriptions.retrieve(subscriptionId)
}
