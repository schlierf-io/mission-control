export type AgentStatus = "online" | "thinking" | "idle" | "paused" | "error";

export type Accent = "cyan" | "violet" | "magenta" | "emerald" | "amber" | "rose";

export interface Agent {
  id: string;
  name: string;
  role: string;
  glyph: string;
  status: AgentStatus;
  accent: Accent;
  model: string;
  load: number; // 0-100 current compute load
  tasksDone: number;
  uptime: string;
  task: string; // current task description
  spark: number[]; // recent activity sparkline values
}

export interface ActivityEvent {
  id: string;
  ts: number;
  agent: string;
  accent: Accent;
  kind: "deploy" | "complete" | "think" | "alert" | "sync" | "spawn";
  message: string;
}

export interface Metric {
  key: string;
  label: string;
  unit: string;
  value: number;
  max: number;
  accent: Accent;
}
