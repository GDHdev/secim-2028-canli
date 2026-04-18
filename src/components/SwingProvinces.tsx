import { motion } from "framer-motion";
import { PROVINCES, CANDIDATES } from "@/lib/mock-data";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// Deterministic mock 2023 results derived from current results +/- pseudo-random shift
function compute2023(p: (typeof PROVINCES)[number]) {
  const seed = p.id.length * 13 + p.name.charCodeAt(0);
  const shift = ((seed * 9301 + 49297) % 233280) / 233280; // 0..1
  const swing = 4 + shift * 10; // 4..14 pts
  // Apply opposite swing to current leader (simulate swing FROM other party)
  const yilmaz = +(p.results.yilmaz - swing).toFixed(1);
  const kaya = +(p.results.kaya + swing * 0.6).toFixed(1);
  const demir = +(p.results.demir + swing * 0.4).toFixed(1);
  return { yilmaz, kaya, demir, totalSwing: swing };
}

const c = (id: "yilmaz" | "kaya" | "demir") =>
  CANDIDATES.find((x) => x.id === id)!;

export function SwingProvinces() {
  const ranked = PROVINCES.map((p) => {
    const prev = compute2023(p);
    const deltaY = +(p.results.yilmaz - prev.yilmaz).toFixed(1);
    const deltaK = +(p.results.kaya - prev.kaya).toFixed(1);
    const deltaD = +(p.results.demir - prev.demir).toFixed(1);
    const magnitude = Math.abs(deltaY) + Math.abs(deltaK) + Math.abs(deltaD);
    const biggest = [
      { id: "yilmaz" as const, delta: deltaY },
      { id: "kaya" as const, delta: deltaK },
      { id: "demir" as const, delta: deltaD },
    ].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
    return { p, magnitude, biggest, prev };
  })
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 5);

  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <span className="eyebrow-accent">2023 → 2028</span>
          <h3 className="mt-1 font-display text-lg text-foreground">
            En Çok Değişen 5 İl
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Oy farkı (puan)
        </span>
      </div>

      <div className="divide-y divide-border">
        {ranked.map((item, i) => {
          const positive = item.biggest.delta >= 0;
          const cand = c(item.biggest.id);
          return (
            <motion.div
              key={item.p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-1"
            >
              <span className="font-mono text-xs font-bold text-muted-foreground tabular-nums w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.p.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.p.region} · sayım %{item.p.counted}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: cand.color }}
                />
                <span className="font-mono text-xs font-semibold text-foreground">
                  {cand.name.split(" ")[1]}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 font-display text-xl tabular-nums ${
                  positive ? "text-cyan" : "text-primary"
                }`}
              >
                {positive ? (
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={18} strokeWidth={2.5} />
                )}
                {positive ? "+" : ""}
                {item.biggest.delta.toFixed(1)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
