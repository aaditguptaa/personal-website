# Aadit Gupta — Portfolio 🎮

A gamified personal portfolio with an RPG/arcade theme — neon HUD, animated grid background, quest-log timeline, a skill tree, achievement toasts, a hidden Konami-code easter egg, and an AI chatbot ("Ask the Guide") powered by Claude.

Built with **Next.js 15** (App Router + Turbopack), **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start the dev server (Turbopack)             |
| `npm run build`  | Production build                             |
| `npm run start`  | Serve the production build                   |
| `npm run lint`   | Lint with Biome                             |
| `npm run format` | Format with Biome                           |

## AI Chatbot

The "Ask the Guide" chatbot ([`src/app/api/chat/route.ts`](src/app/api/chat/route.ts)) answers visitor questions about me.

- **With an API key:** set `ANTHROPIC_API_KEY` and it uses Claude (Haiku) to answer from a built-in knowledge base.
- **Without a key:** it falls back to a keyword-based responder, so the widget always works.

Both `/api/chat` and `/api/contact` are IP rate-limited to protect against abuse and runaway API costs.

## Environment Variables

Create a `.env.local` file (all optional — the site works without them):

```bash
# Enables the Claude-powered chatbot (otherwise a keyword fallback is used)
ANTHROPIC_API_KEY=sk-ant-...

# Enables server-side contact emails via Resend (otherwise the form opens the
# visitor's mail client via mailto)
RESEND_API_KEY=re_...
CONTACT_FROM="Portfolio <onboarding@resend.dev>"   # use a verified domain in prod

# Your deployed URL — used for canonical links, OG tags, sitemap & robots
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Analytics & Observability

Two layers of tracking:

- **Visitor traffic** — [Vercel Web Analytics](https://vercel.com/docs/analytics) (`<Analytics />` in the root layout). Cookie-free; shows referrers/sources, countries, and top pages. **Enable "Web Analytics" in the Vercel project dashboard** to start collecting (it's a no-op locally).
- **API request origins** — `/api/chat` and `/api/contact` log a JSON line per request (IP, country/region/city, referrer, user-agent, timestamp) via [`src/app/lib/requestInfo.ts`](src/app/lib/requestInfo.ts). Geo fields populate from Vercel's `x-vercel-ip-*` headers. View/filter them in the Vercel **Logs** tab; add a **Log Drain** (Axiom/Logtail/Datadog) for durable, queryable history. Both routes are also IP rate-limited.

## Project Structure

```
src/app/
├── layout.tsx            # Root layout, fonts, metadata
├── page.tsx              # Home page (assembles all sections)
├── globals.css           # Tailwind + global imports
├── style.css             # Gamified design system (tokens, animations)
├── api/chat/route.ts     # Chatbot API (Claude + fallback)
├── components/           # Header, Home, About, Education, Projects,
│                         #   Skills, Contact, Footer, Background, GameEffects
└── projects/ESP/         # Camera Strap Redesign detail page

public/
├── documents/            # Résumé + project PDFs
└── *.png / *.svg         # Images & icons
```

## Customization

- **Social links:** `SOCIAL` in [`src/app/components/Home.tsx`](src/app/components/Home.tsx)
- **Experience & education:** [`src/app/components/Education.tsx`](src/app/components/Education.tsx)
- **Projects/Missions:** [`src/app/components/Projects.tsx`](src/app/components/Projects.tsx)
- **Skills:** [`src/app/components/SkillsSection.tsx`](src/app/components/SkillsSection.tsx)
- **Chatbot knowledge base:** `SYSTEM_PROMPT` in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts)
- **Theme (colors, fonts, effects):** CSS variables at the top of [`src/app/style.css`](src/app/style.css)

> Easter egg: try the Konami code — ↑ ↑ ↓ ↓ ← → ← → B A 🕹️

## Deploy

Deploy on [Vercel](https://vercel.com/new). Add `ANTHROPIC_API_KEY` as an environment variable to enable the Claude-powered chatbot.
