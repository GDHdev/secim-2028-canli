import { motion } from "framer-motion";
import { DIASPORA, DIASPORA_TOTALS, DIASPORA_TOTAL_VOTERS, DIASPORA_VOTES_CAST, CUSTOMS_VOTES, CANDIDATES, fmtTR } from "@/lib/mock-data";
import { Plane } from "lucide-react";

/**
 * YURT DIŞI & GÜMRÜK OYLARI — Türk seçmen için sembolik önemde.
 */
export function DiasporaCard() {
  const top = [...DIASPORA].sort((a, b) => b.voters - a.voters).slice(0, 6);
  const max = Math.max(...top.map((d) => d.voters));
  const turnoutPct = (DIASPORA_VOTES_CAST / DIASPORA_TOTAL_VOTERS) * 100;
  const cs = ["yilmaz", "kaya", "demir"] as const;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
            <Plane size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Yurt dışı & gümrük oyları</h3>
            <p className="text-xs text-gray-500">
              3.4M kayıtlı seçmen · {fmtTR(DIASPORA_VOTES_CAST)} oy · gümrük: {fmtTR(CUSTOMS_VOTES)}
            </p>
          </div>
        </div>
        <span className="uui-badge uui-badge-gray shrink-0 tabular-nums">
          Katılım %{turnoutPct.toFixed(1)}
        </span>
      </div>

      {/* Aggregate */}
      <div className="grid grid-cols-3 gap-px border-b border-gray-200 bg-gray-200">
        {cs.map((id) => {
          const c = CANDIDATES.find((x) => x.id === id)!;
          const v = DIASPORA_TOTALS[id];
          return (
            <div key={id} className="bg-white px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {c.name.split(" ").slice(-1)[0]}
              </p>
              <p
                className="mt-1 font-display text-2xl font-semibold tabular-nums"
                style={{ color: c.color }}
              >
                %{v}
              </p>
            </div>
          );
        })}
      </div>

      {/* Country list */}
      <ul className="divide-y divide-gray-100">
        {top.map((d) => {
          const leader = d.yilmaz >= d.kaya && d.yilmaz >= d.demir ? "yilmaz" : d.kaya >= d.demir ? "kaya" : "demir";
          const leadColor = CANDIDATES.find((c) => c.id === leader)!.color;
          const leadPct = d[leader];
          return (
            <li key={d.country} className="flex items-center gap-3 px-5 py-2.5">
              <span className="text-lg" aria-hidden>{d.flag}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-gray-900">{d.country}</span>
                  <span className="font-mono text-[11px] tabular-nums text-gray-500">
                    {fmtTR(d.voters)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.voters / max) * 100}%` }}
                    transition={{ duration: 0.7 }}
                    className="h-full rounded-full"
                    style={{ background: leadColor }}
                  />
                </div>
              </div>
              <div className="w-20 shrink-0 text-right">
                <span
                  className="font-display text-base font-semibold tabular-nums"
                  style={{ color: leadColor }}
                >
                  %{leadPct}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
