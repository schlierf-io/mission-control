export type AgentStatus = "active" | "idle" | "paused" | "thinking" | "error";

export type AccentKey = "cyan" | "violet" | "emerald" | "amber" | "rose" | "blue";

export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: AgentStatus;
  accent: AccentKey;
  glyph: string;
  /** 0-100 load */
  load: number;
  /** rolling token throughput */
  tokensPerMin: number;
  tasksDone: number;
  uptimeMins: number;
  /** recent load samples for the sparkline */
  history: number[];
  currentTask: string;
}

export type TaskState = "queued" | "running" | "done" | "blocked";

export interface Task {
  id: string;
  title: string;
  agentId: string;
  state: TaskState;
  progress: number;
  eta: string;
}

export type LogLevel = "info" | "success" | "warn" | "action" | "agent";

export interface LogEvent {
  id: string;
  time: number;
  agentId?: string;
  level: LogLevel;
  message: string;
}

export interface SystemMetrics {
  cohesion: number;
  throughput: number;
  latency: number;
  memory: number;
}
