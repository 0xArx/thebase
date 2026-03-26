#!/usr/bin/env node
/**
 * bootstrap.ts
 *
 * Spins up a complete new project from The Base template in one command:
 *   npm run bootstrap <project-name>
 *
 * What it does:
 *   1. Creates a private GitHub repo (from this template)
 *   2. Creates a Supabase project + waits until healthy
 *   3. Creates a Vercel project linked to GitHub + injects env vars
 *   4. Writes a ready .env.local for the new project
 *   5. Prints the live URL
 *
 * Reads credentials from .env.local (master credentials).
 */

import fs from 'fs'
import path from 'path'
import https from 'https'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')

// ── Load .env.local ────────────────────────────────────────────
function loadEnv() {
  try {
    const lines = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf-8').split('\n')
    for (const line of lines) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const k = t.slice(0, eq).trim()
      const v = t.slice(eq + 1).trim()
      if (k && !(k in process.env)) process.env[k] = v
    }
  } catch {}
}
loadEnv()

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  SUPABASE_ACCESS_TOKEN,
  SUPABASE_ORG_ID,
  VERCEL_TOKEN,
  VERCEL_TEAM_ID,
} = process.env

// ── Helpers ────────────────────────────────────────────────────
async function api(
  hostname: string,
  path: string,
  method = 'GET',
  body?: object,
  headers: Record<string, string> = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined
    const req = https.request(
      {
        hostname,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...headers,
        },
      },
      (res) => {
        let raw = ''
        res.on('data', (c: Buffer) => (raw += c))
        res.on('end', () => {
          try { resolve(JSON.parse(raw)) }
          catch { resolve(raw) }
        })
      }
    )
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

function githubHeaders() {
  return { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'the-base-bootstrap' }
}
function supabaseHeaders() {
  return { Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}` }
}
function vercelHeaders() {
  return { Authorization: `Bearer ${VERCEL_TOKEN}` }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function generatePassword(len = 20): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  let pw = ''
  for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)]
  return pw
}

// ── Step 1: GitHub repo ────────────────────────────────────────
async function createGitHubRepo(name: string) {
  console.log(`\n[1/4] Creating GitHub repo: ${GITHUB_OWNER}/${name}`)
  const res = await api(
    'api.github.com',
    '/user/repos',
    'POST',
    { name, private: true, description: `${name} — built on The Base`, auto_init: false },
    githubHeaders()
  )
  if (res.full_name) {
    console.log(`      ✓ ${res.html_url}`)
    return res as { full_name: string; clone_url: string; html_url: string; id: number }
  }
  throw new Error(`GitHub repo creation failed: ${JSON.stringify(res)}`)
}

// ── Step 2: Supabase project ───────────────────────────────────
async function createSupabaseProject(name: string, dbPassword: string) {
  console.log(`\n[2/4] Creating Supabase project: ${name}`)
  const res = await api(
    'api.supabase.com',
    '/v1/projects',
    'POST',
    { name, organization_id: SUPABASE_ORG_ID, plan: 'free', region: 'us-east-1', db_pass: dbPassword },
    supabaseHeaders()
  )
  if (!res.id) throw new Error(`Supabase project creation failed: ${JSON.stringify(res)}`)
  const ref = res.id as string
  console.log(`      Project ref: ${ref}`)
  console.log('      Waiting for database to be ready (this takes ~60s)...')

  // Poll until ACTIVE_HEALTHY
  for (let i = 0; i < 40; i++) {
    await sleep(5000)
    const status = await api('api.supabase.com', `/v1/projects/${ref}`, 'GET', undefined, supabaseHeaders())
    process.stdout.write('.')
    if (status.status === 'ACTIVE_HEALTHY') {
      console.log(' ready!')
      break
    }
    if (i === 39) throw new Error('Supabase project timed out waiting to become healthy')
  }

  // Get API keys
  const keys = await api('api.supabase.com', `/v1/projects/${ref}/api-keys`, 'GET', undefined, supabaseHeaders())
  const anon = keys.find((k: any) => k.name === 'anon')?.api_key
  const service = keys.find((k: any) => k.name === 'service_role')?.api_key
  const url = `https://${ref}.supabase.co`
  console.log(`      ✓ ${url}`)
  return { ref, url, anon, service, dbPassword }
}

// ── Step 3: Vercel project ─────────────────────────────────────
async function createVercelProject(
  name: string,
  githubRepo: string,
  supabase: Awaited<ReturnType<typeof createSupabaseProject>>,
  appUrl: string
) {
  console.log(`\n[3/4] Creating Vercel project: ${name}`)
  const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''

  // Create project
  const proj = await api(
    'api.vercel.com',
    `/v10/projects${teamQuery}`,
    'POST',
    {
      name,
      framework: 'nextjs',
      gitRepository: { type: 'github', repo: githubRepo },
      environmentVariables: [
        { key: 'NEXT_PUBLIC_APP_URL', value: appUrl, type: 'plain', target: ['production', 'preview'] },
        { key: 'NEXT_PUBLIC_APP_NAME', value: name, type: 'plain', target: ['production', 'preview'] },
        { key: 'NEXT_PUBLIC_SUPABASE_URL', value: supabase.url, type: 'plain', target: ['production', 'preview', 'development'] },
        { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: supabase.anon, type: 'plain', target: ['production', 'preview', 'development'] },
        { key: 'SUPABASE_SERVICE_ROLE_KEY', value: supabase.service, type: 'encrypted', target: ['production', 'preview', 'development'] },
        { key: 'SUPABASE_PROJECT_REF', value: supabase.ref, type: 'plain', target: ['production', 'preview', 'development'] },
        { key: 'DATABASE_URL', value: `postgresql://postgres:${supabase.dbPassword}@db.${supabase.ref}.supabase.co:5432/postgres`, type: 'encrypted', target: ['production', 'preview', 'development'] },
      ],
    },
    vercelHeaders()
  )

  if (!proj.id) throw new Error(`Vercel project creation failed: ${JSON.stringify(proj)}`)
  console.log(`      ✓ Project ID: ${proj.id}`)

  // Trigger deploy
  const deploy = await api(
    'api.vercel.com',
    `/v13/deployments${teamQuery}`,
    'POST',
    { name, gitSource: { type: 'github', repoId: String(proj.link?.repoId ?? ''), ref: 'main' } },
    vercelHeaders()
  )

  const liveUrl = `https://${name}-${(GITHUB_OWNER || '').toLowerCase()}.vercel.app`
  return { projectId: proj.id as string, liveUrl }
}

