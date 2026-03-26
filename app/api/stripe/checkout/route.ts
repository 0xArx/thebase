import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, isStripeEnabled } from '@/lib/stripe'

export async function POST() {
  if (!isStripeEnabled) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const session = await createCheckoutSession({
    userId: user.id,
    email: user.email!,
    successUrl: `${appUrl}/dashboard?upgraded=true`,
    cancelUrl: `${appUrl}/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
