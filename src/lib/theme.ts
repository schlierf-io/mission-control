import type { AccentKey, AgentStatus, LogLevel } from "./types";

export const accentHex: Record<AccentKey, string> = {
  cyan: "#22d3ee",
  violet: "#a855f7",
  emerald: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
  blue: "#60a5fa",
};

export const statusMeta: Record<
  AgentStatus,
  { label: string; color: string; pulse: boolean }
> = {
  active: { label: "Active", color: "#34d399", pulse: true },
  thinking: { label: "Thinking", color: "#22d3ee", pulse: true },
  idle: { label: "Idle", color: "#60a5fa", pulse: false },
  paused: { label: "Paused", color: "#fbbf24", pulse: false },
  error: { label: "Error", color: "#fb7185", pulse: true },
};

export const logColor: Record<LogLevel, string> = {
  info: "#8b93b8",
  success: "#34d399",
  warn: "#fbbf24",
  action: "#a855f7",
  agent: "#22d3ee",
};
