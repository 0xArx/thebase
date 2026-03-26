/**
 * Sentry error tracking — activates when NEXT_PUBLIC_SENTRY_DSN is set.
 *
 * Usage:
 *   import { captureError } from '@/lib/sentry'
 *   captureError(err, { userId, context: 'checkout' })
 */

export function captureError(
  error: unknown,
  context?: Record<string, unknown>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('[error]', error, context)
    return
  }
  // Sentry is initialized in sentry.client.config.ts / sentry.server.config.ts
  // This function is a convenience wrapper for adding context
  import('@sentry/nextjs').then(({ captureException, withScope }) => {
    if (context) {
      withScope((scope) => {
        Object.entries(context).forEach(([k, v]) => scope.setExtra(k, v))
        captureException(error)
      })
    } else {
      captureException(error)
    }
  })
}
