# The Base — Playbook

Your guide for building on top of this template. Read this before adding any new feature.

## Stack Decisions

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | Server components, streaming, file-based routing |
| UI | shadcn/ui + Tailwind CSS | Accessible primitives, full ownership of code |
| Backend | Supabase | Postgres + Auth + Storage, self-hostable |
| Hosting | Vercel | Zero-config deploys, edge network, preview URLs |
| Language | TypeScript | End-to-end type safety |

## Skills to Use (Always Check First)

Before writing any code, check which skills apply:

| Task | Skill |
|------|-------|
| Any React/Next.js code | `vercel-react-best-practices` |
| Component architecture | `vercel-composition-patterns` |
| UI, layout, accessibility | `web-design-guidelines` |
| Post-feature implementation | `test-writer` (auto-delegated) |
| After writing/modifying code | `code-reviewer` (auto-delegated) |
| Commits, branches, PRs | `git-manager` (auto-delegated) |
| Deploying | `deployer` (auto-delegated) |
| Scraping / external data | `orthogonal-scrape` or `orthogonal-search` |
| Finding new capabilities | `find-skills` |

## Adding New Features

### 1. New Database Table
Create a migration file:
```
supabase/migrations/YYYYMMDDHHMMSS_feature_name.sql
```
Always enable RLS and write policies. Never skip Row Level Security.

### 2. New Protected Page (Server Component — preferred)
```typescript
// app/dashboard/my-feature/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function MyFeaturePage() {
  const supabase = await createClient()
  const { data } = await supabase.from('my_table').select('*')
  // render directly — no loading state needed
}
```

### 3. New Client Interaction (mutations, real-time)
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
```

### 4. New UI Component
```bash
npx shadcn@latest add <component>
```

### 5. Protecting New Routes
Extend the matcher pattern in `middleware.ts` for any new protected areas.

## Auth Flow

```
User visits /dashboard
  → middleware.ts checks Supabase session
  → Not authenticated → redirect to /login
  → Authenticated → render dashboard

User submits /login
  → supabase.auth.signInWithPassword()
  → Success → router.push('/dashboard') + router.refresh()
  → router.refresh() revalidates all server components with new session
```

## Performance Rules

- **Fetch in server components** — eliminates client waterfalls
- **Parallel fetches with Promise.all()** — never await sequentially
- **Direct imports, not barrel files** — keeps bundle small
- **Dynamic imports** — `next/dynamic` for anything heavy
- **`router.refresh()`** after auth state changes — not a full page reload

## Deployment Workflow

1. Push to `main` → Vercel auto-deploys to production
2. Push to any branch → Vercel creates a preview URL
3. Env vars live in Vercel dashboard (never commit `.env.local`)
4. Database migrations: `npx supabase db push` against your production project

## Adding OAuth (GitHub, Google, etc.)

In Supabase dashboard → Authentication → Providers, enable the provider. Then:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: { redirectTo: `${location.origin}/dashboard` }
})
```
