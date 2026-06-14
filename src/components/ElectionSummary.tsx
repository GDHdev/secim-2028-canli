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
import {
  ArrowRight,
  Activity,
  Users,
  Flag,
  Vote,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";

/**
 * ElectionSummary — Sayfanın en üstündeki büyük özet bloğu.
 * Untitled UI estetiği: beyaz yüzeyler, büyük tipografi, renkli ikon nişanları.
 */
export function ElectionSummary() {
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
  const dateStr = now
    ? now.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
    : "--";

  const stats: Stat[] = [
    {
      icon: Vote,
      tone: "brand",
      label: "Sayım",
      value: `%${COUNT_PERCENT.toFixed(1)}`,
      hint: `${fmtTR(COUNTED_VOTES)} oy sayıldı`,
    },
    {
      icon: Users,
      tone: "indigo",
      label: "Katılım",
      value: "%86,2",
      hint: "2023'e göre +0,8 puan",
      delta: "up",
    },
    {
      icon: Flag,
      tone: "warning",
      label: "Önde",
      value: leader.name.split(" ").slice(-1)[0],
      hint: `%${leader.percent.toFixed(1)} · ${leader.party}`,
    },
    {
      icon: Activity,
      tone: "violet",
      label: "2. Tur Olasılığı",
      value: `%${SECOND_ROUND_PROBABILITY}`,
      hint: "Projeksiyon — 14 Nis 2028",
    },
    {
      icon: TrendingUp,
      tone: "success",
      label: "Lider Farkı",
      value: `+${margin.toFixed(1)} pt`,
      hint: `${leader.name.split(" ").slice(-1)[0]} vs ${second.name.split(" ").slice(-1)[0]}`,
      delta: "up",
    },
    {
      icon: Clock,
      tone: "gray",
      label: "Son güncelleme",
      value: time,
      hint: dateStr,
    },
  ];

  return (
    <section aria-label="Seçim 2028 özeti" className="relative overflow-hidden hero-mesh border-b border-gray-200">
      <div className="site-container py-12 md:py-16">
        {/* Top meta row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="uui-badge uui-badge-error uui-badge-live">CANLI</span>
          <span className="uui-badge uui-badge-gray">{dateStr}</span>
          <span className="uui-badge uui-badge-violet">
            <Sparkles size={13} />
            AI destekli asistan
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          {/* LEFT — Headline */}
          <div>
            <p className="eyebrow">Türkiye Cumhurbaşkanlığı Seçimi · 1. Tur</p>
            <h1 className="mt-3 font-display text-display-xl text-balance text-gray-900">
              Sandıkların{" "}
              <span style={{ color: "var(--color-brand-600)" }}>%{COUNT_PERCENT.toFixed(0)}</span>'i
              sayıldı, ülke{" "}
              <span style={{ color: leader.color }}>{leader.name.split(" ").slice(-1)[0]}</span>'a
              dönüyor.
            </h1>
            <p className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-gray-600">
              64,1 milyon seçmen 14 Mart 2028'de sandığa gitti. Saat {time} itibarıyla{" "}
              <strong className="font-semibold text-gray-900">{leader.name}</strong> %{leader.percent.toFixed(1)} ile lider;{" "}
              ikinci tur olasılığı{" "}
              <strong className="font-semibold text-gray-900">%{SECOND_ROUND_PROBABILITY}</strong>.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/sonuclar" className="uui-btn uui-btn-xl uui-btn-primary">
                Tüm sonuçlar
                <ArrowRight size={16} />
              </Link>
              <Link to="/harita" className="uui-btn uui-btn-xl uui-btn-secondary">
                İl il harita
              </Link>
              <Link to="/tur2" className="uui-btn uui-btn-xl uui-btn-ghost">
                2. tur simülatörü
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* RIGHT — Leader spotlight card */}
          <div className="uui-card relative overflow-hidden p-6 md:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
              style={{ background: leader.color }}
            />
            <div className="flex items-center justify-between">
              <span className="uui-badge uui-badge-brand">
                <Flag size={13} />
                ŞU AN LİDER
              </span>
              <span className="text-[13px] font-mono font-semibold text-gray-500 tabular-nums">
                +{margin.toFixed(1)} pt
              </span>
            </div>
            <div className="mt-5 flex items-center gap-4">
              {leader.photo && (
                <img
                  src={leader.photo}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md"
                />
              )}
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold uppercase tracking-wider text-gray-500">
                  {leader.party}
                </p>
                <p className="mt-0.5 truncate font-display text-2xl font-bold text-gray-900">
                  {leader.name}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-end gap-5 border-y border-gray-200 py-5">
              <div
                className="font-display leading-none tabular-nums"
                style={{
                  fontSize: "clamp(3.75rem, 9vw, 6rem)",
                  color: leader.color,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                <CountUp to={leader.percent} duration={1.4} decimals={1} />
                <span style={{ fontSize: "0.42em", verticalAlign: "0.55em", marginLeft: "0.08em" }}>%</span>
              </div>
              <dl className="flex-1 space-y-1.5 pb-2 text-[14px]">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-gray-500">Oy</dt>
                  <dd className="font-mono font-semibold text-gray-900 tabular-nums">{fmtTR(leader.votes)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-gray-500">Sayılan</dt>
                  <dd className="font-mono font-semibold text-gray-900 tabular-nums">{fmtTR(COUNTED_VOTES)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-gray-500">Toplam seçmen</dt>
                  <dd className="font-mono text-gray-700 tabular-nums">{fmtTR(TOTAL_VOTERS)}</dd>
                </div>
              </dl>
            </div>

            {/* Mini race */}
            <div className="mt-5 space-y-2.5">
              {CANDIDATES.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-32 truncate text-[14px] font-semibold text-gray-900 md:w-40">
                    {c.name}
                  </span>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{ width: `${c.percent}%`, background: c.color }}
                    />
                  </div>
                  <span
                    className="w-14 shrink-0 text-right font-mono text-[14px] font-semibold tabular-nums"
                    style={{ color: c.color }}
                  >
                    %{c.percent.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <StatTile key={s.label} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Tone = "brand" | "indigo" | "violet" | "warning" | "success" | "gray";
type Stat = {
  icon: typeof Vote;
  tone: Tone;
  label: string;
  value: string;
  hint: string;
  delta?: "up" | "down";
};

function StatTile({ stat }: { stat: Stat }) {
  const toneClass: Record<Tone, string> = {
    brand: "",
    indigo: "uui-feat-icon-indigo",
    violet: "uui-feat-icon-violet",
    warning: "uui-feat-icon-warning",
    success: "uui-feat-icon-success",
    gray: "uui-feat-icon-gray",
  };
  const Icon = stat.icon;
  return (
    <div className="uui-card uui-card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`uui-feat-icon ${toneClass[stat.tone]}`} style={{ width: 44, height: 44, borderRadius: 11 }}>
          <Icon size={20} />
        </span>
        {stat.delta === "up" && (
          <span className="uui-badge uui-badge-success" style={{ padding: "2px 8px", fontSize: 12 }}>
            ▲
          </span>
        )}
      </div>
      <p className="mt-4 text-[13px] font-semibold uppercase tracking-wider text-gray-500">
        {stat.label}
      </p>
      <p className="mt-1 font-display text-[1.875rem] font-bold leading-tight text-gray-900 tabular-nums">
        {stat.value}
      </p>
      <p className="mt-1 truncate text-[13.5px] text-gray-500">{stat.hint}</p>
    </div>
  );
}
