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
 * COMMAND HERO — Modern SaaS dashboard "command center".
 * Solda büyük canlı sayım panosu (lider + fark + sayım barı).
 * Sağda 4 sinyal kartı: 2. tur olasılığı, katılım, sayılan il, kalan süre.
 * Light, dense, animated. Niş dokunuş: dotted radial bg + canlı pulse.
 */

const TARGET = new Date("2028-03-14T17:00:00+03:00").getTime();

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return { h: "--", m: "--", s: "--", over: true };
  const diff = Math.max(0, TARGET - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return {
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
  const { h, m, s, over } = useCountdown();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-white via-gray-25 to-gray-50">
      {/* Niş dokunuş: dotted radial background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.847 0.012 247) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.93 0.045 25 / 0.7), transparent)",
        }}
      />

      <div className="site-container relative py-8 md:py-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex flex-wrap items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-error-500/30 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-error-600 shadow-xs">
            <span className="live-pulse h-1.5 w-1.5 rounded-full bg-error-500" />
            Canlı Yayın
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Cumhurbaşkanlığı · 1. Tur
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-[11px] font-medium tabular-nums text-gray-500">
            14 Mart 2028 · 21:00 GMT+3
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600">
            <Radio size={11} className="text-success-600" />
            Veri akışı stabil
          </span>
        </motion.div>

        {/* Grid: lider panel + sinyaller */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]"
        >
          {/* LEADER PANEL */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
          >
            {/* Accent corner */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-30 blur-2xl"
              style={{ background: leader.color }}
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                  Önde
                </span>
                <span className="h-px w-8 bg-gray-200" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  Sıra #1
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-success-500/25 bg-success-500/10 px-2 py-0.5 text-[11px] font-semibold text-success-600">
                <ArrowUpRight size={12} strokeWidth={2.5} />
                +{gap.toFixed(1)} pt fark
              </div>
            </div>

            <div className="mt-6 flex items-center gap-5 md:gap-7">
              {leader.photo ? (
                <div
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-4 ring-offset-2 ring-offset-white md:h-24 md:w-24"
                  style={{ ["--tw-ring-color" as never]: leader.color }}
                >
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
                  {leader.name}
                </p>
                <p className="mt-0.5 truncate text-sm text-gray-500 md:text-base">
                  {leader.party}
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <CountUp
                    to={leader.percent}
                    decimals={1}
                    duration={1.2}
                    suffix="%"
                    className="font-display text-5xl font-semibold tracking-tight md:text-6xl"
                    style={{ color: leader.color }}
                  />
                  <span className="text-sm font-medium text-gray-500 tabular-nums">
                    {fmtTR(leader.votes)} oy
                  </span>
                </div>
              </div>
            </div>

            {/* Count progress bar */}
            <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide text-gray-600">
                  <Vote size={12} className="text-brand-600" />
                  Ulusal Sayım
                </span>
                <span className="font-mono tabular-nums text-gray-500">
                  {fmtTR(COUNTED_VOTES)} / {fmtTR(TOTAL_VOTERS)}
                </span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-200/70">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${COUNT_PERCENT}%` }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
                  className="relative h-full rounded-full race-bar-live"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-brand-500), var(--color-brand-700))",
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Kalan oyların açılmasıyla sıralama değişebilir
                </span>
                <CountUp
                  to={COUNT_PERCENT}
                  decimals={1}
                  duration={1.4}
                  suffix="%"
                  className="font-mono text-sm font-semibold tabular-nums text-brand-700"
                />
              </div>
            </div>
          </motion.div>

          {/* SIGNAL CARDS */}
          <div className="grid grid-cols-2 gap-3">
            <SignalCard
              variants={item}
              kicker="Projeksiyon"
              icon={<Flame size={14} />}
              label="2. Tur"
              value={`%${SECOND_ROUND_PROBABILITY}`}
              hint="14 Nis · model"
              accent="brand"
            />
            <SignalCard
              variants={item}
              kicker="Katılım"
              icon={<Activity size={14} />}
              label="Sandık"
              value="%86.2"
              hint="2023: %85.4"
              accent="success"
            />
            <SignalCard
              variants={item}
              kicker="Kesinleşen"
              icon={<ArrowUpRight size={14} />}
              label="İl"
              value="12 / 81"
              hint="+3 son 1 sa."
              accent="indigo"
            />
            <SignalCard
              variants={item}
              kicker={over ? "Açıldı" : "Açılmaya"}
              icon={<Timer size={14} />}
              label="2. Tur süre"
              value={over ? "—" : `${h}:${m}:${s}`}
              hint="14 Nisan 17:00"
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
  variants: typeof undefined | object;
  kicker: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: "brand" | "success" | "indigo" | "gray";
  mono?: boolean;
}) {
  const accents: Record<typeof accent, { iconWrap: string; ring: string; valueColor: string }> = {
    brand:   { iconWrap: "bg-brand-50 text-brand-700",       ring: "ring-brand-100",     valueColor: "text-brand-700" },
    success: { iconWrap: "bg-success-500/10 text-success-600", ring: "ring-success-500/15", valueColor: "text-success-600" },
    indigo:  { iconWrap: "bg-indigo-700/10 text-indigo-700",  ring: "ring-indigo-700/10",  valueColor: "text-indigo-700" },
    gray:    { iconWrap: "bg-gray-100 text-gray-700",          ring: "ring-gray-100",       valueColor: "text-gray-900" },
  };
  const a = accents[accent];

  return (
    <motion.div
      variants={variants as never}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={`group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs ring-1 ${a.ring} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
          {kicker}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${a.iconWrap}`}>
          {icon}
        </span>
      </div>
      <div className="mt-5">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p
          className={`mt-0.5 text-2xl font-semibold leading-tight tracking-tight ${a.valueColor} ${
            mono ? "font-mono tabular-nums" : ""
          }`}
        >
          {value}
        </p>
        <p className="mt-1 text-[11px] text-gray-500">{hint}</p>
      </div>
    </motion.div>
  );
}
