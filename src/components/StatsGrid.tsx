import { motion } from "framer-motion";
import { TOP_CITIES, TURNOUT_BY_REGION, HISTORICAL, CANDIDATES } from "@/lib/mock-data";

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TopCities />
      <TurnoutChart />
      <HistoricalCompare />
    </div>
  );
}

function TopCities() {
  const candColor = (id: "yilmaz" | "kaya" | "demir") => CANDIDATES.find((c) => c.id === id)!.color;
  return (
    <div className="rounded-sm border border-border bg-surface-1 p-4">
      <h3 className="mb-3 font-display text-lg tracking-wider text-foreground">EN BÜYÜK 5 İL</h3>
      <div className="space-y-3">
        {TOP_CITIES.map((city, i) => {
          const totalTop3 = city.results.yilmaz + city.results.kaya + city.results.demir;
          return (
            <div key={city.id}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-medium text-foreground">{city.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">SAYIM %{city.counted}</span>
              </div>
              <div className="flex h-3 overflow-hidden rounded-sm bg-surface-2">
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
              <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
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
    <div className="rounded-sm border border-border bg-surface-1 p-4">
      <h3 className="mb-3 font-display text-lg tracking-wider text-foreground">BÖLGESEL KATILIM</h3>
      <div className="space-y-2">
        {TURNOUT_BY_REGION.map((r, i) => (
          <div key={r.region}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-foreground">{r.region}</span>
              <span className="font-mono text-accent">%{r.turnout}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.turnout / max) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
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
    <div className="rounded-sm border border-border bg-surface-1 p-4">
      <h3 className="mb-3 font-display text-lg tracking-wider text-foreground">2023 → 2028</h3>
      <div className="space-y-3">
        {HISTORICAL.map((h, i) => {
          const delta = h.y2028 - h.y2023;
          const positive = delta >= 0;
          return (
            <div key={h.name} className="flex items-center gap-3">
              <span className="w-28 text-sm text-foreground">{h.name}</span>
              <div className="flex flex-1 items-end gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h.y2023 * 1.2}px` }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="w-3 bg-muted-foreground/50"
                  style={{ minHeight: 2 }}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h.y2028 * 1.2}px` }}
                  transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                  className="w-3 bg-primary"
                  style={{ minHeight: 2 }}
                />
              </div>
              <span className={`w-12 text-right font-mono text-xs ${positive ? "text-accent" : "text-cand-kaya"}`}>
                {positive ? "+" : ""}{delta.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-3 font-mono text-[10px] text-muted-foreground">
        <span><span className="mr-1 inline-block h-2 w-2 bg-muted-foreground/50" />2023</span>
        <span><span className="mr-1 inline-block h-2 w-2 bg-primary" />2028</span>
      </div>
    </div>
  );
}
