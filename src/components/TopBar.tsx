import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  COUNTED_VOTES, COUNT_PERCENT, TOTAL_VOTERS, fmtTR, LIVE_FEED, MEGA_STATS,
  type MegaStatIcon,
} from "@/lib/mock-data";
import {
  ArrowUpRight, ArrowDownRight,
  Vote, Trophy, Repeat, Users, CheckCircle2, Landmark,
} from "lucide-react";

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
  cyan:    { bg: "bg-gray-100", fg: "text-gray-700" },
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      {/* Row 1 — masthead */}
      <div className="flex items-center gap-6 px-4 py-3 md:px-8 lg:px-12">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
            SEÇİM<span className="text-primary">2028</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            CANLI
          </span>
          <span className="text-border">|</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {date}
          </span>
          <span className="text-border">|</span>
          <span className="tabular-nums font-mono text-[11px] font-semibold text-foreground">
            {time}
          </span>
        </div>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Toplam Sayım
            </span>
            <span className="tabular-nums font-mono text-sm font-bold text-foreground">
              {fmtTR(COUNTED_VOTES)} / {fmtTR(TOTAL_VOTERS)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-display text-3xl leading-none text-accent">
              %{COUNT_PERCENT.toFixed(1)}
            </span>
            <div className="h-1 w-40 overflow-hidden bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${COUNT_PERCENT}%` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full bg-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — nav */}
      <nav className="flex items-stretch gap-0 overflow-x-auto border-t border-border px-4 md:px-8 lg:px-12">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeProps={{ className: "text-foreground border-accent bg-surface-1" }}
            inactiveProps={{ className: "text-muted-foreground border-transparent hover:text-foreground hover:bg-surface-1/50" }}
            activeOptions={n.to === "/" ? { exact: true } : undefined}
            className="border-b-2 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
          >
            {n.label}
          </Link>
        ))}
      </nav>

      {/* Row 3 — Untitled UI metric cards (UUI) */}
      <div className="border-t border-gray-200 bg-gray-50 px-3 py-3 md:px-6 md:py-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {MEGA_STATS.map((s, i) => {
            const Icon = s.icon ? ICONS[s.icon] : Vote;
            const tone = toneAccent[s.tone ?? "default"];
            const trendUp = s.trend === "up";
            const trendDown = s.trend === "down";
            return (
              <div
                key={i}
                className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xs transition-shadow hover:shadow-md md:p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone.bg}`}>
                    <Icon size={16} className={tone.fg} />
                  </div>
                  {s.delta && (
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${
                        trendUp
                          ? "border-success-600/20 bg-success-500/10 text-success-600"
                          : trendDown
                          ? "border-error-600/20 bg-error-500/10 text-error-600"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    >
                      {trendUp && <ArrowUpRight size={10} strokeWidth={2.5} />}
                      {trendDown && <ArrowDownRight size={10} strokeWidth={2.5} />}
                      {s.delta}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">{s.label}</p>
                  <p className="mt-0.5 text-lg font-semibold leading-tight tracking-tight text-gray-900 md:text-xl">
                    {s.value}
                  </p>
                  {s.sub && (
                    <p className="mt-0.5 text-[11px] text-gray-500">{s.sub}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4 — breaking ticker */}
      <BreakingTicker />
    </header>
  );
}

function BreakingTicker() {
  const items = LIVE_FEED.filter((f) => f.kind === "breaking" || f.kind === "decisive").slice(0, 10);
  const doubled = [...items, ...items];
  return (
    <div className="flex items-stretch overflow-hidden border-t border-border bg-foreground">
      <span className="flex shrink-0 items-center bg-primary px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
        ⚡ Son Dakika
      </span>
      <div className="relative flex-1 overflow-hidden py-1.5">
        <div className="ticker-track flex whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="mx-8 font-mono text-[11px] tracking-wide text-background">
              <span className="text-background/55">{item.time}</span>
              <span className="mx-2 text-primary">▸</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
