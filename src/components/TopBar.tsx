import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { COUNTED_VOTES, COUNT_PERCENT, TOTAL_VOTERS, fmtTR, LIVE_FEED } from "@/lib/mock-data";

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      {/* Status bar — bigger, more prominent */}
      <div className="flex items-center gap-5 px-4 py-3 text-base md:gap-6 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="live-pulse inline-block h-3 w-3 rounded-full bg-primary" />
          <span className="font-display text-xl tracking-wider text-primary md:text-2xl">CANLI</span>
        </div>

        <div className="hidden items-center gap-2.5 text-muted-foreground md:flex">
          <span className="font-mono text-sm font-semibold">SANDIKLAR KAPANDI</span>
          <span className="text-border">·</span>
          <span className="font-mono text-sm font-semibold tabular-nums">{time}</span>
        </div>

        <div className="ml-auto flex flex-1 items-center gap-3 md:flex-none">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2 text-sm">
              <span className="font-medium text-muted-foreground">Sayılan oy:</span>
              <span className="font-mono text-base font-bold text-foreground">{fmtTR(COUNTED_VOTES)}</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-mono text-sm text-muted-foreground">{fmtTR(TOTAL_VOTERS)}</span>
              <span className="font-display text-xl text-accent md:text-2xl">%{COUNT_PERCENT.toFixed(1)}</span>
            </div>
            <div className="h-1.5 w-56 overflow-hidden rounded-full bg-surface-2 md:w-80">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${COUNT_PERCENT}%` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 md:px-6">
        <Link
          to="/"
          activeProps={{ className: "text-foreground border-primary" }}
          inactiveProps={{ className: "text-muted-foreground border-transparent hover:text-foreground" }}
          activeOptions={{ exact: true }}
          className="border-b-2 px-3 py-3 font-display text-sm tracking-wider transition-colors"
        >
          GÖSTERGE PANELİ
        </Link>
        <Link
          to="/harita"
          activeProps={{ className: "text-foreground border-primary" }}
          inactiveProps={{ className: "text-muted-foreground border-transparent hover:text-foreground" }}
          className="border-b-2 px-3 py-3 font-display text-sm tracking-wider transition-colors"
        >
          HARİTA
        </Link>
        <Link
          to="/sonuclar"
          activeProps={{ className: "text-foreground border-primary" }}
          inactiveProps={{ className: "text-muted-foreground border-transparent hover:text-foreground" }}
          className="border-b-2 px-3 py-3 font-display text-sm tracking-wider transition-colors"
        >
          SONUÇLAR
        </Link>
        <Link
          to="/tur2"
          activeProps={{ className: "text-foreground border-primary" }}
          inactiveProps={{ className: "text-accent border-transparent hover:text-foreground" }}
          className="border-b-2 px-3 py-3 font-display text-sm tracking-wider transition-colors"
        >
          2. TUR
        </Link>
        <Link
          to="/anketler"
          activeProps={{ className: "text-foreground border-primary" }}
          inactiveProps={{ className: "text-muted-foreground border-transparent hover:text-foreground" }}
          className="border-b-2 px-3 py-3 font-display text-sm tracking-wider transition-colors"
        >
          ANKETLER
        </Link>
        <Link
          to="/haberler"
          activeProps={{ className: "text-foreground border-primary" }}
          inactiveProps={{ className: "text-muted-foreground border-transparent hover:text-foreground" }}
          className="border-b-2 px-3 py-3 font-display text-sm tracking-wider transition-colors"
        >
          HABERLER
        </Link>

        <div className="ml-auto hidden items-center gap-2 py-2 md:flex">
          <span className="font-display text-2xl tracking-widest">
            SEÇİM<span className="text-primary">2028</span>
          </span>
        </div>
      </nav>

      {/* Breaking news ticker */}
      <BreakingTicker />
    </div>
  );
}

function BreakingTicker() {
  const items = LIVE_FEED.filter((f) => f.kind === "breaking" || f.kind === "decisive").slice(0, 8);
  const doubled = [...items, ...items];
  return (
    <div className="flex items-center gap-3 overflow-hidden border-t border-border bg-[#0a0a0a] py-1">
      <span className="ml-3 shrink-0 rounded-sm bg-primary px-2 py-0.5 font-display text-xs tracking-wider text-primary-foreground">
        SON DAKİKA
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track flex whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="mx-6 font-mono text-xs text-white">
              <span className="text-white/60">{item.time}</span>{" "}
              <span className="text-primary">▸</span> {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
