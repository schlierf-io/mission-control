"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Layers, Zap } from "lucide-react";
import { useMission } from "@/lib/store";
import { AnimatedNumber, Sparkline } from "./primitives";

export function StatCards() {
  const { agents, tasks } = useMission();
  const live = agents.filter(
    (a) => a.status === "active" || a.status === "thinking",
  ).length;
  const tokens = agents.reduce((s, a) => s + a.tokensPerMin, 0);
  const done = agents.reduce((s, a) => s + a.tasksDone, 0);
  const running = tasks.filter((t) => t.state === "running").length;

  const avgHistory = agents[0].history.map((_, i) =>
    agents.reduce((s, a) => s + (a.history[i] ?? 0), 0) / agents.length,
  );

  const cards = [
    {
      label: "Agents Online",
      value: live,
      suffix: `/ ${agents.length}`,
      icon: Cpu,
      color: "#34d399",
      data: avgHistory,
    },
    {
      label: "Tokens / min",
      value: tokens,
      icon: Zap,
      color: "#22d3ee",
      data: agents.map((a) => a.tokensPerMin / 80),
    },
    {
      label: "Tasks Running",
      value: running,
      icon: Layers,
      color: "#a855f7",
      data: avgHistory.map((v) => v * 0.8),
    },
    {
      label: "Tasks Completed",
      value: done,
      icon: Activity,
      color: "#fbbf24",
      data: avgHistory.map((v, i) => 30 + (i / avgHistory.length) * 60),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 glass p-4"
        >
          <div
            className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl transition-opacity group-hover:opacity-80"
            style={{ background: c.color, opacity: 0.18 }}
          />
          <div className="relative flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {c.label}
            </span>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${c.color}1f`, color: c.color }}
            >
              <c.icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
          </div>
          <div className="relative mt-2 flex items-end gap-1.5">
            <span className="font-mono text-3xl font-semibold tabular-nums text-ink">
              <AnimatedNumber value={c.value} />
            </span>
            {c.suffix && (
              <span className="mb-1 font-mono text-sm text-faint">{c.suffix}</span>
            )}
          </div>
          <div className="relative mt-1 -mb-1 h-9 opacity-80">
            <Sparkline data={c.data} color={c.color} height={36} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
