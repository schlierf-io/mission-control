"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Boxes,
  GitBranch,
  Database,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";

const NAV: { icon: LucideIcon; label: string }[] = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Boxes, label: "Fleet" },
  { icon: GitBranch, label: "Pipelines" },
  { icon: Database, label: "Memory" },
  { icon: ShieldCheck, label: "Security" },
  { icon: Settings, label: "Config" },
];

export default function Sidebar() {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass hidden w-16 shrink-0 flex-col items-center gap-2 rounded-2xl py-4 lg:flex"
    >
      {NAV.map((item, i) => {
        const active = i === 0;
        return (
          <button
            key={item.label}
            title={item.label}
            className="group relative grid h-11 w-11 place-items-center rounded-xl transition"
            style={{
              background: active ? "rgba(34,225,255,0.1)" : "transparent",
              color: active ? "#22e1ff" : "#5b6781",
            }}
          >
            {active && (
              <span className="absolute -left-2 h-5 w-1 rounded-full bg-cyan shadow-[0_0_10px_#22e1ff]" />
            )}
            <item.icon className="h-5 w-5 transition group-hover:text-ink" />
            <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-md bg-panel-2 px-2 py-1 text-[11px] text-ink opacity-0 shadow-lg ring-1 ring-white/10 transition group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
