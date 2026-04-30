# Decide — Decision Intelligence Platform for Swiggy

> Stop scrolling. Start deciding.

A smart ordering platform built on top of Swiggy's Food, Instamart, and Dineout APIs. Seven specialized ordering tools that eliminate food decision fatigue — for solo users, groups, tight budgets, and beyond.

**Live demo:** https://decide-9akd07afs-abhishekkumargupta-coders-projects.vercel.app

---

## What it does

Most people spend 10–15 minutes deciding what to order. Decide fixes that.

You describe your situation in plain language — "I'm hungry and broke" or "we are 5 friends and can't agree" — and the platform instantly routes you to the right ordering tool, fills in context from your history, and gives you one decisive recommendation. No lists. No scrolling. Just a decision.

---

## 7 Ordering Agents

| Agent | Purpose |
|---|---|
| ⚡ Solo Decision | One decisive recommendation based on mood, hunger, budget |
| 👥 Group Decision | Consensus finder for 2–8 people with automatic bill split |
| 💰 Budget Survival | Maximum value meal within a strict budget |
| 🔄 Reorder Intelligence | Pattern detection + smarter upgrade suggestions |
| 🧩 Smart Combo Builder | Perfect multi-item combo for any occasion |
| 😬 Regret Minimization | Predicts post-order regret with ORDER IT / PIVOT verdict |
| 🎯 Instant Decision | 5-word food decision from a single word input |

---

## How it works

```
User types "we are 5 friends"
       ↓
Intent Router (detects group intent)
       ↓
Group Decision Agent opens automatically
       ↓
User fills preferences + shared budget
       ↓
Agent returns one consensus order + bill split
       ↓
"Order now on Swiggy" CTA
```

### Agent chaining
- Solo Decision with low confidence → automatically triggers Regret check
- Regret agent returns PIVOT → automatically suggests Instant alternative

### Shared context
- City, budget, dietary preference auto-fills across agents
- Decision history feeds Reorder and Regret agents automatically

---

## Tech stack

- **Framework:** React + Vite
- **Styling:** Custom CSS with Swiggy-native design tokens
- **AI:** Gemma 4 31B via Google AI Studio API (via backend proxy)
- **Deployment:** Vercel
- **Backend:** Node.js + Express on Railway

---

## Architecture

```
User (Browser)
     ↓
React Frontend (Vercel)
     ↓
Express Backend (Railway)  ← API key lives here, never exposed
     ↓
Google AI Studio (Gemma 4 31B)
     ↓
Swiggy MCP APIs (Food · Instamart · Dineout)  ← coming with Builders Club access
```

---

## Project structure

```
src/
├── agents/
│   ├── soloAgent.js
│   ├── groupAgent.js
│   ├── budgetAgent.js
│   ├── reorderAgent.js
│   ├── comboAgent.js
│   ├── regretAgent.js
│   ├── instantAgent.js
│   └── registry.js          ← central agent registry
├── components/
│   ├── Header.jsx
│   ├── AgentCard.jsx
│   ├── AgentModal.jsx
│   └── ResultDisplay.jsx
├── services/
│   ├── gemini.js            ← backend API caller
│   ├── intentRouter.js      ← auto-routes natural language to right agent
│   ├── agentPipeline.js     ← chains agents together
│   └── userContext.js       ← shared state across all agents
└── App.jsx
```

---

## Running locally

```bash
git clone https://github.com/AbhishekkumarGupta-coder/decide
cd decide
npm install
```

Create `.env`:
```
VITE_BACKEND_URL=http://localhost:3001
```

```bash
npm run dev
```

Open `http://localhost:5173`

> You'll also need the backend running locally — see [decide-backend](https://github.com/AbhishekkumarGupta-coder/decide-backend-)

---

## Roadmap

- [ ] Connect to Swiggy MCP APIs for real order placement
- [ ] Voice input via Web Speech API
- [ ] Persistent order history across sessions
- [ ] WhatsApp share for group decisions
- [ ] Google Calendar context for smarter timing decisions
- [ ] Mobile app (React Native)

---

## Built for

**Swiggy Builders Club** — MCP Partnership Program  
`mcp.swiggy.com/builders`

---

## Contact

Abhishek Kumar Gupta  
abhishekkumargupta5557@gmail.com  
github.com/AbhishekkumarGupta-coder
