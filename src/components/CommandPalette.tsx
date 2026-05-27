"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import type { Agent } from "@/lib/types";
import { ACCENT_HEX } from "@/lib/accents";

interface Cmd {
  id: string;
  label: string;
  hint: string;
  glyph: string;
  color: string;
  run: () => void;
}

export default function CommandPalette({
  open,
  onClose,
  agents,
  onSelectAgent,
  onToggleAgent,
}: {
  open: boolean;
  onClose: () => void;
  agents: Agent[];
  onSelectAgent: (id: string) => void;
  onToggleAgent: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      setQ("");
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const commands = useMemo<Cmd[]>(() => {
    const focus = agents.map((a) => ({
      id: `focus-${a.id}`,
      label: `Focus ${a.name}`,
      hint: a.role,
      glyph: a.glyph,
      color: ACCENT_HEX[a.accent],
      run: () => {
        onSelectAgent(a.id);
        onClose();
      },
    }));
    const toggle = agents.map((a) => ({
      id: `toggle-${a.id}`,
      label: `${a.status === "paused" ? "Deploy" : "Pause"} ${a.name}`,
      hint: a.status === "paused" ? "Bring agent online" : "Suspend agent",
      glyph: a.status === "paused" ? "▶" : "⏸",
      color: a.status === "paused" ? ACCENT_HEX.emerald : ACCENT_HEX.rose,
      run: () => {
        onToggleAgent(a.id);
        onClose();
      },
    }));
    return [...focus, ...toggle];
  }, [agents, onClose, onSelectAgent, onToggleAgent]);

  const filtered = commands.filter((c) =>
    `${c.label} ${c.hint}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            style={{ boxShadow: "0 0 60px -10px rgba(34,225,255,0.35)" }}
          >
            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3.5">
              <Search className="h-4 w-4 text-cyan" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Issue a command to the fleet…"
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-ink-faint">
                  No matching commands
                </div>
              )}
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={c.run}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.05]"
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-md text-sm"
                    style={{ background: `${c.color}1a`, color: c.color }}
                  >
                    {c.glyph}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm text-ink">{c.label}</span>
                    <span className="block text-[11px] text-ink-faint">{c.hint}</span>
                  </span>
                  <CornerDownLeft className="h-3.5 w-3.5 text-ink-faint opacity-0 transition group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
