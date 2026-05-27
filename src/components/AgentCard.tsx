"use client";

import { motion } from "framer-motion";
import { Pause, Play, Cpu, ChevronRight } from "lucide-react";
import type { Agent } from "@/lib/types";
import { ACCENT_HEX, rgba, STATUS_META } from "@/lib/accents";
import { Sparkline, StatusDot } from "./primitives";

export default function AgentCard({
  agent,
  selected,
  onSelect,
  onToggle,
}: {
  agent: Agent;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const hex = ACCENT_HEX[agent.accent];
  const status = STATUS_META[agent.status];
  const paused = agent.status === "paused";

  return (
    <motion.div
      layout
      onClick={onSelect}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border bg-panel/60 p-4 backdrop-blur-sm transition-colors"
      style={{
        borderColor: selected ? rgba(agent.accent, 0.55) : "rgba(255,255,255,0.07)",
        boxShadow: selected ? `0 0 28px -6px ${rgba(agent.accent, 0.55)}` : "none",
      }}
    >
      {/* accent wash */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${rgba(agent.accent, 0.5)}, transparent 70%)` }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center rounded-xl text-xl"
            style={{
              background: rgba(agent.accent, 0.12),
              color: hex,
              boxShadow: `inset 0 0 0 1px ${rgba(agent.accent, 0.35)}`,
            }}
          >
            {agent.glyph}
          </div>
          <div>
            <div className="font-mono text-sm font-semibold tracking-wide">{agent.name}</div>
            <div className="text-[11px] text-ink-faint">{agent.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot color={status.dot} size={7} />
          <span className="font-mono text-[9px] tracking-wider" style={{ color: status.dot }}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-3">
        <p className="line-clamp-2 text-[11px] leading-snug text-ink-dim">{agent.task}</p>
        <Sparkline data={agent.spark} accent={agent.accent} width={84} height={30} />
      </div>

      {/* load bar */}
      <div className="relative mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-ink-faint">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" /> Load
          </span>
          <span className="font-mono tabular-nums" style={{ color: hex }}>
            {agent.load}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${agent.load}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: `linear-gradient(90deg, ${rgba(agent.accent, 0.5)}, ${hex})` }}
          />
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-[10px] text-ink-faint">
          <span>{agent.model}</span>
          <span className="text-ink-dim">·</span>
          <span>{agent.uptime}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition hover:border-white/25"
          style={{ color: paused ? ACCENT_HEX.emerald : ACCENT_HEX.rose }}
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? "Deploy" : "Pause"}
        </button>
      </div>

      <ChevronRight
        className="absolute bottom-4 right-2 h-4 w-4 -translate-x-2 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
      />
    </motion.div>
  );
}
