import { motion } from "framer-motion";
import { TOP_CITIES, TURNOUT_BY_REGION, HISTORICAL, CANDIDATES } from "@/lib/mock-data";

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-0 divide-y divide-border border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
      <TopCities />
      <TurnoutChart />
      <HistoricalCompare />
    </div>
  );
}

function TopCities() {
  const candColor = (id: "yilmaz" | "kaya" | "demir") => CANDIDATES.find((c) => c.id === id)!.color;
  return (
    <div className="bg-card p-6">
      <span className="eyebrow-accent">En Büyük 5 İl</span>
      <h3 className="display-lg mt-1 mb-5 text-foreground">METROPOLLER</h3>
      <div className="space-y-4">
        {TOP_CITIES.map((city, i) => {
          const totalTop3 = city.results.yilmaz + city.results.kaya + city.results.demir;
          return (
            <div key={city.id}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-sm font-bold text-foreground">{city.name}</span>
                <span className="tabular-nums font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Sayım %{city.counted}
                </span>
              </div>
              <div className="flex h-2.5 overflow-hidden bg-surface-3">
                {(["yilmaz", "kaya", "demir"] as const).map((id) => (
                  <motion.div
                    key={id}
                    initial={{ width: 0 }}
                    animate={{ width: `${(city.results[id] / totalTop3) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    style={{ backgroundColor: candColor(id) }}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between tabular-nums font-mono text-[10px] text-muted-foreground">
                <span style={{ color: candColor("yilmaz") }}>Y %{city.results.yilmaz}</span>
                <span style={{ color: candColor("kaya") }}>K %{city.results.kaya}</span>
                <span style={{ color: candColor("demir") }}>D %{city.results.demir}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TurnoutChart() {
  const max = Math.max(...TURNOUT_BY_REGION.map((r) => r.turnout));
  return (
    <div className="bg-card p-6">
      <span className="eyebrow-accent">7 Bölge</span>
      <h3 className="display-lg mt-1 mb-5 text-foreground">KATILIM</h3>
      <div className="space-y-3">
        {TURNOUT_BY_REGION.map((r, i) => (
          <div key={r.region}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="font-mono text-xs font-semibold text-foreground">{r.region}</span>
              <span className="tabular-nums font-display text-2xl text-accent">%{r.turnout}</span>
            </div>
            <div className="h-2 overflow-hidden bg-surface-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.turnout / max) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className="h-full bg-accent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoricalCompare() {
  return (
    <div className="bg-card p-6">
      <span className="eyebrow-accent">2023 → 2028</span>
      <h3 className="display-lg mt-1 mb-5 text-foreground">DEĞİŞİM</h3>
      <div className="space-y-4">
        {HISTORICAL.map((h, i) => {
          const delta = h.y2028 - h.y2023;
          const positive = delta >= 0;
          return (
            <div key={h.name}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">{h.name}</span>
                <span className={`tabular-nums font-display text-2xl ${positive ? "text-success-600" : "text-brand-600"}`}>
                  {positive ? "+" : ""}{delta.toFixed(1)}
                </span>
              </div>
              <div className="grid grid-cols-[3rem_1fr] items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">2023</span>
                <div className="h-2 overflow-hidden bg-surface-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${h.y2023 * 1.6}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06 }}
                    className="h-full bg-muted-foreground/60"
                  />
                </div>
                <span className="font-mono text-[10px] text-foreground">2028</span>
                <div className="h-2 overflow-hidden bg-surface-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${h.y2028 * 1.6}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06 + 0.1 }}
                    className="h-full bg-foreground"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
