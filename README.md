# Mission Control

A dopamine-inducing operating system for orchestrating Claude and your AI agents — a local, gorgeous command center built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

![status](https://img.shields.io/badge/status-online-34d399) ![stack](https://img.shields.io/badge/next.js-16-000) ![ui](https://img.shields.io/badge/framer--motion-animated-a855f7)

## What's inside

- **Command Deck** — live mission overview with animated metric cards and sparklines
- **Agent Fleet** — controllable agent cards (pause / resume / boost) with real-time load telemetry
- **Constellation** — an orbital visualization of agents circling the Claude core
- **Mission Queue** — animated task progress with per-agent assignment
- **Signal Feed** — a streaming activity log
- **System Telemetry** — radial gauges for cohesion, throughput, latency, and context
- **Command Palette** — press `⌘K` / `Ctrl+K` to dispatch missions to the fleet

The dashboard runs a live simulation engine (`src/lib/store.tsx`) so everything animates and reacts out of the box. It is structured so the mock layer can be swapped for a real backend wired to your Claude account.

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build && npm run start
```

## Project map

```
src/
  app/            App Router entry, global theme
  components/     Dashboard, agent grid, orbit, palette, telemetry…
  lib/            types, seed data, live simulation store, theme tokens
```
