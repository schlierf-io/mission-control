"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Command, Search, Activity, Wifi } from "lucide-react";
import { StatusDot } from "./primitives";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick);
    const t = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, []);
  return now;
}

export default function TopBar({ onCommand }: { onCommand: () => void }) {
  const now = useClock();
  const time = now
    ? now.toLocaleTimeString("en-GB", { hour12: false })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
    : "";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass sticky top-0 z-30 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-5"
    >
      <div className="flex items-center gap-3">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20">
          <div className="absolute inset-0 rounded-xl border border-cyan/30 animate-pulse-glow" />
          <span className="text-glow text-cyan text-lg">◎</span>
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            MISSION CONTROL
            <span className="rounded bg-cyan/10 px-1.5 py-0.5 font-mono text-[9px] text-cyan ring-1 ring-cyan/30">
              v1.0
            </span>
          </div>
          <div className="text-[11px] text-ink-faint">Claude Command Center</div>
        </div>
      </div>

      <button
        onClick={onCommand}
        className="group hidden flex-1 items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-ink-faint transition hover:border-cyan/30 hover:bg-white/[0.04] sm:flex md:max-w-md"
      >
        <Search className="h-4 w-4" />
        <span>Search the fleet, run a command…</span>
        <kbd className="ml-auto flex items-center gap-0.5 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-ink-dim">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-[11px] text-ink-dim md:flex">
          <Wifi className="h-3.5 w-3.5 text-emerald" />
          <span className="font-mono">UPLINK STABLE</span>
        </div>
        <div className="hidden items-center gap-2 text-[11px] text-ink-dim lg:flex">
          <Activity className="h-3.5 w-3.5 text-cyan" />
          <span className="font-mono">6 NODES</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot color="#2bf5a8" />
          <span className="hidden text-[11px] font-medium text-emerald sm:inline">
            ALL SYSTEMS NOMINAL
          </span>
        </div>
        <div className="text-right leading-none">
          <div className="font-mono text-base font-semibold tabular-nums text-ink">
            {time}
          </div>
          <div className="font-mono text-[10px] uppercase text-ink-faint">{date}</div>
        </div>
      </div>
    </motion.header>
  );
}
