import { motion } from "framer-motion";
import { COALITIONS, PARTIES, TOTAL_SEATS, MAJORITY_THRESHOLD } from "@/lib/mock-data";
import { Handshake, Check, X } from "lucide-react";

/**
 * İTTİFAK BLOKLARI — Türkiye'de seçim = ittifak matematiği.
 * Her ittifakın toplam sandalyesi, çoğunluk farkı, üye partileri.
 */
export function AllianceBlocs() {
  const sorted = [...COALITIONS].sort((a, b) => b.seats - a.seats);
  const max = Math.max(...sorted.map((c) => c.seats));

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
            <Handshake size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">İttifak matematiği</h3>
            <p className="text-xs text-gray-500">
              Hiçbir ittifak tek başına çoğunluğu sağlayamıyor — koalisyon görüşmeleri gündemde.
            </p>
          </div>
        </div>
        <span className="uui-badge uui-badge-warning shrink-0">Çoğunluk: {MAJORITY_THRESHOLD}</span>
      </div>

      <ul className="divide-y divide-gray-100">
        {sorted.map((cn, idx) => {
          const parties = PARTIES.filter((p) => cn.partyIds.includes(p.id));
          const pct = (cn.seats / TOTAL_SEATS) * 100;
          const widthPct = (cn.seats / max) * 100;
          const reaches = cn.seats >= MAJORITY_THRESHOLD;
          const need = MAJORITY_THRESHOLD - cn.seats;
          return (
            <li key={cn.id} className="px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-bold tabular-nums text-gray-600">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="font-display text-lg font-semibold text-gray-900">{cn.name}</p>
                    <span className="text-xs text-gray-500">· %{pct.toFixed(1)} pay</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {parties.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-gray-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                        {p.abbr} <span className="tabular-nums text-gray-500">{p.seats}</span>
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: cn.color }}
                    />
                  </div>
                </div>
                <div className="flex w-32 shrink-0 flex-col items-end">
                  <span className="font-display text-3xl font-semibold tabular-nums text-gray-900">
                    {cn.seats}
                  </span>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      reaches
                        ? "bg-success-500/10 text-success-600"
                        : "bg-error-500/10 text-error-600"
                    }`}
                  >
                    {reaches ? <Check size={11} /> : <X size={11} />}
                    {reaches ? "Çoğunluk ✓" : `${need} eksik`}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-xs text-gray-600">
        İki ittifakın birleşmesiyle <strong className="text-gray-900">çoğunluk</strong> kurulabilir;
        en olası senaryo:{" "}
        <span className="font-semibold text-gray-900">
          {sorted[0].name.split(" ")[0]} + {sorted[1].name.split(" ")[0]}
        </span>{" "}
        ({sorted[0].seats + sorted[1].seats} sandalye).
      </div>
    </div>
  );
}
