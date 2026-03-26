# Summarize — The Base

Generates a complete, AI-powered onboarding summary of The Base project by reading
all key source files and passing them to Claude Opus 4.6 (with adaptive thinking).

## What it does

Reads: `CLAUDE.md`, `PLAYBOOK.md`, `package.json`, `middleware.ts`,
`lib/supabase/`, `app/page.tsx`, `app/(auth)/login/page.tsx`,
`app/dashboard/page.tsx`, and the Supabase migration — then streams a structured
summary covering:

- Project purpose and overview
- Full tech stack with rationale
- App architecture (routes, auth flow, data flow)
- Database schema and RLS security model
- Local setup (env vars, migrations, dev server)
- Deployment pipeline
- Exact next steps for adding the first feature

## When to use

- Onboarding a new developer to The Base
- Quickly re-orienting after time away from the project
- Generating documentation or a README section
- Checking that the project is coherent before a major change

## How to invoke

Run the skill:

```bash
npm run summarize
```

Or directly:

```bash
npx tsx scripts/summarize.ts
```

## Prerequisites

`ANTHROPIC_API_KEY` must be set in your environment. Add it to `.env.local`
(it is gitignored) or export it in your shell:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Implementation

The skill is implemented in `scripts/summarize.ts`.

It uses:
- `@anthropic-ai/sdk` — Anthropic TypeScript SDK
- `claude-opus-4-6` with `thinking: { type: 'adaptive' }` and streaming
- `fs.readFileSync` to read project files at runtime
- Streams output directly to stdout token by token

## Extending

To add more files to the summary context, edit the `context` string in
`scripts/summarize.ts` and add another `readFile('path/to/file')` call.

To change the summary format or focus, edit the `system` prompt in the
`client.messages.stream()` call.
