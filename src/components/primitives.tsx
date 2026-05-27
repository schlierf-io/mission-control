"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/** True only after the first client mount — use to gate time/random-derived
 *  rendering so it never runs during SSR (prevents hydration mismatch). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const mark = () => setMounted(true);
    mark();
  }, []);
  return mounted;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [mv, value]);
  return <motion.span className={className}>{rounded}</motion.span>;
}

export function Sparkline({
  data,
  color,
  height = 40,
  className,
}: {
  data: number[];
  color: string;
  height?: number;
  className?: string;
}) {
  const w = 100;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${height} ${line} ${w},${height}`;
  const gid = `spark-${color.replace("#", "")}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

export function StatusDot({ color, pulse }: { color: string; pulse: boolean }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full rounded-full"
          style={{ background: color, animation: "pulse-ring 1.8s ease-out infinite" }}
        />
      )}
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
    </span>
  );
}

export function RadialGauge({
  value,
  label,
  unit,
  color,
  size = 132,
}: {
  value: number;
  label: string;
  unit?: string;
  color: string;
  size?: number;
}) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arc = 0.75; // 270deg gauge
  const offset = c * (1 - (value / 100) * arc);
  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - arc)}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeLinecap="round"
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="font-mono text-2xl font-semibold tabular-nums text-glow"
          style={{ color }}
        >
          <AnimatedNumber value={value} />
          {unit && <span className="text-sm text-muted">{unit}</span>}
        </div>
        <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">
          {label}
        </div>
      </div>
    </div>
  );
}
