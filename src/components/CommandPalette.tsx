"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CornerDownLeft,
  Pause,
  Play,
  Send,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMission } from "@/lib/store";
import { accentHex } from "@/lib/theme";

const presets = [
  "Refactor the auth module",
  "Write integration tests",
  "Summarize today's PRs",
  "Audit the deploy pipeline",
  "Draft the launch announcement",
];

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>{open && <Palette onClose={onClose} />}</AnimatePresence>
  );
}

function Palette({ onClose }: { onClose: () => void }) {
  const { agents, dispatch, pauseAll, resumeAll } = useMission();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filteredPresets = useMemo(
    () =>
      query
        ? presets.filter((p) => p.toLowerCase().includes(query.toLowerCase()))
        : presets,
    [query],
  );

  const submit = (title: string) => {
    if (!title.trim()) return;
    dispatch(title.trim(), target);
    onClose();
  };

  return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-void/70 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 glass-strong shadow-2xl shadow-black/50"
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #22d3ee, #a855f7, transparent)",
              }}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="flex items-center gap-3 border-b border-white/10 px-4 py-4"
            >
              <Send className="h-4 w-4 text-cyan" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Dispatch a mission to your fleet…"
                className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-faint focus:outline-none"
              />
              <kbd className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-faint">
                <CornerDownLeft className="h-3 w-3" /> send
              </kbd>
            </form>

            <div className="max-h-[46vh] overflow-y-auto p-2">
              {/* target selector */}
              <div className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                Assign to
              </div>
              <div className="flex flex-wrap gap-1.5 px-2 pb-3">
                <Chip active={target === undefined} onClick={() => setTarget(undefined)}>
                  <Bot className="h-3 w-3" /> Auto-route
                </Chip>
                {agents.map((a) => (
                  <Chip
                    key={a.id}
                    active={target === a.id}
                    color={accentHex[a.accent]}
                    onClick={() => setTarget(a.id)}
                  >
                    {a.glyph} {a.name}
                  </Chip>
                ))}
              </div>

              {/* presets */}
              <div className="px-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-faint">
                Suggested missions
              </div>
              {filteredPresets.map((p) => (
                <button
                  key={p}
                  onClick={() => submit(p)}
                  className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm text-ink/90 transition hover:bg-white/[0.06]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet/15 text-violet">
                    <Zap className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1">{p}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-faint opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </button>
              ))}

              {/* quick fleet actions */}
              <div className="mt-1 grid grid-cols-2 gap-2 px-2 pb-2 pt-2">
                <ActionBtn onClick={() => { resumeAll(); onClose(); }} color="#34d399">
                  <Play className="h-3.5 w-3.5" /> Resume all
                </ActionBtn>
                <ActionBtn onClick={() => { pauseAll(); onClose(); }} color="#fbbf24">
                  <Pause className="h-3.5 w-3.5" /> Pause all
                </ActionBtn>
              </div>
            </div>
          </motion.div>
        </motion.div>
  );
}

function Chip({
  children,
  active,
  color = "#8b93b8",
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition"
      style={{
        borderColor: active ? color : "rgba(255,255,255,0.1)",
        background: active ? `${color}1f` : "transparent",
        color: active ? color : "#8b93b8",
      }}
    >
      {children}
    </button>
  );
}

function ActionBtn({
  children,
  color,
  onClick,
}: {
  children: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-medium transition hover:bg-white/[0.06]"
      style={{ color }}
    >
      {children}
    </button>
  );
}
