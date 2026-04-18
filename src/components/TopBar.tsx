import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  COUNTED_VOTES, COUNT_PERCENT, TOTAL_VOTERS, fmtTR, LIVE_FEED, MEGA_STATS,
  type MegaStatIcon,
} from "@/lib/mock-data";
import {
  ArrowUpRight, ArrowDownRight,
  Vote, Trophy, Repeat, Users, CheckCircle2, Landmark, Zap,
} from "lucide-react";
import gdhLogo from "@/assets/gdh-logo.svg";

const NAV = [
  { to: "/", label: "GENEL" },
  { to: "/harita", label: "HARİTA" },
  { to: "/sonuclar", label: "SONUÇLAR" },
  { to: "/milletvekili", label: "MİLLETVEKİLİ" },
  { to: "/tur2", label: "2. TUR" },
  { to: "/anketler", label: "ANKETLER" },
  { to: "/haberler", label: "HABERLER" },
] as const;

const ICONS: Record<MegaStatIcon, React.ComponentType<{ size?: number; className?: string }>> = {
  vote: Vote,
  leader: Trophy,
  runoff: Repeat,
  turnout: Users,
  checked: CheckCircle2,
  parliament: Landmark,
};

const toneAccent: Record<string, { bg: string; fg: string }> = {
  default: { bg: "bg-gray-100", fg: "text-gray-700" },
  primary: { bg: "bg-brand-50", fg: "text-brand-700" },
  accent:  { bg: "bg-brand-50", fg: "text-brand-700" },
  success: { bg: "bg-success-500/10", fg: "text-success-600" },
  indigo:  { bg: "bg-indigo-700/10", fg: "text-indigo-700" },
};

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      {/* Row 0 — breaking ticker (en üstte) */}
      <BreakingTicker />

      {/* Row 1 — masthead */}
      <div className="site-container flex items-center gap-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={gdhLogo}
            alt="GDH"
            className="h-8 w-auto md:h-9"
          />
          <span className="hidden h-8 w-px bg-gray-200 md:block" />
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Seçim Merkezi
            </span>
            <span className="text-base font-semibold tracking-tight text-gray-900">
              2028
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <span className="uui-badge uui-badge-error uui-badge-live">Canlı</span>
          <span className="text-sm text-gray-500">{date}</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm font-semibold tabular-nums text-gray-900">{time}</span>
        </div>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-gray-500">Toplam Sayım</span>
            <span className="text-sm font-semibold tabular-nums text-gray-900">
              {fmtTR(COUNTED_VOTES)} / {fmtTR(TOTAL_VOTERS)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xl font-semibold leading-none tabular-nums text-brand-700">
              %{COUNT_PERCENT.toFixed(1)}
            </span>
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${COUNT_PERCENT}%` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full rounded-full bg-brand-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — nav */}
      <nav className="flex items-stretch gap-0 overflow-x-auto border-t border-gray-200 site-container">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeProps={{ className: "text-brand-700 border-brand-600 bg-brand-50/50" }}
            inactiveProps={{ className: "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50" }}
            activeOptions={n.to === "/" ? { exact: true } : undefined}
            className="border-b-2 px-4 py-3 text-sm font-semibold tracking-wide transition-colors"
          >
            {n.label}
          </Link>
        ))}
      </nav>

      {/* Row 3 — Untitled UI metric cards */}
      <div className="border-t border-gray-200 bg-gray-50 py-3 md:py-4">
        <div className="site-container grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {MEGA_STATS.map((s, i) => {
            const Icon = s.icon ? ICONS[s.icon] : Vote;
            const tone = toneAccent[s.tone ?? "default"];
            const trendUp = s.trend === "up";
            const trendDown = s.trend === "down";
            return (
              <div
                key={i}
                className="uui-card-hover group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xs md:p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone.bg}`}>
                    <Icon size={18} className={tone.fg} />
                  </div>
                  {s.delta && (
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs font-medium tabular-nums ${
                        trendUp
                          ? "border-success-600/20 bg-success-500/10 text-success-600"
                          : trendDown
                          ? "border-error-600/20 bg-error-500/10 text-error-600"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    >
                      {trendUp && <ArrowUpRight size={11} strokeWidth={2.5} />}
                      {trendDown && <ArrowDownRight size={11} strokeWidth={2.5} />}
                      {s.delta}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">{s.label}</p>
                  <p className="mt-0.5 text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    {s.value}
                  </p>
                  {s.sub && (
                    <p className="mt-0.5 text-xs text-gray-500">{s.sub}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function BreakingTicker() {
  const items = LIVE_FEED.filter((f) => f.kind === "breaking" || f.kind === "decisive").slice(0, 10);
  const doubled = [...items, ...items];
  return (
    <div className="flex items-stretch overflow-hidden bg-gray-900">
      <span className="flex shrink-0 items-center gap-1.5 bg-brand-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white">
        <Zap size={12} className="fill-white" />
        Son Dakika
      </span>
      <div className="relative flex-1 overflow-hidden py-1.5">
        <div className="ticker-track flex whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="mx-8 text-sm tracking-wide text-white">
              <span className="text-white/55 tabular-nums">{item.time}</span>
              <span className="mx-2 text-brand-500">▸</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
