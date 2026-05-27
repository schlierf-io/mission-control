"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMission } from "@/lib/store";
import { accentHex } from "@/lib/theme";
import type { TaskState } from "@/lib/types";
import { SectionHeader } from "./AgentGrid";

const stateMeta: Record<TaskState, { label: string; color: string }> = {
  running: { label: "Running", color: "#22d3ee" },
  queued: { label: "Queued", color: "#8b93b8" },
  done: { label: "Done", color: "#34d399" },
  blocked: { label: "Blocked", color: "#fb7185" },
};

export function TaskQueue() {
  const { tasks, agents } = useMission();
  const agentOf = (id: string) => agents.find((a) => a.id === id);

  return (
    <section>
      <SectionHeader title="Mission Queue" hint={`${tasks.length} tasks`} />
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {tasks.map((task) => {
            const agent = agentOf(task.agentId);
            const accent = agent ? accentHex[agent.accent] : "#8b93b8";
            const meta = stateMeta[task.state];
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-xl border border-white/10 glass p-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ring-1 ring-white/10"
                    style={{ background: `${accent}1a`, color: accent }}
                  >
                    {agent?.glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-faint">
                      {agent?.name} · {agent?.role}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: `${meta.color}1a`, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <span className="font-mono text-[10px] text-faint">
                      {task.state === "done"
                        ? "complete"
                        : `eta ${task.eta}`}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
                      boxShadow: `0 0 8px ${accent}`,
                    }}
                    initial={false}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
