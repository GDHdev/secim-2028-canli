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
import { ArrowRight, Radio } from "lucide-react";

/**
 * NewsroomHero — Election-night wall.
 * Tek dramatik açılış momenti: koyu tam genişlik bant, dev Fraunces lider rakamı,
 * canlı şerit, durum istatistikleri. WCAG-AA kontrast, gradient yok, glow yok.
 */
export function NewsroomHero() {
  const leader = CANDIDATES[0];
  const second = CANDIDATES[1];
  const margin = leader.percent - second.percent;

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  // Marquee items
  const tickerItems = [
    `Sayım %${COUNT_PERCENT.toFixed(1)}`,
    `Katılım %86,2 (+0,8 pt)`,
    `Önde: ${leader.name.split(" ").slice(-1)[0]} %${leader.percent.toFixed(1)}`,
    `2. tur ihtimali %${SECOND_ROUND_PROBABILITY}`,
    `Sandık: ${fmtTR(COUNTED_VOTES)} / ${fmtTR(TOTAL_VOTERS)}`,
    `7 parti meclis barajını aştı`,
    `İstanbul · Ankara · İzmir sayım sürüyor`,
  ];
  const tickerRow = (
    <>
      {tickerItems.map((t, i) => (
        <span key={i} className="flex shrink-0 items-center gap-3 px-4">
          <span className="h-1 w-1 rounded-full bg-brand-500" />
          <span>{t}</span>
        </span>
      ))}
    </>
  );

  return (
    <section aria-label="Seçim gecesi duvarı" className="relative bg-gray-900 text-white">
      {/* Subtle dot pattern background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Live ticker tape */}
      <div className="relative border-b border-white/10 bg-black/30">
        <div className="flex items-center">
          <div className="flex shrink-0 items-center gap-2 border-r border-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-500">
            <Radio size={13} className="live-pulse" />
            Canlı
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="ticker-track flex whitespace-nowrap py-2.5 text-[13px] font-medium text-white/85">
              {tickerRow}
              {tickerRow}
            </div>
          </div>
        </div>
      </div>

      {/* Hero body */}
      <div className="site-container relative py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          {/* LEFT — Leader call */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                Cumhurbaşkanlığı · 1. Tur
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                Önde
              </span>
            </div>

            <h1
              className="mt-5 font-display text-[clamp(2.5rem,6vw,5.25rem)] font-medium leading-[0.95] tracking-tight text-white"
              style={{ textWrap: "balance" }}
            >
              {leader.name}
              <span className="ml-3 inline-block align-baseline" style={{ color: leader.color }}>
                önde
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-[15px] text-white/65">
              {leader.party} · {fmtTR(leader.votes)} oy ·{" "}
              <span className="text-white/90">+{margin.toFixed(1)} pt fark</span>{" "}
              <span className="text-white/40">({second.name.split(" ").slice(-1)[0]}'a karşı)</span>
            </p>

            {/* Mega percentage */}
            <div className="mt-8 flex items-baseline gap-6">
              <div
                className="font-display tabular-nums leading-none"
                style={{
                  fontSize: "clamp(5rem, 14vw, 11rem)",
                  color: leader.color,
                  letterSpacing: "-0.04em",
                  fontWeight: 500,
                }}
              >
                <CountUp to={leader.percent} duration={1.4} decimals={1} suffix="%" />
              </div>
              <div className="hidden flex-col gap-1 pb-4 sm:flex">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                  Oy oranı
                </span>
                <span className="font-mono text-sm text-white/70">
                  {fmtTR(leader.votes)} / {fmtTR(COUNTED_VOTES)}
                </span>
              </div>
            </div>

            {/* Race bar — all candidates */}
            <div className="mt-8 space-y-2.5">
              {CANDIDATES.map((c) => (
                <div key={c.id} className="flex items-center gap-3 text-[13px]">
                  <span className="w-28 shrink-0 truncate font-medium text-white/85 md:w-36">
                    {c.name.split(" ").slice(-1)[0]}
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${c.percent}%`, background: c.color }}
                    />
                  </div>
                  <span
                    className="w-14 shrink-0 text-right font-mono font-semibold tabular-nums"
                    style={{ color: c.color }}
                  >
                    {c.percent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/cumhurbaskani"
                className="group inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
              >
                Tüm sonuçlar
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/harita"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Harita
              </Link>
            </div>
          </div>

          {/* RIGHT — Status grid */}
          <div className="grid grid-cols-2 gap-3 self-start lg:gap-4">
            <StatCard
              kicker="Sayım"
              value={`%${COUNT_PERCENT.toFixed(1)}`}
              hint={`${fmtTR(COUNTED_VOTES)} oy sayıldı`}
            />
            <StatCard
              kicker="Katılım"
              value="%86,2"
              hint="2023: %85,4 · +0,8 pt"
              tone="up"
            />
            <StatCard
              kicker="2. Tur ihtimali"
              value={`%${SECOND_ROUND_PROBABILITY}`}
              hint="14 Nisan 2028"
              tone="warning"
            />
            <StatCard kicker="Güncelleme" value={time} hint="Her dakika yenilenir" />
            <div className="col-span-2 rounded-xl border border-white/15 bg-white/[0.04] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                Olası 2. Tur Eşleşmesi
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="font-display text-2xl font-medium leading-tight"
                    style={{ color: leader.color }}
                  >
                    {leader.name.split(" ").slice(-1)[0].toUpperCase()}
                  </p>
                  <p className="truncate text-[11px] text-white/55">{leader.party}</p>
                </div>
                <span className="font-display text-xl font-medium text-white/35">vs</span>
                <div className="min-w-0 text-right">
                  <p
                    className="font-display text-2xl font-medium leading-tight"
                    style={{ color: second.color }}
                  >
                    {second.name.split(" ").slice(-1)[0].toUpperCase()}
                  </p>
                  <p className="truncate text-[11px] text-white/55">{second.party}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  kicker,
  value,
  hint,
  tone,
}: {
  kicker: string;
  value: string;
  hint: string;
  tone?: "up" | "warning";
}) {
  const valueColor =
    tone === "up"
      ? "text-emerald-400"
      : tone === "warning"
      ? "text-amber-300"
      : "text-white";
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
        {kicker}
      </p>
      <p
        className={`mt-1.5 font-display text-3xl font-medium tabular-nums leading-tight ${valueColor}`}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] text-white/55">{hint}</p>
    </div>
  );
}
