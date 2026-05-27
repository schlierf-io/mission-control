"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Agent,
  AgentStatus,
  LogEvent,
  LogLevel,
  SystemMetrics,
  Task,
} from "./types";
import {
  initialMetrics,
  seedAgents,
  seedLogs,
  seedTasks,
} from "./seed";

interface MissionState {
  agents: Agent[];
  tasks: Task[];
  logs: LogEvent[];
  metrics: SystemMetrics;
  selectedAgentId: string | null;
  select: (id: string | null) => void;
  setStatus: (id: string, status: AgentStatus) => void;
  toggleAgent: (id: string) => void;
  boostAgent: (id: string) => void;
  pauseAll: () => void;
  resumeAll: () => void;
  dispatch: (title: string, agentId?: string) => void;
  log: (level: LogLevel, message: string, agentId?: string) => void;
}

const Ctx = createContext<MissionState | null>(null);

let counter = 0;
const uid = (p: string) => `${p}-${Date.now()}-${counter++}`;

const chatter: { level: LogLevel; tpl: (a: Agent) => string }[] = [
  { level: "agent", tpl: (a) => `${a.name} streamed a tool call` },
  { level: "agent", tpl: (a) => `${a.name} read 3 files into context` },
  { level: "success", tpl: (a) => `${a.name} closed a sub-task` },
  { level: "info", tpl: (a) => `${a.name} requested model ${a.model}` },
  { level: "action", tpl: (a) => `${a.name} spawned a verification pass` },
  { level: "agent", tpl: (a) => `${a.name} committed reasoning checkpoint` },
  { level: "warn", tpl: (a) => `${a.name} hit a rate ceiling, backing off` },
];

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(seedAgents);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [logs, setLogs] = useState<LogEvent[]>(seedLogs);
  const [metrics, setMetrics] = useState<SystemMetrics>(initialMetrics);
  const [selectedAgentId, setSelected] = useState<string | null>(null);

  const agentsRef = useRef(agents);
  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);

  const log = useCallback(
    (level: LogLevel, message: string, agentId?: string) => {
      setLogs((prev) =>
        [
          { id: uid("log"), time: Date.now(), level, message, agentId },
          ...prev,
        ].slice(0, 60),
      );
    },
    [],
  );

  // Live telemetry tick
  useEffect(() => {
    const t = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => {
          const live = a.status === "active" || a.status === "thinking";
          const target = live ? (a.status === "thinking" ? 86 : 64) : a.status === "paused" ? 6 : 22;
          const next = Math.max(
            2,
            Math.min(100, a.load + (target - a.load) * 0.15 + (Math.random() - 0.5) * 16),
          );
          return {
            ...a,
            load: next,
            tokensPerMin: live
              ? Math.round(Math.max(0, a.tokensPerMin * 0.85 + next * 60 + (Math.random() - 0.4) * 600))
              : Math.round(a.tokensPerMin * 0.6),
            uptimeMins: a.uptimeMins + 0.05,
            history: [...a.history.slice(1), next],
          };
        }),
      );

      setMetrics((m) => {
        const live = agentsRef.current.filter(
          (a) => a.status === "active" || a.status === "thinking",
        );
        const avgLoad =
          live.reduce((s, a) => s + a.load, 0) / Math.max(1, live.length);
        const drift = (v: number, t: number) => v + (t - v) * 0.2 + (Math.random() - 0.5) * 4;
        return {
          cohesion: Math.round(Math.max(60, Math.min(99, drift(m.cohesion, 90 + live.length)))),
          throughput: Math.round(Math.max(5, Math.min(100, drift(m.throughput, avgLoad)))),
          latency: Math.round(Math.max(12, Math.min(140, drift(m.latency, 60 - live.length * 4)))),
          memory: Math.round(Math.max(20, Math.min(95, drift(m.memory, 45 + live.length * 6)))),
        };
      });

      setTasks((prev) =>
        prev.map((task) => {
          if (task.state !== "running") return task;
          const inc = 0.6 + Math.random() * 3.4;
          const progress = Math.min(100, task.progress + inc);
          return {
            ...task,
            progress,
            state: progress >= 100 ? "done" : "running",
          };
        }),
      );
    }, 1400);
    return () => clearInterval(t);
  }, []);

  // Ambient activity feed
  useEffect(() => {
    const t = setInterval(() => {
      const live = agentsRef.current.filter(
        (a) => a.status === "active" || a.status === "thinking",
      );
      if (!live.length) return;
      const a = live[Math.floor(Math.random() * live.length)];
      const c = chatter[Math.floor(Math.random() * chatter.length)];
      log(c.level, c.tpl(a), a.id);
    }, 2600);
    return () => clearInterval(t);
  }, [log]);

  const setStatus = useCallback(
    (id: string, status: AgentStatus) => {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    },
    [],
  );

  const toggleAgent = useCallback(
    (id: string) => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          const next: AgentStatus = a.status === "paused" || a.status === "idle" ? "active" : "paused";
          log(
            next === "active" ? "success" : "warn",
            `${a.name} ${next === "active" ? "resumed" : "paused"} by operator`,
            a.id,
          );
          return { ...a, status: next, currentTask: next === "paused" ? "Paused by operator" : "Spinning up…" };
        }),
      );
    },
    [log],
  );

  const boostAgent = useCallback(
    (id: string) => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          log("action", `${a.name} boosted to priority lane`, a.id);
          return { ...a, status: "thinking", load: Math.min(100, a.load + 22) };
        }),
      );
    },
    [log],
  );

  const pauseAll = useCallback(() => {
    setAgents((prev) => prev.map((a) => ({ ...a, status: "paused" as AgentStatus })));
    log("warn", "Fleet-wide pause engaged");
  }, [log]);

  const resumeAll = useCallback(() => {
    setAgents((prev) => prev.map((a) => ({ ...a, status: "active" as AgentStatus })));
    log("success", "Fleet resumed · all systems go");
  }, [log]);

  const dispatch = useCallback(
    (title: string, agentId?: string) => {
      const pool = agentsRef.current;
      const target =
        agentId ?? pool[Math.floor(Math.random() * pool.length)].id;
      const agent = pool.find((a) => a.id === target);
      setTasks((prev) => [
        {
          id: uid("task"),
          title,
          agentId: target,
          state: "running",
          progress: 0,
          eta: `${4 + Math.floor(Math.random() * 30)}m`,
        },
        ...prev,
      ]);
      setAgents((prev) =>
        prev.map((a) =>
          a.id === target
            ? { ...a, status: "active", currentTask: title }
            : a,
        ),
      );
      log("action", `Dispatched “${title}” → ${agent?.name ?? "fleet"}`, target);
    },
    [log],
  );

  const value = useMemo<MissionState>(
    () => ({
      agents,
      tasks,
      logs,
      metrics,
      selectedAgentId,
      select: setSelected,
      setStatus,
      toggleAgent,
      boostAgent,
      pauseAll,
      resumeAll,
      dispatch,
      log,
    }),
    [
      agents,
      tasks,
      logs,
      metrics,
      selectedAgentId,
      setStatus,
      toggleAgent,
      boostAgent,
      pauseAll,
      resumeAll,
      dispatch,
      log,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMission() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMission must be used within MissionProvider");
  return ctx;
}
