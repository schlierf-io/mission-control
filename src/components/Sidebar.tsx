"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Command,
  LayoutDashboard,
  ListChecks,
  Radio,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { icon: LayoutDashboard, label: "Command Deck", active: true },
  { icon: Bot, label: "Agents" },
  { icon: ListChecks, label: "Tasks" },
  { icon: Activity, label: "Telemetry" },
  { icon: Radio, label: "Signals" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar({ onCommand }: { onCommand: () => void }) {
  const [active, setActive] = useState("Command Deck");
  return (
    <aside className="sticky top-0 hidden h-screen w-[76px] shrink-0 flex-col items-center gap-2 border-r border-white/5 bg-white/[0.015] py-5 backdrop-blur-xl md:flex">
      <div className="relative mb-4 flex h-11 w-11 items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet to-cyan opacity-90 blur-[2px]" />
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-void">
          <Sparkles className="h-5 w-5 text-cyan" strokeWidth={2.2} />
        </div>
      </div>

      <nav className="flex flex-col items-center gap-1.5">
        {nav.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors"
              title={item.label}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.07] ring-1 ring-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {isActive && (
                <span className="absolute -left-[10px] h-5 w-[3px] rounded-full bg-cyan shadow-[0_0_10px_#22d3ee]" />
              )}
              <item.icon
                className={`relative h-[18px] w-[18px] transition-colors ${
                  isActive
                    ? "text-cyan"
                    : "text-faint group-hover:text-ink"
                }`}
                strokeWidth={2}
              />
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          onClick={onCommand}
          title="Command palette (⌘K)"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet/20 to-cyan/20 ring-1 ring-white/10 transition hover:ring-cyan/40"
        >
          <Command className="h-[18px] w-[18px] text-ink" strokeWidth={2} />
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber to-rose ring-2 ring-white/10" />
      </div>
    </aside>
  );
}
