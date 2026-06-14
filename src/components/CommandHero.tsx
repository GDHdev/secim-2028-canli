import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  CANDIDATES,
  COUNT_PERCENT,
  COUNTED_VOTES,
  TOTAL_VOTERS,
  SECOND_ROUND_PROBABILITY,
  fmtTR,
} from "@/lib/mock-data";
import { CountUp } from "./CountUp";
import { Activity, ArrowUpRight, Radio, Timer, Flame, Vote } from "lucide-react";

/**
 * COMMAND HERO — Broadcast Midnight dashboard.
 * Solda büyük lider panosu (cam), sağda 4 sinyal kartı.
 * Niş dokunuş: ambient glow (parti rengi), dotted bg, monospace countdown.
 */

const TARGET = new Date("2028-04-14T17:00:00+03:00").getTime();

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return { d: "--", h: "--", m: "--", s: "--", over: false };
  const diff = Math.max(0, TARGET - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return {
    d: String(d).padStart(2, "0"),
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
    over: diff === 0,
  };
}

export function CommandHero() {
  const leader = CANDIDATES[0];
  const second = CANDIDATES[1];
  const gap = leader.percent - second.percent;
  const { d, h, m, s, over } = useCountdown();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section className="relative overflow-hidden border-b border-white/[0.05] bg-background">
      {/* Niş dokunuş: dotted background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.32 0.022 264) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 75% at 50% 0%, black 25%, transparent 80%)",
        }}
      />
      {/* Ambient leader glow */}
      <div
        className="ambient-glow -top-32 left-[10%] h-[480px] w-[680px]"
        style={{ background: leader.color, opacity: 0.18 }}
      />
      <div
        className="ambient-glow -top-40 right-[5%] h-[420px] w-[520px]"
        style={{ background: "oklch(0.62 0.255 25)", opacity: 0.16 }}
      />

      <div className="site-container relative py-10 md:py-14">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-wrap items-center gap-2.5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-error-500/40 bg-error-500/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-error-500 shadow-[0_0_20px_oklch(0.7_0.24_25/0.25)]">
            <span className="live-pulse h-1.5 w-1.5 rounded-full bg-error-500" />
            Canlı Yayın
          </span>
          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-gray-500">
            Cumhurbaşkanlığı · 1. Tur
          </span>
          <span className="text-gray-400/40">/</span>
          <span className="font-mono text-[12px] font-medium tabular-nums text-gray-500">
            14 Mart 2028 · 21:00 GMT+3
          </span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-md border border-white/[0.06] bg-card/[0.04] px-2.5 py-1 text-[11px] font-semibold text-gray-600 md:inline-flex">
            <Radio size={12} className="text-success-500" />
            Veri akışı stabil
          </span>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]"
        >
          {/* LEADER PANEL */}
          <motion.div
            variants={item}
            className="glass-panel relative overflow-hidden p-7 md:p-9"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                  Önde
                </span>
                <span className="h-px w-10 bg-card/[0.1]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  Sıra #1
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-success-500/30 bg-success-500/15 px-2.5 py-1 text-[12px] font-bold text-success-500">
                <ArrowUpRight size={13} strokeWidth={2.5} />
                +{gap.toFixed(1)} pt fark
              </div>
            </div>

            <div className="mt-7 flex items-center gap-6 md:gap-8">
              {leader.photo ? (
                <div
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl shadow-[0_0_40px_-8px_var(--ring-c)] ring-2 ring-offset-4 md:h-28 md:w-28"
                  style={
                    {
                      ["--tw-ring-color" as never]: leader.color,
                      ["--tw-ring-offset-color" as never]: "oklch(0.22 0.022 264)",
                      ["--ring-c" as never]: leader.color,
                    } as React.CSSProperties
                  }
                >
                  <img src={leader.photo} alt={leader.name} className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  {leader.name}
                </p>
                <p className="mt-1 truncate text-base text-gray-500 md:text-lg">{leader.party}</p>
                <div className="mt-3 flex items-baseline gap-3">
                  <CountUp
                    to={leader.percent}
                    decimals={1}
                    duration={1.3}
                    suffix="%"
                    className="font-display text-[80px] font-bold tracking-tighter leading-none md:text-[96px]"
                    style={{
                      color: leader.color,
                      textShadow: `0 0 40px ${leader.color}40`,
                    }}
                  />
                  <span className="font-mono text-base font-medium text-gray-500 tabular-nums">
                    {fmtTR(leader.votes)} oy
                  </span>
                </div>
              </div>
            </div>

            {/* Count progress */}
            <div className="mt-8 rounded-xl border border-white/[0.06] bg-card/[0.03] p-5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-gray-700">
                  <Vote size={14} className="text-brand-500" />
                  Ulusal Sayım
                </span>
                <span className="font-mono text-sm tabular-nums text-gray-500">
                  {fmtTR(COUNTED_VOTES)} / {fmtTR(TOTAL_VOTERS)}
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-card/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${COUNT_PERCENT}%` }}
                  transition={{ duration: 1.8, ease: "easeOut", delay: 0.5 }}
                  className="relative h-full rounded-full race-bar-live shadow-[0_0_20px_-4px_oklch(0.62_0.255_25/0.8)]"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.56 0.24 25), oklch(0.70 0.25 25))",
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Kalan oyların açılmasıyla sıralama değişebilir
                </span>
                <CountUp
                  to={COUNT_PERCENT}
                  decimals={1}
                  duration={1.4}
                  suffix="%"
                  className="font-mono text-base font-bold tabular-nums text-brand-500"
                />
              </div>
            </div>
          </motion.div>

          {/* SIGNAL CARDS — 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            <SignalCard
              variants={item}
              kicker="Projeksiyon"
              icon={<Flame size={15} />}
              label="2. Tur ihtimali"
              value={`%${SECOND_ROUND_PROBABILITY}`}
              hint="14 Nisan · model çıktısı"
              accent="brand"
            />
            <SignalCard
              variants={item}
              kicker="Katılım"
              icon={<Activity size={15} />}
              label="Sandık katılımı"
              value="%86.2"
              hint="2023: %85.4 · +0.8 pt"
              accent="success"
            />
            <SignalCard
              variants={item}
              kicker="Kesinleşen"
              icon={<ArrowUpRight size={15} />}
              label="İl sonucu"
              value="12 / 81"
              hint="+3 il son 1 saatte"
              accent="indigo"
            />
            <SignalCard
              variants={item}
              kicker={over ? "Açıldı" : "Geri sayım"}
              icon={<Timer size={15} />}
              label="2. Tura kalan"
              value={over ? "—" : `${d}g ${h}:${m}:${s}`}
              hint="14 Nisan 2028 · 17:00"
              accent="gray"
              mono
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SignalCard({
  variants,
  kicker,
  icon,
  label,
  value,
  hint,
  accent,
  mono,
}: {
  variants: object;
  kicker: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: "brand" | "success" | "indigo" | "gray";
  mono?: boolean;
}) {
  const accents: Record<typeof accent, { iconWrap: string; glow: string; valueColor: string }> = {
    brand:   { iconWrap: "bg-brand-700/30 text-brand-500 ring-brand-500/30", glow: "oklch(0.62 0.255 25 / 0.18)", valueColor: "text-brand-500" },
    success: { iconWrap: "bg-success-500/15 text-success-500 ring-success-500/30", glow: "oklch(0.70 0.18 152 / 0.18)", valueColor: "text-success-500" },
    indigo:  { iconWrap: "bg-indigo-700/20 text-indigo-700 ring-indigo-700/30", glow: "oklch(0.64 0.18 280 / 0.18)", valueColor: "text-indigo-700" },
    gray:    { iconWrap: "bg-card/[0.06] text-gray-700 ring-white/[0.08]",  glow: "transparent", valueColor: "text-gray-900" },
  };
  const a = accents[accent];

  return (
    <motion.div
      variants={variants as never}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="glass-panel uui-card-hover group relative flex flex-col justify-between overflow-hidden p-4 md:p-5"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl"
        style={{ background: a.glow }}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-500">
          {kicker}
        </span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${a.iconWrap}`}>
          {icon}
        </span>
      </div>
      <div className="relative mt-6">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p
          className={`mt-1 text-3xl font-bold leading-tight tracking-tight ${a.valueColor} ${
            mono ? "font-mono tabular-nums text-2xl md:text-[26px]" : ""
          }`}
        >
          {value}
        </p>
        <p className="mt-1.5 text-[12px] text-gray-500">{hint}</p>
      </div>
    </motion.div>
  );
}
