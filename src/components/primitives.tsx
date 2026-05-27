"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import type { Accent } from "@/lib/types";
import { ACCENT_HEX, rgba } from "@/lib/accents";

/* Animated number that counts up when scrolled into view */
export function CountUp({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

/* Pulsing status indicator */
export function StatusDot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-70"
        style={{ background: color, animation: "pulse-glow 2.4s ease-in-out infinite" }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, background: color, boxShadow: `0 0 10px ${color}` }}
      />
    </span>
  );
}

/* Lightweight SVG sparkline */
export function Sparkline({
  data,
  accent,
  width = 120,
  height = 36,
}: {
  data: number[];
  accent: Accent;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d - min) / range) * (height - 6) - 3;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const id = `spk-${accent}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(accent, 0.35)} />
          <stop offset="100%" stopColor={rgba(accent, 0)} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={ACCENT_HEX[accent]}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r={2.4}
        fill={ACCENT_HEX[accent]}
        style={{ filter: `drop-shadow(0 0 4px ${ACCENT_HEX[accent]})` }}
      />
    </svg>
  );
}

/* Radial progress gauge */
export function RadialGauge({
  value,
  max,
  accent,
  size = 92,
  label,
  unit,
}: {
  value: number;
  max: number;
  accent: Accent;
  size?: number;
  label: string;
  unit: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setV,
    });
    return () => c.stop();
  }, [inView, value]);

  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(v / max, 1);
  const offset = circ * (1 - pct);
  const hex = ACCENT_HEX[accent];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg ref={ref} width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={hex}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${rgba(accent, 0.7)})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-lg font-semibold tabular-nums" style={{ color: hex }}>
            {Math.round(v)}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-ink-faint">{unit}</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-[0.18em] text-ink-dim">{label}</span>
    </div>
  );
}
