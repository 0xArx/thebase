# The Base — Skill

> Load this skill at the start of any coding session in this repo.
> It gives you complete context, architecture, conventions, and agentic access
> without reading a single file manually.

---

## What This Repo Is

**The Base** is a production-ready startup template — a one-command foundation
for any new product. It ships with authentication, a database, a UI system,
and a live deployment, all wired together and ready to fork.

**Live URL:** https://the-base-0xarx.vercel.app
**GitHub:** https://github.com/0xArx/the-base (private)

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | Server components, file routing, streaming |
| UI | shadcn/ui + Tailwind v4 | Accessible, owned components — no black-box lib |
| Auth + DB | Supabase (Postgres + Auth) | Full Postgres with RLS, real-time, self-hostable |
| Hosting | Vercel | Zero-config deploys, edge network, preview URLs |
| Language | TypeScript (strict) | End-to-end type safety |
| AI Scripts | Anthropic SDK (`claude-opus-4-6`) | In-repo intelligence, adaptive thinking |

---

## Environment Variables — Complete Picture

All credentials live in `.env.local` (gitignored). The template is `.env.example`.
The file is split into groups — here's what each group unlocks agentically:

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

### Anthropic
| Variable | Purpose | Agentic Use |
|----------|---------|------------|
| `ANTHROPIC_API_KEY` | Claude API | `npm run summarize`, in-app AI features |

---

## App Architecture

### Route Map
```
/                          → app/page.tsx           — public landing page
/login                     → app/(auth)/login/       — email/password sign-in
/signup                    → app/(auth)/signup/      — account creation
/dashboard                 → app/dashboard/          — protected user area
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
npx supabase login    # uses SUPABASE_ACCESS_TOKEN
npx supabase db push

# 5. Dev server
npm run dev           # http://localhost:3000
```

---

## Deployment Pipeline

```
git push origin main
  └─ Vercel auto-deploys to https://the-base-0xarx.vercel.app
     └─ Preview URL created for every branch push

Manual deploy:
  curl -X POST https://api.vercel.com/v13/deployments \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -d '{"name":"the-base","gitSource":{"type":"github","ref":"main"}}'

Env vars on Vercel:
  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
  via Vercel dashboard or API — never hardcode in source.
```

---

## Available Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run summarize` | Stream AI summary of the repo (needs `ANTHROPIC_API_KEY`) |

---

## Adding Features — Standard Pattern

### New protected page (server, preferred)
```typescript
// app/dashboard/my-feature/page.tsx
import { createClient } from '@/lib/supabase/server'

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

---

## Skills to Use in This Repo

| Task | Use |
|------|-----|
| React/Next.js code | `vercel-react-best-practices` |
| Component architecture | `vercel-composition-patterns` |
| UI / layout / accessibility | `web-design-guidelines` |
| After writing code | `code-reviewer` (auto-delegated) |
| After implementing features | `test-writer` (auto-delegated) |
| Git commits, PRs | `git-manager` (auto-delegated) |
| Deploy | `deployer` (auto-delegated) |
| Project summary | `the-base` (this skill) → `npm run summarize` |

---

## Key Files Quick Reference

| File | Role |
|------|------|
| `middleware.ts` | Auth guard — all route protection lives here |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client (cookies-aware) |
| `app/page.tsx` | Landing page |
| `app/(auth)/login/page.tsx` | Login form |
| `app/(auth)/signup/page.tsx` | Signup form |
| `app/dashboard/layout.tsx` | Server-side auth check for dashboard |
| `app/dashboard/page.tsx` | Dashboard home |
| `components/logout-button.tsx` | Client sign-out |
| `supabase/migrations/` | All schema changes |
| `.env.example` | Full env var reference |
| `scripts/summarize.ts` | AI project summary script |
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
