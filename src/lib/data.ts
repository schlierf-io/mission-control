import type { Agent, ActivityEvent, Metric } from "./types";

// Deterministic so server and client render identical sparklines (no hydration drift).
const spark = (seed: number) =>
  Array.from({ length: 24 }, (_, i) =>
    Math.round(
      50 +
        30 * Math.sin(i / 2.3 + seed) +
        16 * Math.sin(i / 1.1 + seed * 2) +
        8 * Math.sin(i / 0.7 + seed * 3)
    )
  );

export const AGENTS: Agent[] = [
  {
    id: "orchestrator",
    name: "ORCHESTRATOR",
    role: "Prime Director",
    glyph: "◎",
    status: "online",
    accent: "cyan",
    model: "claude-opus-4-7",
    load: 62,
    tasksDone: 1294,
    uptime: "14d 02h",
    task: "Routing intents across the fleet",
    spark: spark(1),
  },
  {
    id: "scout",
    name: "SCOUT",
    role: "Research & Recon",
    glyph: "✶",
    status: "thinking",
    accent: "violet",
    model: "claude-sonnet-4-6",
    load: 81,
    tasksDone: 842,
    uptime: "6d 18h",
    task: "Synthesizing 40 sources on market shifts",
    spark: spark(2),
  },
  {
    id: "forge",
    name: "FORGE",
    role: "Code Synthesis",
    glyph: "⬡",
    status: "online",
    accent: "emerald",
    model: "claude-opus-4-7",
    load: 47,
    tasksDone: 2031,
    uptime: "9d 11h",
    task: "Refactoring payments service",
    spark: spark(3),
  },
  {
    id: "sentinel",
    name: "SENTINEL",
    role: "Security & Watch",
    glyph: "⊕",
    status: "idle",
    accent: "amber",
    model: "claude-haiku-4-5",
    load: 12,
    tasksDone: 5510,
    uptime: "31d 07h",
    task: "Monitoring perimeter — all clear",
    spark: spark(4),
  },
  {
    id: "muse",
    name: "MUSE",
    role: "Creative & Copy",
    glyph: "❖",
    status: "online",
    accent: "magenta",
    model: "claude-sonnet-4-6",
    load: 58,
    tasksDone: 689,
    uptime: "3d 22h",
    task: "Drafting launch narrative v3",
    spark: spark(5),
  },
  {
    id: "ledger",
    name: "LEDGER",
    role: "Ops & Analytics",
    glyph: "▦",
    status: "paused",
    accent: "rose",
    model: "claude-haiku-4-5",
    load: 0,
    tasksDone: 1177,
    uptime: "—",
    task: "Paused by operator",
    spark: spark(6),
  },
];

export const METRICS: Metric[] = [
  { key: "tok", label: "Tokens / min", unit: "k", value: 184, max: 300, accent: "cyan" },
  { key: "lat", label: "Avg Latency", unit: "ms", value: 412, max: 1200, accent: "emerald" },
  { key: "ctx", label: "Context Pool", unit: "%", value: 73, max: 100, accent: "violet" },
  { key: "thr", label: "Throughput", unit: "req/s", value: 56, max: 120, accent: "amber" },
];

const MESSAGES: Pick<ActivityEvent, "agent" | "accent" | "kind" | "message">[] = [
  { agent: "FORGE", accent: "emerald", kind: "complete", message: "merged refactor · 1,204 LOC reduced" },
  { agent: "SCOUT", accent: "violet", kind: "think", message: "reasoning over 40 documents" },
  { agent: "ORCHESTRATOR", accent: "cyan", kind: "sync", message: "fleet heartbeat synchronized" },
  { agent: "MUSE", accent: "magenta", kind: "complete", message: "generated 3 narrative variants" },
  { agent: "SENTINEL", accent: "amber", kind: "alert", message: "rate-limit guard engaged on edge node" },
  { agent: "FORGE", accent: "emerald", kind: "deploy", message: "shipped build to staging cluster" },
  { agent: "SCOUT", accent: "violet", kind: "spawn", message: "spawned sub-agent: citation-checker" },
  { agent: "ORCHESTRATOR", accent: "cyan", kind: "deploy", message: "rebalanced load across 4 nodes" },
];

let seq = 0;
export function makeEvent(now = Date.now()): ActivityEvent {
  const m = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  return { id: `evt-${now}-${seq++}`, ts: now, ...m };
}

// Client-only seed (uses wall clock); call inside an effect to avoid hydration drift.
export function seedEvents(now = Date.now()): ActivityEvent[] {
  return MESSAGES.slice(0, 7).map((m, i) => ({
    id: `seed-${i}`,
    ts: now - (7 - i) * 9000,
    ...m,
  }));
}
