# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: The Base

A production-ready startup template — Next.js 16, Supabase, shadcn/ui, Vercel.

## Commands

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run summarize    # AI-powered project summary (needs ANTHROPIC_API_KEY)
npm run bootstrap    # Spin up a new project: GitHub + Supabase + Vercel
npm run db:push      # Apply Supabase migrations
npm run db:types     # Regenerate TypeScript types from DB schema
```

## Skills — Load Before Every Task

These skills are installed and MUST be applied automatically. Never wait to be asked.

| Task | Skill to load |
|------|--------------|
| Any React or Next.js code | `next-best-practices` + `vercel-react-best-practices` |
| Any UI, layout, component | `web-design-guidelines` + `vercel-composition-patterns` + `theme-factory` |
| Component architecture decisions | `vercel-composition-patterns` |
| Visual QA / design audit | `design-review` |
| QA testing the running app | `qa` + `browse` |
| Shipping / releasing | `ship` |
| New capability needed | `find-skills` |
| After writing/modifying code | `code-reviewer` (auto-delegate) |
| After implementing features | `test-writer` (auto-delegate) |
| Commits, branches, PRs | `git-manager` (auto-delegate) |

> All skills and install commands: see `SKILLS.md`

## App Configuration — Central Source of Truth

All branding, names, URLs, and feature flags live in **`lib/config.ts`** and are driven by env vars.

To rename the app: change `NEXT_PUBLIC_APP_NAME` in `.env.local`.
To rebrand: change `NEXT_PUBLIC_APP_LOGO_LETTER`, `NEXT_PUBLIC_APP_TAGLINE`, etc.
**Never hardcode app name, URL, or feature state in components** — always import from `lib/config.ts`.

```typescript
import { config } from '@/lib/config'
// config.name, config.url, config.features.billing, etc.
```

## Architecture

**Route map:**
- `app/page.tsx` — Public landing page
- `app/(auth)/` — Login + signup (split layout: brand panel left, form right)
- `app/dashboard/` — Protected area (sidebar layout)
- `app/dashboard/profile/` — Profile editor
- `app/dashboard/settings/` — Settings tabs (account, billing, notifications, danger)
- `middleware.ts` — Auth guard + rate limiting

**Supabase clients — critical:**
- `lib/supabase/client.ts` → `'use client'` files ONLY
- `lib/supabase/server.ts` → Server Components, Server Actions, Route Handlers ONLY

**Data flow:**
- Server components fetch directly via `lib/supabase/server.ts` — no `useEffect`, no loading states
- Client components use `lib/supabase/client.ts` for mutations only
- After auth changes: always `router.refresh()` to revalidate server component cache

## Database

Migrations in `supabase/migrations/`. Every new table needs:
1. `alter table X enable row level security`
2. At least one policy

Key tables: `profiles` (auto-created on signup via trigger), billing columns added in migration `20240102`.

## UI

shadcn/ui components in `components/ui/`. Add with `npx shadcn@latest add <name>`.
Use `@/lib/config.ts` for all app identity. Use `lucide-react` for icons.

## Integrations (activate via env vars — zero code changes)

| Feature | Env var to set |
|---------|---------------|
| Email (Resend) | `RESEND_API_KEY` |
| Billing (Stripe) | `STRIPE_SECRET_KEY` |
| Error tracking (Sentry) | `NEXT_PUBLIC_SENTRY_DSN` |
| GitHub OAuth | `NEXT_PUBLIC_GITHUB_OAUTH_ENABLED=true` |
| Google OAuth | `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true` |
| Redis rate limiting | `UPSTASH_REDIS_REST_URL` |

## Deployment

Every push to `main` → Vercel auto-deploys to production.
Env vars live in Vercel dashboard — never in committed files.
