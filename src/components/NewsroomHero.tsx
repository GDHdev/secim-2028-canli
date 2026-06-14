import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CANDIDATES,
  COUNT_PERCENT,
  COUNTED_VOTES,
  TOTAL_VOTERS,
  SECOND_ROUND_PROBABILITY,
  fmtTR,
} from "@/lib/mock-data";
import { CountUp } from "@/components/CountUp";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * NewsroomHero — Bloomberg-Terminal seçim duvarı.
 * Tek tam-genişlik koyu blok: monospace data grid, hairline çerçeveler,
 * dev rakamlar, amber/yeşil/kırmızı durum vurgusu. Glow yok, gradient yok.
 */
export function NewsroomHero() {
  const leader = CANDIDATES[0];
  const second = CANDIDATES[1];
  const margin = leader.percent - second.percent;

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";

  return (
    <section aria-label="Seçim gecesi terminali" className="terminal-section relative">
      {/* Section header bar */}
      <div className="border-b border-[#232A35]">
        <div className="site-container flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span className="term-tag" style={{ color: "#fff", background: "var(--color-brand-600)", borderColor: "var(--color-brand-600)" }}>
              <span className="live-pulse h-1.5 w-1.5 rounded-full bg-white" />
              LIVE
            </span>
            <span className="term-label term-label-light">SECIM/2028 · CB · 1.TUR</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="term-label term-label-light">SAYIM</span>
            <span className="term-num text-sm text-white">{COUNT_PERCENT.toFixed(2)}%</span>
            <span className="term-label term-label-light hidden sm:inline">UTC+3</span>
            <span className="term-num text-sm text-white tabular-nums">{time}</span>
          </div>
        </div>
      </div>

      {/* Hero body — 12 col implicit via 2-col split */}
      <div className="site-container py-8 md:py-10">
        <div className="grid grid-cols-1 gap-px bg-[#232A35] lg:grid-cols-[1.5fr_1fr]">
          {/* LEFT — Leader call */}
          <div className="bg-[#0A0D12] p-6 md:p-8">
            <div className="flex items-center gap-2">
              <span className="term-label">[01]</span>
              <span className="term-label">LIDER</span>
              <span className="ml-auto term-label" style={{ color: leader.color }}>
                ▲ +{margin.toFixed(1)} pt
              </span>
            </div>

            <h1
              className="mt-3 font-display text-[clamp(2.25rem,5vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white"
              style={{ textWrap: "balance" }}
            >
              {leader.name}
            </h1>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.16em] text-white/55">
              {leader.party}
            </p>

            {/* Mega percentage */}
            <div className="mt-6 flex items-end gap-6 border-y border-[#232A35] py-6">
              <div
                className="term-num font-display leading-none"
                style={{
                  fontSize: "clamp(4rem, 12vw, 9rem)",
                  color: leader.color,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                <CountUp to={leader.percent} duration={1.4} decimals={1} />
                <span style={{ fontSize: "0.4em", verticalAlign: "0.5em", marginLeft: "0.1em" }}>%</span>
              </div>
              <div className="flex flex-1 flex-col gap-2 pb-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="term-label">OY</span>
                  <span className="term-num text-sm text-white">{fmtTR(leader.votes)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="term-label">SAYILAN</span>
                  <span className="term-num text-sm text-white">{fmtTR(COUNTED_VOTES)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="term-label">SECMEN</span>
                  <span className="term-num text-sm text-white/60">{fmtTR(TOTAL_VOTERS)}</span>
                </div>
              </div>
            </div>

            {/* Race bar — all candidates */}
            <div className="mt-6 divide-y divide-[#1A1F28] border-y border-[#232A35]">
              {CANDIDATES.map((c, i) => (
                <div key={c.id} className="flex items-center gap-4 py-2.5 text-[13px]">
                  <span className="term-num w-6 text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="w-32 shrink-0 truncate font-semibold text-white md:w-44">
                    {c.name}
                  </span>
                  <div className="relative h-1.5 flex-1 overflow-hidden bg-white/10">
                    <div
                      className="h-full transition-[width] duration-700 ease-out"
                      style={{ width: `${c.percent}%`, background: c.color }}
                    />
                  </div>
                  <span
                    className="term-num w-16 shrink-0 text-right text-sm font-semibold"
                    style={{ color: c.color }}
                  >
                    {c.percent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                to="/sonuclar"
                className="group inline-flex items-center gap-1.5 bg-white px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-gray-900 transition-colors hover:bg-[#FFB000]"
              >
                Tüm sonuçlar
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/harita"
                className="inline-flex items-center gap-1.5 border border-white/25 px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white hover:bg-white/5"
              >
                Harita →
              </Link>
              <Link
                to="/tur2"
                className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white"
              >
                2. tur simülatörü →
              </Link>
            </div>
          </div>

          {/* RIGHT — Terminal status grid */}
          <div className="grid grid-cols-2 gap-px bg-[#232A35]">
            <TermStat label="SAYIM" value={`${COUNT_PERCENT.toFixed(1)}%`} sub={`${fmtTR(COUNTED_VOTES)} oy`} />
            <TermStat label="KATILIM" value="86.2%" sub="2023: 85.4% · +0.8 pt" tone="up" />
            <TermStat label="2.TUR" value={`${SECOND_ROUND_PROBABILITY}%`} sub="14 Nis 2028 · projeksiyon" tone="amber" />
            <TermStat label="MARJ" value={`+${margin.toFixed(1)}pt`} sub={`${leader.name.split(" ").slice(-1)[0]} vs ${second.name.split(" ").slice(-1)[0]}`} tone="amber" />
            {/* 2. tur matchup full width */}
            <div className="col-span-2 bg-[#0A0D12] p-5">
              <div className="flex items-center justify-between">
                <span className="term-label">OLASI 2.TUR EŞLEŞMESİ</span>
                <span className="term-label term-amber">P = {SECOND_ROUND_PROBABILITY}%</span>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-extrabold leading-tight tracking-tight" style={{ color: leader.color }}>
                    {leader.name.split(" ").slice(-1)[0].toUpperCase()}
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{leader.party}</p>
                  <p className="term-num mt-2 text-sm text-white">{leader.percent.toFixed(1)}%</p>
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/30">vs</span>
                <div className="min-w-0 text-right">
                  <p className="font-display text-2xl font-extrabold leading-tight tracking-tight" style={{ color: second.color }}>
                    {second.name.split(" ").slice(-1)[0].toUpperCase()}
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{second.party}</p>
                  <p className="term-num mt-2 text-sm text-white">{second.percent.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Movers row */}
            <div className="col-span-2 bg-[#0A0D12] p-5">
              <div className="flex items-center justify-between">
                <span className="term-label">SON HAREKET · İLLER</span>
                <Link to="/harita" className="term-label term-amber inline-flex items-center gap-1 hover:underline">
                  HARİTA <ArrowUpRight size={10} />
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                {[
                  { name: "İSTANBUL", delta: "+1.2", up: true },
                  { name: "ANKARA", delta: "+0.4", up: true },
                  { name: "İZMİR", delta: "-0.3", up: false },
                ].map((m) => (
                  <div key={m.name} className="border border-[#232A35] px-2.5 py-2">
                    <p className="term-label">{m.name}</p>
                    <p className={`term-num mt-1 text-sm font-semibold ${m.up ? "term-up" : "term-down"}`}>
                      {m.up ? "▲" : "▼"} {m.delta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TermStat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "up" | "down" | "amber";
}) {
  const valueClass =
    tone === "up" ? "term-up" : tone === "down" ? "term-down" : tone === "amber" ? "term-amber" : "text-white";
  return (
    <div className="bg-[#0A0D12] p-5">
      <p className="term-label">{label}</p>
      <p className={`term-num mt-2 text-[28px] font-extrabold leading-none ${valueClass}`}>{value}</p>
      <p className="mt-2 font-mono text-[11px] text-white/50">{sub}</p>
    </div>
  );
}
