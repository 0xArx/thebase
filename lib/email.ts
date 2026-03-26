/**
 * Email — powered by Resend
 * Activates when RESEND_API_KEY is set. No-ops silently when not configured.
 *
 * Usage:
 *   import { sendEmail } from '@/lib/email'
 *   await sendEmail({ to: 'user@example.com', subject: 'Welcome!', html: '<p>Hi</p>' })
 */

import { Resend } from 'resend'

type EmailOptions = {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = process.env.RESEND_FROM_EMAIL ?? 'no-reply@example.com'

export async function sendEmail(options: EmailOptions) {
  if (!resend) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[email] RESEND_API_KEY not set — skipping email to:', options.to)
      console.log('[email] Subject:', options.subject)
    }
    return { id: 'dev-noop', skipped: true }
  }

  const { data, error } = await resend.emails.send({
    from: options.from ?? FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    ...(options.replyTo ? { reply_to: options.replyTo } : {}),
  })

  if (error) throw new Error(`Email failed: ${error.message}`)
  return data
}

// ── Pre-built templates ─────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name?: string) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'The App'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  return sendEmail({
    to,
    subject: `Welcome to ${appName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Welcome${name ? `, ${name}` : ''}!</h2>
        <p>Your account is ready. Click below to get started.</p>
        <a href="${appUrl}/dashboard"
           style="display:inline-block;padding:12px 24px;background:#111;color:#fff;
                  border-radius:6px;text-decoration:none;font-weight:600">
          Go to dashboard
        </a>
        <p style="color:#888;font-size:13px;margin-top:32px">${appName}</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'The App'
  return sendEmail({
    to,
    subject: `Reset your ${appName} password`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Reset your password</h2>
        <p>Click the link below. It expires in 1 hour.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#111;color:#fff;
                  border-radius:6px;text-decoration:none;font-weight:600">
          Reset password
        </a>
        <p style="color:#888;font-size:13px;margin-top:32px">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  })
}
