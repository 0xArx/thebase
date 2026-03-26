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
 * Requires: ANTHROPIC_API_KEY in environment (or .env.local)
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(import.meta.dirname, '..')

function readFile(rel: string): string {
  const full = path.join(ROOT, rel)
  try {
    return fs.readFileSync(full, 'utf-8')
  } catch {
    return `[file not found: ${rel}]`
  }
}

function dirTree(dir: string, depth = 0, maxDepth = 2): string {
  if (depth > maxDepth) return ''
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries
    .filter((e) => !['node_modules', '.git', '.next', '.claude'].includes(e.name))
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
    console.error('Add it to your environment or to .env.local and re-run.')
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

### package.json
${readFile('package.json')}

### middleware.ts
${readFile('middleware.ts')}

### lib/supabase/client.ts
${readFile('lib/supabase/client.ts')}

### lib/supabase/server.ts
${readFile('lib/supabase/server.ts')}

### app/page.tsx (landing)
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
5. How to set it up locally (env vars, migrations, dev server)
6. The deployment pipeline
7. The exact next steps a new developer should take to add their first feature

Write in markdown. Be concise but complete. Use headers, bullet points, and code blocks where useful.
Do not include the raw file contents — synthesize them into clear explanations.`,
    messages: [
      {
        role: 'user',
        content: `Here is the complete The Base project. Generate a thorough onboarding summary:\n\n${context}`,
      },
    ],
  })

  // Stream text deltas — skip thinking blocks
  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      process.stdout.write(event.delta.text)
    }
  }

  const final = await stream.finalMessage()
  const inputTokens = final.usage.input_tokens
  const outputTokens = final.usage.output_tokens

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  Tokens: ${inputTokens.toLocaleString()} in · ${outputTokens.toLocaleString()} out`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
