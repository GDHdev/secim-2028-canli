import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { SECOND_ROUND_PROBABILITY } from "@/lib/mock-data";

export function SecondRoundGauge() {
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const angle = useTransform(value, [0, 100], [-90, 90]);

  useEffect(() => {
    const controls = animate(value, SECOND_ROUND_PROBABILITY, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  // Half-circle gauge
  const size = 220;
  const cx = size / 2;
  const cy = size * 0.85;
  const r = size * 0.4;

  // Arc background path
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  return (
    <div className="flex flex-col items-center justify-between rounded-sm border border-border bg-surface-1 p-5">
      <div className="mb-1 flex w-full items-center justify-between">
        <span className="font-display text-sm tracking-wider text-muted-foreground">
          2. TUR İHTİMALİ
        </span>
        <span className="font-mono text-xs text-muted-foreground">PROJEKSİYON</span>
      </div>

      <svg width={size} height={size * 0.55} viewBox={`0 0 ${size} ${size * 0.95}`}>
        {/* tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = -90 + (i * 180) / 10;
          const rad = (a * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * (r + 6);
          const y1 = cy + Math.sin(rad) * (r + 6);
          const x2 = cx + Math.cos(rad) * (r + 14);
          const y2 = cy + Math.sin(rad) * (r + 14);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i % 5 === 0 ? "var(--color-muted-foreground)" : "var(--color-border)"}
              strokeWidth="1.5"
            />
          );
        })}

        {/* base arc */}
        <path d={arcPath} stroke="var(--color-surface-2)" strokeWidth="14" fill="none" strokeLinecap="butt" />

        {/* progress arc - we use motion path via dasharray */}
        <ProgressArc cx={cx} cy={cy} r={r} value={value} />

        {/* needle */}
        <motion.line
          x1={cx} y1={cy}
          x2={cx} y2={cy - r * 0.95}
          stroke="var(--color-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ rotate: angle, originX: `${cx}px`, originY: `${cy}px` }}
        />
        <circle cx={cx} cy={cy} r="6" fill="var(--color-accent)" />
        <circle cx={cx} cy={cy} r="2" fill="var(--color-background)" />
      </svg>

      <div className="-mt-2 flex items-baseline gap-1">
        <span className="font-display text-6xl text-accent">%{display}</span>
      </div>
      <p className="mt-1 max-w-[200px] text-center text-xs text-muted-foreground">
        Mevcut oy dağılımına göre ikinci tur olasılığı
      </p>
    </div>
  );
}

function ProgressArc({ cx, cy, r, value }: { cx: number; cy: number; r: number; value: import("framer-motion").MotionValue<number> }) {
  const circumference = Math.PI * r;
  const offset = useTransform(value, (v) => circumference - (v / 100) * circumference);
  return (
    <motion.path
      d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
      stroke="var(--color-accent)"
      strokeWidth="14"
      fill="none"
      strokeLinecap="butt"
      strokeDasharray={circumference}
      style={{ strokeDashoffset: offset }}
    />
  );
}
