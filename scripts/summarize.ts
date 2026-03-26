/**
 * summarize.ts
 *
 * Reads the project's key files and calls Claude (claude-opus-4-6) to produce
 * a rich, structured summary of The Base — what it is, how it's built, and
 * how to start building on top of it.
 *
 * Usage:
 *   npx tsx scripts/summarize.ts
 *   npm run summarize
 *
 * Requires: ANTHROPIC_API_KEY — loaded automatically from .env.local
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')

// Auto-load .env.local (Next.js convention — never committed)
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  try {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim()
      if (key && !(key in process.env)) {
        process.env[key] = value
      }
    }
  } catch {
    // .env.local not found — rely on shell environment
  }
}

loadEnv()

function readFile(rel: string): string {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf-8')
  } catch {
    return `[not found: ${rel}]`
  }
}

function dirTree(dir: string, depth = 0, maxDepth = 2): string {
  if (depth > maxDepth) return ''
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return ''
  }
  const skip = new Set(['node_modules', '.git', '.next', '.claude'])
  return entries
    .filter((e) => !skip.has(e.name))
    .map((e) => {
      const indent = '  '.repeat(depth)
      if (e.isDirectory()) {
        return `${indent}${e.name}/\n${dirTree(path.join(dir, e.name), depth + 1, maxDepth)}`
      }
      return `${indent}${e.name}`
    })
    .join('\n')
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY is not set.')
    console.error('Add it to .env.local:\n  ANTHROPIC_API_KEY=sk-ant-...')
    process.exit(1)
  }

  const client = new Anthropic({ apiKey })

  const context = `
## Project: The Base

### Directory Structure
\`\`\`
${dirTree(ROOT)}
\`\`\`

### CLAUDE.md
${readFile('CLAUDE.md')}

### PLAYBOOK.md
${readFile('PLAYBOOK.md')}

### .env.example
${readFile('.env.example')}

### package.json
${readFile('package.json')}

### middleware.ts
${readFile('middleware.ts')}

### lib/supabase/client.ts
${readFile('lib/supabase/client.ts')}

### lib/supabase/server.ts
${readFile('lib/supabase/server.ts')}

### app/page.tsx
${readFile('app/page.tsx')}

### app/(auth)/login/page.tsx
${readFile('app/(auth)/login/page.tsx')}

### app/dashboard/page.tsx
${readFile('app/dashboard/page.tsx')}

### supabase/migrations/20240101000000_initial_schema.sql
${readFile('supabase/migrations/20240101000000_initial_schema.sql')}
`.trim()

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  THE BASE — Project Summary')
  console.log('  Powered by Claude Opus 4.6')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    thinking: { type: 'adaptive' },
    system: `You are a senior engineer giving a complete onboarding summary of a startup codebase.
Your summary should be structured, precise, and actionable — covering:
1. What the project is and its purpose
2. The complete tech stack and why each piece was chosen
3. The app architecture (routes, auth flow, data flow)
4. The database schema and security model
5. Environment variables — what each group controls and why the admin tokens matter
6. How to set it up locally (env vars, migrations, dev server)
7. The deployment pipeline
8. The exact next steps a new developer should take to add their first feature

Write in markdown. Be concise but complete. Use headers, bullet points, and code blocks.
Do not repeat raw file contents — synthesize them into clear explanations.`,
    messages: [
      {
        role: 'user',
        content: `Here is the complete The Base project. Generate a thorough onboarding summary:\n\n${context}`,
      },
    ],
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      process.stdout.write(event.delta.text)
    }
  }

  const final = await stream.finalMessage()
  console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`  ${final.usage.input_tokens.toLocaleString()} in · ${final.usage.output_tokens.toLocaleString()} out tokens`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
