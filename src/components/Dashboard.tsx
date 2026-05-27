"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MissionProvider } from "@/lib/store";
import { ActivityFeed } from "./ActivityFeed";
import { AgentGrid } from "./AgentGrid";
import { Background } from "./Background";
import { CommandPalette } from "./CommandPalette";
import { OrbitView } from "./OrbitView";
import { Sidebar } from "./Sidebar";
import { StatCards } from "./StatCards";
import { TaskQueue } from "./TaskQueue";
import { TelemetryPanel } from "./TelemetryPanel";
import { TopBar } from "./TopBar";

function Hero() {
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Burning the midnight oil" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan/80">
          {greeting}, Commander
        </p>
        <h1 className="mt-1 bg-gradient-to-r from-white via-ink to-violet/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Your fleet is in formation.
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-muted">
          Every Claude agent, mission, and signal — orchestrated from one command deck.
        </p>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <MissionProvider>
      <Background />
      <div className="flex min-h-screen">
        <Sidebar onCommand={() => setPaletteOpen(true)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onCommand={() => setPaletteOpen(true)} />
          <main className="mx-auto w-full max-w-[1500px] flex-1 space-y-7 px-4 py-6 md:px-8 md:py-8">
            <Hero />
            <StatCards />

            <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_360px]">
              {/* main column */}
              <div className="min-w-0 space-y-7">
                <AgentGrid />
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                  <TaskQueue />
                  <div className="space-y-3">
                    <OrbitHeader />
                    <OrbitView />
                  </div>
                </div>
              </div>

              {/* right rail */}
              <div className="space-y-7">
                <TelemetryPanel />
                <ActivityFeed />
              </div>
            </div>

            <Footer />
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </MissionProvider>
  );
}

function OrbitHeader() {
  return (
    <div className="mb-1 flex items-center gap-3">
      <div className="h-4 w-1 rounded-full bg-gradient-to-b from-violet to-cyan" />
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink">
        Constellation
      </h2>
      <span className="font-mono text-xs text-faint">· orbital view</span>
      <div className="ml-auto h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-5 font-mono text-[11px] text-faint">
      <span>MISSION CONTROL · local instance · all systems nominal</span>
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald shadow-[0_0_6px_#34d399]" />
        connected to Claude
      </span>
    </footer>
  );
}
