# The Base — Skill

> Load this skill at the start of any coding session in this repo.
> It gives you complete context, architecture, conventions, and agentic access
> without reading a single file manually.

---

## What This Repo Is

**The Base** is a production-ready startup template — a one-command foundation
for any new product. It ships with authentication, a database, a UI system,
billing, email, error tracking, rate limiting, OAuth, and a live deployment,
all wired together and ready to fork.

**Live URL:** https://the-base-0xarx.vercel.app
**GitHub:** https://github.com/0xArx/the-base (private)

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | Server components, file routing, streaming |
| UI | shadcn/ui + Tailwind v4 + `@base-ui/react` | Accessible, owned components |
| Auth + DB | Supabase (Postgres + Auth) | Full Postgres with RLS, real-time, self-hostable |
| Hosting | Vercel | Zero-config deploys, edge network, preview URLs |
| Language | TypeScript (strict) | End-to-end type safety |
| Email | Resend | Transactional email, activates when `RESEND_API_KEY` set |
| Billing | Stripe | Checkout + portal, activates when `STRIPE_SECRET_KEY` set |
| Errors | Sentry | Error tracking, activates when `NEXT_PUBLIC_SENTRY_DSN` set |
| Rate Limiting | Upstash Redis (in-memory fallback) | `UPSTASH_REDIS_REST_URL` set → Redis; else Map |
| AI Scripts | Anthropic SDK (`claude-opus-4-6`) | `npm run summarize`, adaptive thinking |

---

## CRITICAL: `@base-ui/react` — NOT Radix

This project uses `@base-ui/react`, not Radix UI. The `asChild` prop **does not exist**.
Use the `render` prop instead:

```tsx
// ❌ WRONG — asChild doesn't exist in @base-ui/react
<DropdownMenuTrigger asChild><Button /></DropdownMenuTrigger>

// ✅ CORRECT — use render prop
<DropdownMenuTrigger render={<Button />}>...</DropdownMenuTrigger>
```

---

## Central Config — `lib/config.ts`

**All branding, URLs, and feature flags live here.** Import from config, never hardcode strings.

```typescript
import { config } from '@/lib/config'

config.name          // 'The Base' (or NEXT_PUBLIC_APP_NAME)
config.tagline       // 'Ship your startup in hours, not weeks.'
config.description   // one-liner description
config.url           // 'http://localhost:3000' (or NEXT_PUBLIC_APP_URL)
config.logo.letter   // 'B' (or NEXT_PUBLIC_APP_LOGO_LETTER)
config.twitter       // twitter handle
config.github        // github repo URL
config.links.docs    // '/dashboard/support'
config.links.support // mailto: link (if NEXT_PUBLIC_SUPPORT_EMAIL set)

// Feature flags — true when their env var is present
config.features.email         // Boolean(RESEND_API_KEY)
config.features.billing       // Boolean(STRIPE_SECRET_KEY)
config.features.errorTracking // Boolean(NEXT_PUBLIC_SENTRY_DSN)
config.features.githubOAuth   // NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === 'true'
config.features.googleOAuth   // NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true'
config.features.rateLimiting  // Boolean(UPSTASH_REDIS_REST_URL)
```

**To fork/rebrand:** only change env vars — zero code changes.

---

## Environment Variables — Complete Picture

All credentials live in `.env.local` (gitignored). The template is `.env.example`.

