/**
 * Rate limiting — in-memory for dev/single-instance, Upstash Redis for prod.
 * Activates Upstash when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
 * Falls back to a Map-based in-memory limiter automatically.
 *
 * Usage (in middleware or route handlers):
 *   import { rateLimit } from '@/lib/rate-limit'
 *   const result = await rateLimit(ip, { limit: 10, windowMs: 60_000 })
 *   if (!result.success) return new Response('Too many requests', { status: 429 })
 */

type RateLimitResult = { success: boolean; remaining: number; reset: number }

// ── In-memory fallback ─────────────────────────────────────────
const store = new Map<string, { count: number; reset: number }>()

function inMemoryLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    return { success: true, remaining: limit - 1, reset: now + windowMs }
  }

  entry.count++
  if (entry.count > limit) {
    return { success: false, remaining: 0, reset: entry.reset }
  }

  return { success: true, remaining: limit - entry.count, reset: entry.reset }
}

// ── Upstash Redis (production) ─────────────────────────────────
async function upstashLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!
  const windowSec = Math.ceil(windowMs / 1000)

  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, windowSec],
    ]),
  })

  const [[, count]] = await res.json()
  const success = count <= limit
  return { success, remaining: Math.max(0, limit - count), reset: Date.now() + windowMs }
}

// ── Public API ─────────────────────────────────────────────────
export async function rateLimit(
  identifier: string,
  options: { limit?: number; windowMs?: number } = {}
): Promise<RateLimitResult> {
  const { limit = 10, windowMs = 60_000 } = options
  const key = `rl:${identifier}`

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return upstashLimit(key, limit, windowMs)
  }

  return inMemoryLimit(key, limit, windowMs)
}

// ── Preset configs ─────────────────────────────────────────────
export const rateLimits = {
  /** Auth routes: 5 attempts per minute */
  auth: { limit: 5, windowMs: 60_000 },
  /** API routes: 60 req per minute */
  api: { limit: 60, windowMs: 60_000 },
  /** Heavy ops (AI, export): 5 per 5 minutes */
  heavy: { limit: 5, windowMs: 5 * 60_000 },
}
