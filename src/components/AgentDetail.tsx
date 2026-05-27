"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Terminal, Zap } from "lucide-react";
import type { Agent } from "@/lib/types";
import { ACCENT_HEX, rgba, STATUS_META } from "@/lib/accents";
import { CountUp, Sparkline, StatusDot } from "./primitives";

export default function AgentDetail({
  agent,
  onToggle,
}: {
  agent: Agent | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-dim">
        <Terminal className="h-3.5 w-3.5 text-violet" />
        Agent Console
      </div>

      <AnimatePresence mode="wait">
        {agent ? (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
              style={{ background: `radial-gradient(circle, ${rgba(agent.accent, 0.5)}, transparent 70%)` }}
            />
            <div className="relative flex items-center gap-4">
              <div
                className="grid h-16 w-16 place-items-center rounded-2xl text-3xl"
                style={{
                  background: rgba(agent.accent, 0.12),
                  color: ACCENT_HEX[agent.accent],
                  boxShadow: `inset 0 0 0 1px ${rgba(agent.accent, 0.4)}, 0 0 30px -8px ${rgba(agent.accent, 0.8)}`,
                }}
              >
                {agent.glyph}
              </div>
              <div className="flex-1">
                <div className="font-mono text-lg font-semibold tracking-wide">{agent.name}</div>
                <div className="text-xs text-ink-dim">{agent.role}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <StatusDot color={STATUS_META[agent.status].dot} size={7} />
                  <span
                    className="font-mono text-[10px] tracking-wider"
                    style={{ color: STATUS_META[agent.status].dot }}
                  >
                    {STATUS_META[agent.status].label}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-4 rounded-xl border border-white/6 bg-black/30 p-3 font-mono text-[11px] text-ink-dim">
              <span className="text-emerald">›</span> {agent.task}
              <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-emerald/80" />
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Tasks", value: agent.tasksDone, color: ACCENT_HEX[agent.accent] },
                { label: "Load %", value: agent.load, color: ACCENT_HEX.cyan },
                { label: "Uptime", raw: agent.uptime, color: ACCENT_HEX.emerald },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-white/6 bg-white/[0.02] py-2">
                  <div className="font-mono text-base font-semibold" style={{ color: s.color }}>
                    {s.raw ?? <CountUp value={s.value as number} />}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-ink-faint">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="relative mt-4 rounded-xl border border-white/6 bg-white/[0.02] p-3">
              <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-ink-faint">
                <span>Activity · 24 cycles</span>
                <span className="font-mono">{agent.model}</span>
              </div>
              <Sparkline data={agent.spark} accent={agent.accent} width={300} height={48} />
            </div>

            <button
              onClick={() => onToggle(agent.id)}
              className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium uppercase tracking-wider transition"
              style={{
                background: rgba(agent.status === "paused" ? "emerald" : "rose", 0.12),
                color: agent.status === "paused" ? ACCENT_HEX.emerald : ACCENT_HEX.rose,
                boxShadow: `inset 0 0 0 1px ${rgba(agent.status === "paused" ? "emerald" : "rose", 0.35)}`,
              }}
            >
              {agent.status === "paused" ? (
                <>
                  <Play className="h-4 w-4" /> Deploy Agent
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" /> Suspend Agent
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Zap className="mb-3 h-8 w-8 text-ink-faint" />
            <p className="text-sm text-ink-dim">Select an agent to open its console</p>
            <p className="mt-1 text-[11px] text-ink-faint">
              Press <kbd className="rounded bg-white/5 px-1 font-mono">⌘K</kbd> to issue a command
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