### App Identity
| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_APP_NAME` | The Base |
| `NEXT_PUBLIC_APP_TAGLINE` | Ship your startup in hours, not weeks. |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Auth, database, UI, billing, and deploy — all pre-wired. |
| `NEXT_PUBLIC_APP_URL` | http://localhost:3000 |
| `NEXT_PUBLIC_APP_LOGO_LETTER` | B |
| `NEXT_PUBLIC_TWITTER_HANDLE` | — |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | — |

### Supabase
| Variable | Purpose | Agentic Use |
|----------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser DB endpoint | All client queries |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key (RLS-restricted) | Browser auth, reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (bypasses RLS) | Server scripts, migrations, seeding |
| `SUPABASE_ACCESS_TOKEN` | Management API PAT | Create/delete projects, run migrations via API |
| `SUPABASE_PROJECT_REF` | Project identifier | `supabase` CLI, management API |
| `SUPABASE_ORG_ID` | Org identifier | Management API org-level calls |
| `SUPABASE_DB_PASSWORD` | DB password | Direct Postgres connections |
| `DATABASE_URL` | Full Postgres connection string | ORMs, `psql`, migration tools |

### Vercel
| Variable | Purpose | Agentic Use |
|----------|---------|------------|
| `VERCEL_TOKEN` | Full API token | Deploy, set env vars, manage domains |
| `VERCEL_TEAM_ID` | Team context | All team-scoped API calls |
| `VERCEL_PROJECT_ID` | Project context | Project-specific deploys and settings |
| `VERCEL_ORG_ID` | CLI alias for team | `vercel` CLI commands |

### GitHub
| Variable | Purpose | Agentic Use |
|----------|---------|------------|
| `GITHUB_TOKEN` | Full PAT | Push, PRs, issues, Actions, webhooks |
| `GITHUB_OWNER` | Username/org | API calls, repo operations |
| `GITHUB_REPO` | Repo name | Targeted API calls |

### Optional Integrations (activate by adding key)
| Variable | Activates |
|----------|-----------|
| `RESEND_API_KEY` | Email sending (`config.features.email`) |
| `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Billing (`config.features.billing`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking (`config.features.errorTracking`) |
| `NEXT_PUBLIC_GITHUB_OAUTH_ENABLED=true` | GitHub OAuth (`config.features.githubOAuth`) |
| `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true` | Google OAuth (`config.features.googleOAuth`) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Redis rate limiting (falls back to in-memory) |
| `ANTHROPIC_API_KEY` | `npm run summarize` |

---

## App Architecture

### Route Map
```
/                          → app/page.tsx                     — public landing page
/login                     → app/(auth)/login/                — email/password sign-in
/signup                    → app/(auth)/signup/               — account creation
/dashboard                 → app/dashboard/page.tsx           — protected home
/dashboard/settings        → app/dashboard/settings/          — settings (URL tabs)
/dashboard/profile         → app/dashboard/profile/           — profile page
/dashboard/support         → app/dashboard/support/           — help & support
```

### Auth Flow
```
Request hits middleware.ts
  ├─ /dashboard/* + no session → redirect /login
  ├─ /login or /signup + session → redirect /dashboard
  └─ everything else → pass through

Login form (client component)
  └─ supabase.auth.signInWithPassword()
       └─ success → router.push('/dashboard') + router.refresh()
                    (router.refresh() revalidates all server components)
```

### Supabase Client Rules — Critical
```
lib/supabase/client.ts   →  'use client' files ONLY
lib/supabase/server.ts   →  Server Components, Server Actions, Route Handlers ONLY
```
Never mix these. Mixing causes session issues and security holes.

### Data Flow
- **Server components** fetch directly via `lib/supabase/server.ts` — no loading states, no useEffect
- **Client components** use `lib/supabase/client.ts` for mutations only (auth, form submits)
- After any auth change: always call `router.refresh()` to revalidate server component cache

### UI Layout
```
Dashboard layout (app/dashboard/layout.tsx):
  ├─ Sidebar card (md+): Dashboard, Features, Help & Support
  └─ Topbar card: ThemeToggle + UserNav (avatar dropdown)
       └─ UserNav dropdown: Profile, Settings, Billing, Sign out
            ├─ Billing → /dashboard/settings?tab=billing
            ├─ Profile → /dashboard/profile
            └─ Settings → /dashboard/settings

Settings page (/dashboard/settings):
  └─ URL-driven tabs (?tab= parameter)
       ├─ Account (default)
       ├─ Billing (Stripe portal or "not configured" if no key)
       ├─ Notifications
       └─ Danger zone (delete account)
```

**Important:** Profile, Settings, and Billing are accessed ONLY via the avatar dropdown. They are NOT in the sidebar.

---

## Database

Schema: `supabase/migrations/20240101000000_initial_schema.sql`

```sql
-- profiles: extends auth.users 1:1
-- auto-created on signup via trigger
profiles (
  id uuid  PRIMARY KEY → auth.users.id
  email text
  full_name text
  avatar_url text
  created_at / updated_at timestamptz
)
-- RLS: users can only SELECT/UPDATE their own row
```

**Adding a table:** Always create a new migration file:
```
supabase/migrations/YYYYMMDDHHMMSS_description.sql
```
Always: `alter table X enable row level security;` + at least one policy.

**Apply migrations:**
```bash
npx supabase db push   # against production (uses SUPABASE_ACCESS_TOKEN)
```

---

## Available Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run summarize` | Stream AI summary of the repo (needs `ANTHROPIC_API_KEY`) |
| `npm run bootstrap <name>` | Spin up new GitHub + Supabase + Vercel project in one command |
| `npm run db:types` | Regenerate `types/database.types.ts` from Supabase schema |
| `npm run db:push` | Push migrations to production Supabase |

### Bootstrap Script
```bash
npm run bootstrap my-new-app
# Creates: GitHub repo → Supabase project (waits for ACTIVE_HEALTHY) → Vercel project
# Injects all env vars automatically
# Writes ready .env.local for the new project
```

---

## Setup From Scratch

```bash
# 1. Clone
git clone https://github.com/0xArx/the-base.git && cd the-base

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Fill in every value in .env.local

# 4. Apply DB migrations
npx supabase db push   # uses SUPABASE_ACCESS_TOKEN

# 5. Dev server
npm run dev           # http://localhost:3000
```

---

## Deployment Pipeline

```
git push origin main
  └─ Vercel auto-deploys to https://the-base-0xarx.vercel.app
     └─ Preview URL created for every branch push

Env vars on Vercel:
  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
  via Vercel dashboard or API — never hardcode in source.
```

---

## Adding Features — Standard Pattern

### New protected page (server, preferred)
```typescript
// app/dashboard/my-feature/page.tsx
import { createClient } from '@/lib/supabase/server'
import { config } from '@/lib/config'

export default async function MyFeaturePage() {
  const supabase = await createClient()
  const { data } = await supabase.from('my_table').select('*')
  return <div>{/* render data directly */}</div>
}
```

### New client interaction (mutations, real-time)
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
// use for: form submits, real-time subscriptions, auth mutations
```

### New UI component
```bash
npx shadcn@latest add <component-name>
# imports from @/components/ui/<name>
```

### New database table
```sql
-- supabase/migrations/YYYYMMDDHHMMSS_add_X.sql
create table public.X (...);
alter table public.X enable row level security;
create policy "..." on public.X for select using (auth.uid() = user_id);
```

### Conditional feature (integration)
```typescript
import { config } from '@/lib/config'

// Only render billing UI if Stripe is configured
if (config.features.billing) {
  // show billing UI
}
```

---

## Skills to Use in This Repo

| Task | Use |
|------|-----|
| React/Next.js code | `vercel-react-best-practices` |
| Component architecture | `vercel-composition-patterns` |
| UI / layout / accessibility | `web-design-guidelines` |
| Deployment | `deploy-to-vercel` |
| Supabase schema / RLS | `supabase-postgres-best-practices` |
| Next.js App Router patterns | `nextjs-app-router-patterns` |
| shadcn components | `shadcn` |
| After writing code | `code-reviewer` (auto-delegated) |
| After implementing features | `test-writer` (auto-delegated) |
| Git commits, PRs | `git-manager` (auto-delegated) |
| Deploy | `deployer` (auto-delegated) |
| Project summary | `the-base` (this skill) → `npm run summarize` |

---

## Key Files Quick Reference

| File | Role |
|------|------|
| `lib/config.ts` | **Central source of truth** — all branding, URLs, feature flags |
| `middleware.ts` | Auth guard + rate limiting — all route protection lives here |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client (cookies-aware) |
| `lib/email.ts` | Resend wrapper — no-ops if `RESEND_API_KEY` not set |
| `lib/stripe.ts` | Stripe client — `isStripeEnabled` flag + helpers |
| `lib/rate-limit.ts` | Rate limiter — in-memory fallback, Redis when configured |
| `app/page.tsx` | Landing page |
| `app/(auth)/layout.tsx` | Two-column auth layout (dark brand panel + form) |
| `app/(auth)/login/page.tsx` | Login form |
| `app/(auth)/signup/page.tsx` | Signup form |
| `app/dashboard/layout.tsx` | Dashboard shell: sidebar + topbar |
| `app/dashboard/page.tsx` | Dashboard home |
| `app/dashboard/settings/page.tsx` | Settings with URL-driven tabs |
| `app/dashboard/profile/page.tsx` | Profile page |
| `components/user-nav.tsx` | Avatar dropdown: Profile, Settings, Billing, Sign out |
| `components/sidebar-nav.tsx` | Sidebar links: Dashboard, Features, Help & Support |
| `components/logout-button.tsx` | Client sign-out |
| `scripts/summarize.ts` | AI project summary (streams from claude-opus-4-6) |
| `scripts/bootstrap.ts` | One-command new project spinner |
| `supabase/migrations/` | All schema changes — always add new files here |
| `.env.example` | Full env var reference |
| `PLAYBOOK.md` | Developer guide (long form) |
| `CLAUDE.md` | Claude Code guidance |

---

## Performance Rules (always apply)

- Fetch in **server components** — eliminates client-side waterfalls
- **`Promise.all()`** for parallel fetches — never `await` sequentially
- **Direct imports** only — no barrel re-exports (`import { Button } from '@/components/ui/button'`)
- **`next/dynamic`** for heavy client components (editors, charts, maps)
- **`router.refresh()`** after auth changes — not `window.location.reload()`

---

## Live AI Summary

To get a freshly generated, Claude-powered summary of the current state of this repo:

```bash
npm run summarize
```

Reads all key files at runtime and streams a structured onboarding document
using `claude-opus-4-6` with adaptive thinking. Requires `ANTHROPIC_API_KEY` in `.env.local`.
