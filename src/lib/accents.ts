import type { Accent, AgentStatus } from "./types";

export const ACCENT_HEX: Record<Accent, string> = {
  cyan: "#22e1ff",
  violet: "#a855f7",
  magenta: "#f43f8e",
  emerald: "#2bf5a8",
  amber: "#ffb648",
  rose: "#ff5d73",
};

export function rgba(accent: Accent, alpha: number) {
  const hex = ACCENT_HEX[accent].replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const STATUS_META: Record<
  AgentStatus,
  { label: string; dot: string; accent: Accent }
> = {
  online: { label: "ONLINE", dot: "#2bf5a8", accent: "emerald" },
  thinking: { label: "THINKING", dot: "#a855f7", accent: "violet" },
  idle: { label: "IDLE", dot: "#ffb648", accent: "amber" },
  paused: { label: "PAUSED", dot: "#5b6781", accent: "rose" },
  error: { label: "FAULT", dot: "#ff5d73", accent: "rose" },
};
