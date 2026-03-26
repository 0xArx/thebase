# Skills — The Base

All skills used in this project. Run the install commands below before working in any new agent or environment.

## Install All

```bash
# Vercel Labs skills
npx skills add vercel-labs/vercel-react-best-practices --yes --global
npx skills add vercel-labs/vercel-composition-patterns --yes --global
npx skills add vercel-labs/web-design-guidelines --yes --global
npx skills add vercel-labs/vercel-react-native-skills --yes --global

# Anthropic skills
npx skills add https://github.com/anthropics/skills --skill theme-factory --yes --global
npx skills add https://github.com/anthropics/skills --skill find-skills --yes --global
npx skills add https://github.com/anthropics/skills --skill qa --yes --global
npx skills add https://github.com/anthropics/skills --skill browse --yes --global
npx skills add https://github.com/anthropics/skills --skill gstack --yes --global
npx skills add https://github.com/anthropics/skills --skill next-best-practices --yes --global
npx skills add https://github.com/anthropics/skills --skill design-review --yes --global
npx skills add https://github.com/anthropics/skills --skill ship --yes --global
```

---

## Skills Reference

### Code Quality & Architecture

| Skill | Repo | What it does |
|-------|------|--------------|
| `vercel-react-best-practices` | [vercel-labs/vercel-react-best-practices](https://github.com/vercel-labs/vercel-react-best-practices) | 58 React/Next.js performance rules — waterfalls, bundle size, re-renders, memoization |
| `vercel-composition-patterns` | [vercel-labs/vercel-composition-patterns](https://github.com/vercel-labs/vercel-composition-patterns) | React component composition patterns — slots, compound components, render props |
| `next-best-practices` | [anthropics/skills](https://github.com/anthropics/skills) | Next.js App Router conventions — RSC boundaries, async APIs, metadata, route handlers |

### UI & Design

| Skill | Repo | What it does |
|-------|------|--------------|
| `web-design-guidelines` | [vercel-labs/web-design-guidelines](https://github.com/vercel-labs/web-design-guidelines) | Audits UI code against accessibility, focus, forms, animation, and typography rules |
| `theme-factory` | [anthropics/skills](https://github.com/anthropics/skills) | Applies a design theme (colors, fonts) to any artifact — slides, docs, landing pages |
| `design-review` | [anthropics/skills](https://github.com/anthropics/skills) | Designer's eye QA — finds visual inconsistency, spacing issues, AI slop patterns |
| `vercel-react-native-skills` | [vercel-labs/vercel-react-native-skills](https://github.com/vercel-labs/vercel-react-native-skills) | React Native and Expo best practices for mobile apps |

### Testing & QA

| Skill | Repo | What it does |
|-------|------|--------------|
| `qa` | [anthropics/skills](https://github.com/anthropics/skills) | Systematically QA tests a web app, finds bugs, and fixes them with atomic commits |
| `browse` | [anthropics/skills](https://github.com/anthropics/skills) | Headless browser for QA — navigate, interact, verify state, take screenshots |
| `gstack` | [anthropics/skills](https://github.com/anthropics/skills) | AI engineering workflow — CEO review, eng review, design review, QA lead roles |

### Workflow & Shipping

| Skill | Repo | What it does |
|-------|------|--------------|
| `ship` | [anthropics/skills](https://github.com/anthropics/skills) | Full ship workflow — tests, diff review, version bump, changelog, PR creation |
| `find-skills` | [anthropics/skills](https://github.com/anthropics/skills) | Discovers and installs new skills when you need a capability you don't have |
