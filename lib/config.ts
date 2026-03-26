/**
 * lib/config.ts — Central app configuration
 *
 * Every name, URL, description, and feature flag lives here.
 * To rename or rebrand: update the env vars in .env.local.
 * To fork for a new project: just swap the env vars — zero code changes.
 */

export const config = {
  // ── Identity ─────────────────────────────────────────────────
  name:        process.env.NEXT_PUBLIC_APP_NAME        ?? 'The Base',
  tagline:     process.env.NEXT_PUBLIC_APP_TAGLINE      ?? 'Ship your startup in hours, not weeks.',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? 'Auth, database, UI, billing, and deploy — all pre-wired.',
  url:         process.env.NEXT_PUBLIC_APP_URL          ?? 'http://localhost:3000',

  // ── Branding ─────────────────────────────────────────────────
  // logo.letter: single character shown in the icon mark
  logo: {
    letter: process.env.NEXT_PUBLIC_APP_LOGO_LETTER ?? 'B',
  },

  // ── Social / meta ────────────────────────────────────────────
  twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? '',
  github:  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? 'https://github.com/0xArx/the-base',

  // ── Support links ─────────────────────────────────────────────
  links: {
    docs:    '/dashboard/support',
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL
      ? `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`
      : '#',
  },

  // ── Feature flags ─────────────────────────────────────────────
  // Each flag activates automatically when its env var is set.
  // No code changes needed — just add the key to .env.local.
  features: {
    email:         Boolean(process.env.RESEND_API_KEY),
    billing:       Boolean(process.env.STRIPE_SECRET_KEY),
    errorTracking: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    githubOAuth:   process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === 'true',
    googleOAuth:   process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true',
    rateLimiting:  Boolean(process.env.UPSTASH_REDIS_REST_URL),
  },
} as const

export type AppConfig = typeof config
