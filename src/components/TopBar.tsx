import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COUNTED_VOTES, COUNT_PERCENT, TOTAL_VOTERS, fmtTR, LIVE_FEED } from "@/lib/mock-data";
import { Zap } from "lucide-react";
import gdhLogo from "@/assets/gdh-logo.svg";

const NAV = [
  { to: "/", label: "Genel" },
  { to: "/harita", label: "Harita" },
  { to: "/sonuclar", label: "Sonuçlar" },
  { to: "/milletvekili", label: "Milletvekili" },
  { to: "/tur2", label: "2. Tur" },
  { to: "/anketler", label: "Anketler" },
  { to: "/haberler", label: "Haberler" },
] as const;

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
    ? now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[oklch(0.135_0.018_264/0.85)] backdrop-blur-2xl">
      {/* Row 0 — breaking ticker */}
      <BreakingTicker />

      {/* Row 1 — masthead + nav + live count (single row on lg+) */}
      <div className="site-container flex items-center gap-5 py-3.5">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src={gdhLogo} alt="GDH" className="h-9 w-auto md:h-10" />
          <span className="hidden h-9 w-px bg-card/10 md:block" />
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
              Seçim Merkezi
            </span>
            <span className="text-lg font-bold tracking-tight text-gray-900">2028</span>
          </div>
        </Link>

        {/* Live badge + clock */}
        <div className="hidden items-center gap-2.5 md:flex">
          <span className="uui-badge uui-badge-error uui-badge-live">Canlı</span>
          <span className="text-sm font-medium text-gray-500">{date}</span>
          <span className="text-gray-400/40">·</span>
          <span className="font-mono text-sm font-semibold tabular-nums text-gray-700">{time}</span>
        </div>

        {/* Nav — center/right on desktop, scroll on mobile */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-gray-900 bg-card/[0.07] ring-1 ring-white/[0.08]" }}
              inactiveProps={{ className: "text-gray-500 hover:text-gray-900 hover:bg-card/[0.04]" }}
              activeOptions={n.to === "/" ? { exact: true } : undefined}
              className="rounded-md px-3 py-2 text-sm font-semibold tracking-wide transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Live count — compact */}
        <div className="ml-auto hidden items-center gap-3 lg:ml-0 lg:flex">
          <div className="hidden flex-col items-end leading-tight xl:flex">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Ulusal Sayım
            </span>
            <span className="font-mono text-xs tabular-nums text-gray-500">
              {fmtTR(COUNTED_VOTES)} / {fmtTR(TOTAL_VOTERS)}
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-card/[0.04] px-3 py-1.5">
            <span className="font-mono text-base font-bold leading-none tabular-nums text-brand-500">
              %{COUNT_PERCENT.toFixed(1)}
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-card/[0.08]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${COUNT_PERCENT}%` }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="flex items-stretch gap-0 overflow-x-auto border-t border-white/[0.06] site-container lg:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeProps={{ className: "text-brand-500 border-brand-500" }}
            inactiveProps={{ className: "text-gray-500 border-transparent hover:text-gray-900" }}
            activeOptions={n.to === "/" ? { exact: true } : undefined}
            className="border-b-2 px-4 py-3 text-sm font-semibold tracking-wide transition-colors"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function BreakingTicker() {
  const items = LIVE_FEED.filter((f) => f.kind === "breaking" || f.kind === "decisive").slice(0, 10);
  const doubled = [...items, ...items];
  return (
    <div className="flex items-stretch overflow-hidden border-b border-white/[0.04] bg-[oklch(0.10_0.018_264)]">
      <span className="flex shrink-0 items-center gap-1.5 bg-gradient-to-r from-brand-700 to-brand-600 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[oklch(0.99_0_0)] shadow-[0_0_24px_oklch(0.65_0.24_25/0.4)]">
        <Zap size={13} className="fill-[oklch(0.99_0_0)]" />
        Son Dakika
      </span>
      <div className="relative flex-1 overflow-hidden py-2">
        <div className="ticker-track flex whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="mx-10 text-[15px] font-medium tracking-wide text-gray-700">
              <span className="font-mono text-gray-500 tabular-nums">{item.time}</span>
              <span className="mx-2.5 text-brand-500">▸</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
