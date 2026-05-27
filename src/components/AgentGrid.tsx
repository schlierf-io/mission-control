"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, Pause, Play, Zap } from "lucide-react";
import { useMission } from "@/lib/store";
import { accentHex, statusMeta } from "@/lib/theme";
import type { Agent } from "@/lib/types";
import { AnimatedNumber, Sparkline, StatusDot } from "./primitives";

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const { toggleAgent, boostAgent, select, selectedAgentId } = useMission();
  const color = accentHex[agent.accent];
  const status = statusMeta[agent.status];
  const paused = agent.status === "paused";
  const selected = selectedAgentId === agent.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => select(selected ? null : agent.id)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 glass p-4 transition-colors hover:border-white/20"
      style={selected ? { borderColor: `${color}66` } : undefined}
    >
      {/* glow wash */}
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500"
        style={{ background: color, opacity: paused ? 0.05 : 0.16 }}
      />
      {/* scanline when thinking */}
      {agent.status === "thinking" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-x-0 h-16"
            style={{
              background: `linear-gradient(180deg, transparent, ${color}14, transparent)`,
              animation: "scan 2.6s linear infinite",
            }}
          />
        </div>
      )}

      <div className="relative flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ring-1 ring-white/10"
          style={{ background: `${color}1a`, color }}
        >
          {agent.glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-ink">{agent.name}</h3>
            <span
              className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ background: `${status.color}1a`, color: status.color }}
            >
              <StatusDot color={status.color} pulse={status.pulse} />
              {status.label}
            </span>
          </div>
          <p className="truncate text-xs text-muted">{agent.role}</p>
        </div>
      </div>

      <p className="relative mt-3 line-clamp-1 text-xs text-faint">
        <span className="text-muted">›</span> {agent.currentTask}
      </p>

      {/* load + sparkline */}
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
            Load
          </div>
          <div className="font-mono text-xl font-semibold tabular-nums" style={{ color }}>
            <AnimatedNumber value={agent.load} />
            <span className="text-xs text-faint">%</span>
          </div>
        </div>
        <div className="h-10 flex-1">
          <Sparkline data={agent.history} color={color} height={40} />
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex gap-4 font-mono text-[11px] text-muted">
          <span>
            <span className="text-ink">{(agent.tokensPerMin / 1000).toFixed(1)}k</span> tok/m
          </span>
          <span>
            <span className="text-ink">{agent.tasksDone.toLocaleString()}</span> done
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              boostAgent(agent.id);
            }}
            title="Boost"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-muted transition hover:bg-cyan/20 hover:text-cyan"
          >
            <Zap className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAgent(agent.id);
            }}
            title={paused ? "Resume" : "Pause"}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-muted transition hover:bg-white/15 hover:text-ink"
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* expanded detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center">
              <Detail label="Model" value={agent.model.replace("claude-", "")} />
              <Detail
                label="Uptime"
                value={`${Math.floor(agent.uptimeMins / 60)}h`}
              />
              <Detail label="Lane" value={agent.status === "thinking" ? "priority" : "standard"} />
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-faint">
              <ChevronUp className="h-3 w-3" /> tap to collapse
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] py-1.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-faint">
        {label}
      </div>
      <div className="truncate text-xs font-medium text-ink">{value}</div>
    </div>
  );
}

export function AgentGrid() {
  const { agents } = useMission();
  return (
    <section>
      <SectionHeader
        title="Agent Fleet"
        hint={`${agents.length} systems`}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((a, i) => (
          <AgentCard key={a.id} agent={a} index={i} />
        ))}
      </div>
    </section>
  );
}

export function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div className="h-4 w-1 rounded-full bg-gradient-to-b from-violet to-cyan" />
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink">
        {title}
      </h2>
      {hint && (
        <span className="font-mono text-xs text-faint">· {hint}</span>
      )}
      <div className="ml-auto h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}
