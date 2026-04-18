import { motion } from "framer-motion";
import { TOP_CITIES, TURNOUT_BY_REGION, HISTORICAL, CANDIDATES } from "@/lib/mock-data";

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <TopCities />
      <TurnoutChart />
      <HistoricalCompare />
    </div>
  );
}

function TopCities() {
  const candColor = (id: "yilmaz" | "kaya" | "demir") => CANDIDATES.find((c) => c.id === id)!.color;
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 font-display text-xl tracking-wider text-foreground">EN BÜYÜK 5 İL</h3>
      <div className="space-y-4">
        {TOP_CITIES.map((city, i) => {
          const totalTop3 = city.results.yilmaz + city.results.kaya + city.results.demir;
          return (
            <div key={city.id}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-foreground">{city.name}</span>
                <span className="tabular-nums font-mono text-xs font-medium text-muted-foreground">
                  Sayım %{city.counted}
                </span>
              </div>
              <div className="flex h-3 overflow-hidden rounded-full bg-surface-2">
                {(["yilmaz", "kaya", "demir"] as const).map((id) => (
                  <motion.div
                    key={id}
                    initial={{ width: 0 }}
                    animate={{ width: `${(city.results[id] / totalTop3) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                    style={{ backgroundColor: candColor(id) }}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between tabular-nums font-mono text-xs text-muted-foreground">
                <span>Y %{city.results.yilmaz}</span>
                <span>K %{city.results.kaya}</span>
                <span>D %{city.results.demir}</span>
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
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 font-display text-xl tracking-wider text-foreground">BÖLGESEL KATILIM</h3>
      <div className="space-y-3">
        {TURNOUT_BY_REGION.map((r, i) => (
          <div key={r.region}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-foreground">{r.region}</span>
              <span className="tabular-nums font-mono text-sm font-semibold text-accent">%{r.turnout}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.turnout / max) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="h-full rounded-full bg-accent"
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
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="mb-4 font-display text-xl tracking-wider text-foreground">2023 → 2028</h3>
      <div className="space-y-3">
        {HISTORICAL.map((h, i) => {
          const delta = h.y2028 - h.y2023;
          const positive = delta >= 0;
          return (
            <div key={h.name} className="flex items-center gap-3">
              <span className="w-28 text-sm font-medium text-foreground">{h.name}</span>
              <div className="flex flex-1 items-end gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h.y2023 * 1.2}px` }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="w-3 rounded-sm bg-muted-foreground/50"
                  style={{ minHeight: 2 }}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h.y2028 * 1.2}px` }}
                  transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                  className="w-3 rounded-sm bg-primary"
                  style={{ minHeight: 2 }}
                />
              </div>
              <span
                className={`tabular-nums w-14 text-right font-mono text-sm font-semibold ${
                  positive ? "text-accent" : "text-cand-kaya"
                }`}
              >
                {positive ? "+" : ""}{delta.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted-foreground/50" />2023
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />2028
        </span>
      </div>
    </div>
  );
}
