"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Rocket,
  CheckCircle2,
  Brain,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Radio,
} from "lucide-react";
import type { ActivityEvent } from "@/lib/types";
import { ACCENT_HEX } from "@/lib/accents";

const ICON = {
  deploy: Rocket,
  complete: CheckCircle2,
  think: Brain,
  alert: AlertTriangle,
  sync: RefreshCw,
  spawn: Sparkles,
} as const;

function ago(ts: number, now: number) {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

export default function ActivityFeed({
  events,
  now,
}: {
  events: ActivityEvent[];
  now: number;
}) {
  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-dim">
          <Radio className="h-3.5 w-3.5 text-emerald" />
          Live Telemetry
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse-glow" />
          STREAMING
        </span>
      </div>

      <div className="-mr-2 flex-1 space-y-1.5 overflow-y-auto pr-2 mask-fade-b">
        <AnimatePresence initial={false}>
          {events.map((e) => {
            const Icon = ICON[e.kind];
            const hex = ACCENT_HEX[e.accent];
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, x: -16, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
                className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-white/[0.015] px-2.5 py-2"
              >
                <div
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md"
                  style={{ background: `${hex}1a`, color: hex }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold" style={{ color: hex }}>
                      {e.agent}
                    </span>
                    <span className="font-mono text-[9px] text-ink-faint">{ago(e.ts, now)} ago</span>
                  </div>
                  <p className="truncate text-[11px] text-ink-dim">{e.message}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
