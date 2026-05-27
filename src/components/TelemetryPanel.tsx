"use client";

import { useMission } from "@/lib/store";
import { RadialGauge } from "./primitives";
import { SectionHeader } from "./AgentGrid";

export function TelemetryPanel() {
  const { metrics } = useMission();
  const gauges = [
    { value: metrics.cohesion, label: "Cohesion", color: "#34d399", unit: "%" },
    { value: metrics.throughput, label: "Throughput", color: "#22d3ee", unit: "%" },
    { value: metrics.latency, label: "Latency", color: "#fbbf24", unit: "ms" },
    { value: metrics.memory, label: "Context", color: "#a855f7", unit: "%" },
  ];
  return (
    <section>
      <SectionHeader title="System Telemetry" hint="live" />
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 glass p-4 sm:grid-cols-4 lg:grid-cols-2">
        {gauges.map((g) => (
          <div key={g.label} className="flex items-center justify-center py-1">
            <RadialGauge
              value={g.value}
              label={g.label}
              unit={g.unit}
              color={g.color}
              size={120}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
