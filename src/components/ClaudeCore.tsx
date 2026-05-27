"use client";

import { motion } from "framer-motion";
import { CountUp } from "./primitives";

export default function ClaudeCore({ activeAgents }: { activeAgents: number }) {
  return (
    <div className="glass relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-6">
      <div className="absolute left-4 top-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-glow" />
        Core Reactor
      </div>

      <div className="relative my-4 grid place-items-center" style={{ width: 240, height: 240 }}>
        {/* orbit rings */}
        <div className="absolute inset-0 rounded-full border border-cyan/15 animate-spin-slower" />
        <div className="absolute inset-6 rounded-full border border-violet/15 animate-spin-slow [animation-direction:reverse]" />
        <div className="absolute inset-12 rounded-full border border-dashed border-emerald/15 animate-spin-slower" />

        {/* orbiting satellites */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_12px_#22e1ff]" />
        </motion.div>
        <motion.div
          className="absolute inset-6"
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-violet shadow-[0_0_12px_#a855f7]" />
        </motion.div>
        <motion.div
          className="absolute inset-12"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald shadow-[0_0_12px_#2bf5a8]" />
        </motion.div>

        {/* glowing core */}
        <motion.div
          className="relative grid h-28 w-28 place-items-center rounded-full"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(34,225,255,0.9), rgba(168,85,247,0.65) 55%, rgba(8,10,18,0.2) 80%)",
            boxShadow:
              "0 0 60px rgba(34,225,255,0.45), inset 0 0 40px rgba(168,85,247,0.4)",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_55%,rgba(4,5,10,0.65))]" />
          <span className="text-glow relative text-4xl text-white/90">◎</span>
        </motion.div>
      </div>

      <div className="text-center">
        <div className="font-mono text-3xl font-semibold tabular-nums text-glow text-cyan">
          <CountUp value={99.98} decimals={2} />%
        </div>
        <div className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-ink-dim">
          Core Integrity
        </div>
      </div>

      <div className="mt-4 grid w-full grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2 text-center">
          <div className="font-mono text-lg font-semibold text-emerald">
            <CountUp value={activeAgents} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">Active</div>
        </div>
        <div className="rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2 text-center">
          <div className="font-mono text-lg font-semibold text-violet">
            <CountUp value={11543} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">Tasks · 24h</div>
        </div>
      </div>
    </div>
  );
}
