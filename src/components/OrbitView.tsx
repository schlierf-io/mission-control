"use client";

import { motion } from "framer-motion";
import { useMission } from "@/lib/store";
import { accentHex, statusMeta } from "@/lib/theme";

export function OrbitView() {
  const { agents, select, selectedAgentId } = useMission();
  const rings = [
    { r: 33, dur: 38 },
    { r: 46, dur: 30 },
    { r: 60, dur: 24 },
  ];

  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 glass">
      {/* faint orbit rings */}
      {rings.map((ring) => (
        <div
          key={ring.r}
          className="absolute rounded-full border border-white/[0.06]"
          style={{ width: `${ring.r * 2}%`, height: `${ring.r * 2}%` }}
        />
      ))}

      {/* sweeping radar line */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        style={{
          background:
            "conic-gradient(from 0deg, rgba(34,211,238,0.16), transparent 35%)",
          borderRadius: "50%",
          maskImage: "radial-gradient(circle, black 60%, transparent 62%)",
          WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 62%)",
        }}
      />

      {/* central Claude core */}
      <div className="absolute flex flex-col items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-violet to-cyan opacity-30 blur-xl" />
          <motion.span
            className="absolute inset-0 rounded-full border border-cyan/40"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet/80 to-cyan/80 ring-1 ring-white/20">
            <span className="bg-gradient-to-br from-white to-cyan-100 bg-clip-text font-mono text-2xl font-bold text-transparent">
              C
            </span>
          </div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-xs font-semibold text-ink">Claude Core</div>
          <div className="font-mono text-[10px] text-faint">opus-4-7 · online</div>
        </div>
      </div>

      {/* orbiting agents */}
      {agents.map((agent, i) => {
        const ring = rings[i % rings.length];
        const color = accentHex[agent.accent];
        const live = statusMeta[agent.status].pulse;
        const dir = i % 2 === 0 ? 1 : -1;
        const startAngle = (i / agents.length) * 360;
        return (
          <motion.div
            key={agent.id}
            className="absolute"
            style={{ width: `${ring.r * 2}%`, height: `${ring.r * 2}%` }}
            initial={{ rotate: startAngle }}
            animate={{ rotate: startAngle + 360 * dir }}
            transition={{ duration: ring.dur, ease: "linear", repeat: Infinity }}
          >
            <motion.button
              onClick={() => select(selectedAgentId === agent.id ? null : agent.id)}
              whileHover={{ scale: 1.3 }}
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
              style={{ rotate: -(startAngle) }}
            >
              <motion.span
                animate={{ rotate: -(360 * dir) }}
                transition={{ duration: ring.dur, ease: "linear", repeat: Infinity }}
                className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 ${live ? 12 : 5}px ${color}`,
                  opacity: agent.status === "paused" ? 0.4 : 1,
                  outline: selectedAgentId === agent.id ? `2px solid ${color}` : "none",
                  outlineOffset: 2,
                }}
                title={agent.name}
              />
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
