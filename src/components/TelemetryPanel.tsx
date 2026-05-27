"use client";

import { Gauge } from "lucide-react";
import type { Metric } from "@/lib/types";
import { RadialGauge } from "./primitives";

export default function TelemetryPanel({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-dim">
        <Gauge className="h-3.5 w-3.5 text-cyan" />
        System Vitals
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <RadialGauge
            key={m.key}
            value={m.value}
            max={m.max}
            accent={m.accent}
            label={m.label}
            unit={m.unit}
          />
        ))}
      </div>
    </div>
  );
}
