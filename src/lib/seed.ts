import type { Agent, LogEvent, Task } from "./types";

// Deterministic pseudo-random so server and client render identical
// initial sparklines (avoids hydration mismatch). Live values take over
// once the client simulation starts ticking.
const spark = (base: number, seed: number) => {
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: 28 }, (_, i) =>
    Math.max(
      4,
      Math.min(100, base + Math.sin(i / 2.2) * 14 + (rnd() - 0.5) * 18),
    ),
  );
};

export const seedAgents: Agent[] = [
  {
    id: "orion",
    name: "Orion",
    role: "Lead Orchestrator",
    model: "claude-opus-4-7",
    status: "active",
    accent: "violet",
    glyph: "◆",
    load: 72,
    tokensPerMin: 4820,
    tasksDone: 1284,
    uptimeMins: 9421,
    history: spark(70, 1),
    currentTask: "Routing sub-tasks across the fleet",
  },
  {
    id: "vega",
    name: "Vega",
    role: "Code Architect",
    model: "claude-opus-4-7",
    status: "thinking",
    accent: "cyan",
    glyph: "❖",
    load: 88,
    tokensPerMin: 6140,
    tasksDone: 942,
    uptimeMins: 7720,
    history: spark(80, 2),
    currentTask: "Refactoring the payments service",
  },
  {
    id: "lyra",
    name: "Lyra",
    role: "Research Scout",
    model: "claude-sonnet-4-6",
    status: "active",
    accent: "emerald",
    glyph: "✦",
    load: 54,
    tokensPerMin: 3110,
    tasksDone: 2031,
    uptimeMins: 12880,
    history: spark(52, 3),
    currentTask: "Scanning 41 sources on vector DBs",
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Infra Sentinel",
    model: "claude-sonnet-4-6",
    status: "idle",
    accent: "blue",
    glyph: "⬡",
    load: 21,
    tokensPerMin: 880,
    tasksDone: 651,
    uptimeMins: 15402,
    history: spark(24, 4),
    currentTask: "Standing by · watching deploys",
  },
  {
    id: "nova",
    name: "Nova",
    role: "Creative Synth",
    model: "claude-haiku-4-5",
    status: "active",
    accent: "rose",
    glyph: "✷",
    load: 63,
    tokensPerMin: 2440,
    tasksDone: 488,
    uptimeMins: 3120,
    history: spark(60, 5),
    currentTask: "Drafting launch copy variants",
  },
  {
    id: "echo",
    name: "Echo",
    role: "QA Verifier",
    model: "claude-haiku-4-5",
    status: "paused",
    accent: "amber",
    glyph: "◈",
    load: 8,
    tokensPerMin: 0,
    tasksDone: 1770,
    uptimeMins: 6210,
    history: spark(12, 6),
    currentTask: "Paused by operator",
  },
];

export const seedTasks: Task[] = [
  {
    id: "t1",
    title: "Ship checkout v2 flow",
    agentId: "vega",
    state: "running",
    progress: 64,
    eta: "12m",
  },
  {
    id: "t2",
    title: "Summarize Q2 research corpus",
    agentId: "lyra",
    state: "running",
    progress: 38,
    eta: "26m",
  },
  {
    id: "t3",
    title: "Audit production logs",
    agentId: "atlas",
    state: "queued",
    progress: 0,
    eta: "—",
  },
  {
    id: "t4",
    title: "Generate launch narrative",
    agentId: "nova",
    state: "running",
    progress: 81,
    eta: "5m",
  },
  {
    id: "t5",
    title: "Regression sweep · suite 7",
    agentId: "echo",
    state: "blocked",
    progress: 47,
    eta: "—",
  },
  {
    id: "t6",
    title: "Plan multi-agent rollout",
    agentId: "orion",
    state: "running",
    progress: 22,
    eta: "41m",
  },
];

const now = Date.now();
export const seedLogs: LogEvent[] = [
  {
    id: "l1",
    time: now - 1000,
    agentId: "vega",
    level: "agent",
    message: "Opened payments/service.ts and mapped 14 call sites",
  },
  {
    id: "l2",
    time: now - 4200,
    agentId: "orion",
    level: "action",
    message: "Dispatched 3 sub-tasks to the fleet",
  },
  {
    id: "l3",
    time: now - 8800,
    agentId: "lyra",
    level: "success",
    message: "Indexed 41 sources · 0 errors",
  },
  {
    id: "l4",
    time: now - 15400,
    agentId: "nova",
    level: "info",
    message: "Generated 6 copy variants for review",
  },
  {
    id: "l5",
    time: now - 21000,
    agentId: "atlas",
    level: "warn",
    message: "Latency spike detected on us-east deploy",
  },
];

export const initialMetrics = {
  cohesion: 94,
  throughput: 78,
  latency: 32,
  memory: 61,
};