// ── Step 4: Write .env.local ───────────────────────────────────
function writeEnvLocal(
  projectName: string,
  supabase: Awaited<ReturnType<typeof createSupabaseProject>>,
  vercel: Awaited<ReturnType<typeof createVercelProject>>,
  githubRepo: string,
  githubUrl: string
) {
  const envPath = path.join(ROOT, '..', projectName, '.env.local')
  const dir = path.dirname(envPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const content = `# Auto-generated by The Base bootstrap
# Project: ${projectName}  |  Generated: ${new Date().toISOString()}

# ── APP
NEXT_PUBLIC_APP_URL=${vercel.liveUrl}
NEXT_PUBLIC_APP_NAME=${projectName}

# ── SUPABASE — Public
NEXT_PUBLIC_SUPABASE_URL=${supabase.url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase.anon}

# ── SUPABASE — Admin
SUPABASE_SERVICE_ROLE_KEY=${supabase.service}
SUPABASE_PROJECT_REF=${supabase.ref}
SUPABASE_ORG_ID=${SUPABASE_ORG_ID}
SUPABASE_DB_PASSWORD=${supabase.dbPassword}
DATABASE_URL=postgresql://postgres:${supabase.dbPassword}@db.${supabase.ref}.supabase.co:5432/postgres
SUPABASE_ACCESS_TOKEN=${SUPABASE_ACCESS_TOKEN}

# ── VERCEL
VERCEL_TOKEN=${VERCEL_TOKEN}
VERCEL_TEAM_ID=${VERCEL_TEAM_ID}
VERCEL_PROJECT_ID=${vercel.projectId}
VERCEL_ORG_ID=${VERCEL_TEAM_ID}

# ── GITHUB
GITHUB_TOKEN=${GITHUB_TOKEN}
GITHUB_OWNER=${GITHUB_OWNER}
GITHUB_REPO=${projectName}
GITHUB_REPO_URL=${githubUrl}

# ── ANTHROPIC
ANTHROPIC_API_KEY=${process.env.ANTHROPIC_API_KEY ?? ''}

# ── EMAIL (Resend) — add key to activate
RESEND_API_KEY=
RESEND_FROM_EMAIL=no-reply@${projectName}.com

# ── BILLING (Stripe) — add keys to activate
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# ── ERROR TRACKING (Sentry) — add DSN to activate
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

# ── OAUTH (Supabase providers) — add to activate
# Enable in: Supabase Dashboard → Auth → Providers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── RATE LIMITING (Upstash) — add to activate, in-memory used otherwise
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
`
  fs.writeFileSync(envPath, content)
  console.log(`\n[4/4] Written: ${envPath}`)
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  const projectName = process.argv[2]
  if (!projectName) {
    console.error('Usage: npm run bootstrap <project-name>')
    console.error('Example: npm run bootstrap my-saas')
    process.exit(1)
  }
  if (!/^[a-z0-9-]+$/.test(projectName)) {
    console.error('Project name must be lowercase letters, numbers, and hyphens only')
    process.exit(1)
  }

  const missing = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'SUPABASE_ACCESS_TOKEN', 'SUPABASE_ORG_ID', 'VERCEL_TOKEN', 'VERCEL_TEAM_ID']
    .filter((k) => !process.env[k])
  if (missing.length) {
    console.error(`Missing required env vars in .env.local:\n  ${missing.join('\n  ')}`)
    process.exit(1)
  }

  console.log(`\n╔════════════════════════════════════════════╗`)
  console.log(`║  The Base Bootstrap: ${projectName.padEnd(21)}║`)
  console.log(`╚════════════════════════════════════════════╝`)

  const dbPassword = generatePassword()

  try {
    const github = await createGitHubRepo(projectName)
    const supabase = await createSupabaseProject(projectName, dbPassword)
    const appUrl = `https://${projectName}-${(GITHUB_OWNER || '').toLowerCase()}.vercel.app`
    const vercel = await createVercelProject(projectName, github.full_name, supabase, appUrl)
    writeEnvLocal(projectName, supabase, vercel, github.full_name, github.html_url)

    console.log(`\n╔════════════════════════════════════════════════════════════╗`)
    console.log(`║  Bootstrap complete!                                       ║`)
    console.log(`║                                                            ║`)
    console.log(`║  GitHub:    ${github.html_url.padEnd(47)}║`)
    console.log(`║  Supabase:  ${('https://app.supabase.com/project/' + supabase.ref).padEnd(47)}║`)
    console.log(`║  Live URL:  ${vercel.liveUrl.padEnd(47)}║`)
    console.log(`║                                                            ║`)
    console.log(`║  Next: cd ../${projectName} && cp .env.local .env.local    ║`)
    console.log(`║        npm install && npm run dev                          ║`)
    console.log(`╚════════════════════════════════════════════════════════════╝\n`)
  } catch (err) {
    console.error('\nBootstrap failed:', err)
    process.exit(1)
  }
}

main()
