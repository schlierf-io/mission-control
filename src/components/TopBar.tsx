"use client";

import { motion } from "framer-motion";
import { Pause, Play, Search, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useMission } from "@/lib/store";
import { StatusDot } from "./primitives";

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <span className="font-mono text-sm text-muted">--:--:--</span>;
  return (
    <span className="font-mono text-sm tabular-nums text-ink">
      {now.toLocaleTimeString("en-US", { hour12: false })}
      <span className="ml-2 text-faint">UTC{-now.getTimezoneOffset() / 60 >= 0 ? "+" : ""}{-now.getTimezoneOffset() / 60}</span>
    </span>
  );
}

export function TopBar({ onCommand }: { onCommand: () => void }) {
  const { agents, pauseAll, resumeAll } = useMission();
  const live = agents.filter(
    (a) => a.status === "active" || a.status === "thinking",
  ).length;
  const allPaused = agents.every((a) => a.status === "paused");

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/5 bg-void/60 px-5 py-3.5 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-semibold tracking-tight text-ink">
          Mission Control
        </h1>
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted sm:inline">
          v2.7 · claude fleet
        </span>
      </div>

      <div className="ml-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
        <StatusDot color="#34d399" pulse />
        <span className="text-xs text-muted">
          <span className="font-medium text-emerald">{live}</span> agents online
        </span>
      </div>

      <button
        onClick={onCommand}
        className="group ml-auto hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-muted transition hover:border-white/20 hover:bg-white/[0.06] sm:flex md:w-64"
      >
        <Search className="h-4 w-4 text-faint group-hover:text-muted" />
        <span className="flex-1">Command…</span>
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-faint">
          ⌘K
        </kbd>
      </button>

      <div className="hidden items-center gap-3 lg:flex">
        <Clock />
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={allPaused ? resumeAll : pauseAll}
        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
          allPaused
            ? "bg-emerald/15 text-emerald ring-1 ring-emerald/30 hover:bg-emerald/25"
            : "bg-amber/10 text-amber ring-1 ring-amber/25 hover:bg-amber/20"
        }`}
      >
        {allPaused ? (
          <>
            <Play className="h-4 w-4" /> <span className="hidden sm:inline">Resume fleet</span>
          </>
        ) : (
          <>
            <Pause className="h-4 w-4" /> <span className="hidden sm:inline">Pause fleet</span>
          </>
        )}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onCommand}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-3.5 py-2 text-sm font-semibold text-void shadow-[0_0_20px_rgba(168,85,247,0.45)] transition hover:shadow-[0_0_30px_rgba(34,211,238,0.55)]"
      >
        <Zap className="h-4 w-4" fill="currentColor" />
        <span className="hidden sm:inline">Dispatch</span>
      </motion.button>
    </header>
  );
}
