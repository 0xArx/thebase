# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: The Base

A production-ready startup template built on Next.js, Supabase, shadcn/ui, and Vercel.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project API keys

## Architecture

**App Router structure:**
- `app/page.tsx` — Public landing page
- `app/(auth)/login/` and `app/(auth)/signup/` — Auth forms (client components, centered card UI)
- `app/dashboard/` — Protected area (server components, checks auth server-side)
- `middleware.ts` — Auth guard: redirects unauthenticated users from `/dashboard`, redirects logged-in users from `/login` and `/signup`

**Supabase clients — use the right one:**
- `lib/supabase/client.ts` — Browser/client components only (`'use client'` files)
- `lib/supabase/server.ts` — Server components, Server Actions, Route Handlers only

**Data flow:**
- Server components fetch data directly via `lib/supabase/server.ts` (no useEffect, no loading states)
- Client components use `lib/supabase/client.ts` for mutations (auth sign-in/out, form submissions)
- Auth state changes call `router.refresh()` to revalidate server component data

## Database

Schema lives in `supabase/migrations/`. The `profiles` table auto-populates from `auth.users` via trigger on signup. Apply migrations via Supabase CLI:
```bash
npx supabase db push
```

## UI Components

shadcn/ui components are in `components/ui/`. Add new ones with:
```bash
npx shadcn@latest add <component-name>
```

## Deployment

Hosted on Vercel. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard. Every push to `main` triggers a production deploy.
