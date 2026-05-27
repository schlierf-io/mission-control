"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Background from "@/components/Background";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ClaudeCore from "@/components/ClaudeCore";
import AgentCard from "@/components/AgentCard";
import AgentDetail from "@/components/AgentDetail";
import TelemetryPanel from "@/components/TelemetryPanel";
import ActivityFeed from "@/components/ActivityFeed";
import CommandPalette from "@/components/CommandPalette";
import { AGENTS, METRICS, seedEvents, makeEvent } from "@/lib/data";
import type { Agent, ActivityEvent, Metric } from "@/lib/types";

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [metrics, setMetrics] = useState<Metric[]>(METRICS);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string>(AGENTS[0].id);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const selected = agents.find((a) => a.id === selectedId) ?? null;
  const activeAgents = agents.filter((a) => a.status !== "paused").length;

  const toggleAgent = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === "paused" ? "online" : "paused",
              load: a.status === "paused" ? 40 + Math.round(Math.random() * 35) : 0,
              uptime: a.status === "paused" ? "0d 00h" : "—",
              task:
                a.status === "paused"
                  ? "Spinning up — awaiting directive"
                  : "Paused by operator",
            }
          : a
      )
    );
  }, []);

  // Cmd+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // clock tick (drives relative timestamps)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // seed the feed on mount (wall-clock dependent → client only)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEvents(seedEvents()));
    return () => cancelAnimationFrame(raf);
  }, []);

  // live event stream
  useEffect(() => {
    const t = setInterval(() => {
      setEvents((prev) => [makeEvent(), ...prev].slice(0, 14));
    }, 4200);
    return () => clearInterval(t);
  }, []);

  // fluctuating telemetry + agent loads
  useEffect(() => {
    const t = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: clamp(
            Math.round(m.value + (Math.random() - 0.5) * m.max * 0.12),
            Math.round(m.max * 0.08),
            m.max
          ),
        }))
      );
      setAgents((prev) =>
        prev.map((a) =>
          a.status === "paused"
            ? a
            : { ...a, load: clamp(a.load + Math.round((Math.random() - 0.5) * 14), 6, 98) }
        )
      );
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Background />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        agents={agents}
        onSelectAgent={setSelectedId}
        onToggleAgent={toggleAgent}
      />

      <div className="mx-auto flex max-w-[1500px] gap-3 p-3 sm:p-4">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <TopBar onCommand={() => setPaletteOpen(true)} />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3"
          >
            <TelemetryPanel metrics={metrics} />

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
              {/* left: core + console + fleet */}
              <div className="flex flex-col gap-3 xl:col-span-8">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <ClaudeCore activeAgents={activeAgents} />
                  </div>
                  <div className="md:col-span-7">
                    <AgentDetail agent={selected} onToggle={toggleAgent} />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <h2 className="text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                      Agent Fleet · {agents.length}
                    </h2>
                    <span className="font-mono text-[10px] text-ink-faint">
                      {activeAgents} active · {agents.length - activeAgents} suspended
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {agents.map((a) => (
                      <AgentCard
                        key={a.id}
                        agent={a}
                        selected={a.id === selectedId}
                        onSelect={() => setSelectedId(a.id)}
                        onToggle={() => toggleAgent(a.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* right: live feed */}
              <div className="xl:col-span-4">
                <div className="xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)]">
                  <ActivityFeed events={events} now={now} />
                </div>
              </div>
            </div>
          </motion.div>

          <footer className="flex items-center justify-between px-1 py-2 font-mono text-[10px] text-ink-faint">
            <span>MISSION CONTROL · local instance</span>
            <span>◎ connected to your Claude</span>
          </footer>
        </div>
      </div>
    </>
  );
}
