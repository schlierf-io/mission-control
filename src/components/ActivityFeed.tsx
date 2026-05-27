"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMission } from "@/lib/store";
import { logColor } from "@/lib/theme";
import { SectionHeader } from "./AgentGrid";
import { useMounted } from "./primitives";

function ago(time: number) {
  const s = Math.floor((Date.now() - time) / 1000);
  if (s < 5) return "now";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

export function ActivityFeed() {
  const { logs, agents } = useMission();
  const mounted = useMounted();
  const nameOf = (id?: string) => agents.find((a) => a.id === id)?.name;

  return (
    <section className="flex h-full flex-col">
      <SectionHeader title="Signal Feed" hint="streaming" />
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 glass">
        <div className="mask-fade-b h-full max-h-[420px] space-y-1 overflow-y-auto p-3">
          <AnimatePresence initial={false}>
            {logs.map((ev) => {
              const c = logColor[ev.level];
              return (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, x: -12, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: c, boxShadow: `0 0 6px ${c}` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug text-ink/90">
                      {ev.message}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-faint">
                      <span
                        className="uppercase tracking-wider"
                        style={{ color: c }}
                      >
                        {ev.level}
                      </span>
                      {nameOf(ev.agentId) && (
                        <>
                          <span>·</span>
                          <span>{nameOf(ev.agentId)}</span>
                        </>
                      )}
                      <span>·</span>
                      <span suppressHydrationWarning>
                        {mounted ? ago(ev.time) : "—"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
