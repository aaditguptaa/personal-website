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

- **With an API key:** set `ANTHROPIC_API_KEY` and it uses Claude to answer from a built-in knowledge base.
- **Without a key:** it falls back to a keyword-based responder, so the widget always works.

To enable Claude, create a `.env.local` file:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

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
