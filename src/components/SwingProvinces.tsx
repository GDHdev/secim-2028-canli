import { motion } from "framer-motion";
import { PROVINCES, CANDIDATES } from "@/lib/mock-data";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";

function compute2023(p: (typeof PROVINCES)[number]) {
  const seed = p.id.length * 13 + p.name.charCodeAt(0);
  const shift = ((seed * 9301 + 49297) % 233280) / 233280;
  const swing = 4 + shift * 10;
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
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">En Çok Değişen 5 İl</h3>
          <p className="text-sm text-gray-500">2023 → 2028 oy farkı (puan)</p>
        </div>
        <span className="uui-badge uui-badge-gray">Swing</span>
      </div>

      <ul className="divide-y divide-gray-100">
        {ranked.map((item, i) => {
          const positive = item.biggest.delta >= 0;
          const cand = c(item.biggest.id);
          return (
            <motion.li
              key={item.p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <span className="w-6 text-base font-semibold tabular-nums text-gray-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <MapPin size={16} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-gray-900">
                  {item.p.name}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="uui-badge uui-badge-gray text-[11px]">
                    {item.p.region}
                  </span>
                  <span className="text-xs text-gray-500">
                    sayım %{item.p.counted}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: cand.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {cand.name.split(" ").slice(-1)[0]}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-semibold tabular-nums ${
                  positive
                    ? "border-success-600/20 bg-success-500/10 text-success-600"
                    : "border-error-600/20 bg-error-500/10 text-error-600"
                }`}
              >
                {positive ? (
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={14} strokeWidth={2.5} />
                )}
                {positive ? "+" : ""}
                {item.biggest.delta.toFixed(1)} pt
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
