import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { SECOND_ROUND_PROBABILITY, SECOND_ROUND_TRIGGERED, CANDIDATES } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

export function SecondRoundGauge() {
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const angle = useTransform(value, [0, 100], [-90, 90]);

  useEffect(() => {
    const controls = animate(value, SECOND_ROUND_PROBABILITY, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  const yilmaz = CANDIDATES.find((c) => c.id === "yilmaz")!;
  const kaya = CANDIDATES.find((c) => c.id === "kaya")!;

  const size = 240;
  const cx = size / 2;
  const cy = size * 0.85;
  const r = size * 0.4;

  return (
    <div className="panel flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="eyebrow-accent">2. Tur Projeksiyonu</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          14 Nis · 2028
        </span>
      </div>

      <div className="flex flex-col items-center px-6 pt-6">
        <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.95}`}>
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
                stroke={i % 5 === 0 ? "var(--color-foreground)" : "var(--color-border)"}
                strokeWidth="1.5"
              />
            );
          })}

          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke="var(--color-surface-3)"
            strokeWidth="16"
            fill="none"
          />

          <ProgressArc cx={cx} cy={cy} r={r} value={value} />

          <motion.line
            x1={cx} y1={cy}
            x2={cx} y2={cy - r * 0.95}
            stroke="var(--color-foreground)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ rotate: angle, originX: `${cx}px`, originY: `${cy}px` }}
          />
          <circle cx={cx} cy={cy} r="8" fill="var(--color-foreground)" />
          <circle cx={cx} cy={cy} r="3" fill="var(--color-background)" />
        </svg>

        <span className="-mt-2 font-display text-7xl leading-none text-accent">%{display}</span>
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          ihtimalle ikinci tura gidiliyor
        </p>
      </div>

      {/* Likely matchup */}
      {SECOND_ROUND_TRIGGERED && (
        <>
          <div className="hr-rule mt-5" />
          <div className="px-6 py-4">
            <span className="eyebrow">Olası 2. tur eşleşmesi</span>
            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="text-right">
                <p className="truncate font-display text-xl tracking-tight" style={{ color: yilmaz.color }}>
                  {yilmaz.name.split(" ")[1].toUpperCase()}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">{yilmaz.party}</p>
              </div>
              <span className="font-display text-2xl text-muted-foreground">vs</span>
              <div className="text-left">
                <p className="truncate font-display text-xl tracking-tight" style={{ color: kaya.color }}>
                  {kaya.name.split(" ")[1].toUpperCase()}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">{kaya.party}</p>
              </div>
            </div>

            <Link
              to="/tur2"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-accent bg-accent px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent-foreground transition-colors hover:bg-accent/85"
            >
              Simülatörü Aç →
            </Link>
          </div>
        </>
      )}
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
      strokeWidth="16"
      fill="none"
      strokeLinecap="butt"
      strokeDasharray={circumference}
      style={{ strokeDashoffset: offset }}
    />
  );
}
