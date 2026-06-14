import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CANDIDATES, COUNT_PERCENT, COUNTED_VOTES, TOTAL_VOTERS, fmtTR } from "@/lib/mock-data";
import { CountUp } from "./CountUp";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

type Row = (typeof CANDIDATES)[number] & { delta: number };

/**
 * PRESIDENT RACE — birleşik hero + sıralama.
 * Üstte büyük lider portresi + büyük yüzde + ulusal sayım barı.
 * Altında 4 aday yan yana yüzde + canlı bar.
 */
export function PresidentRace() {
  const [rows, setRows] = useState<Row[]>(() =>
    [...CANDIDATES].map((c) => ({ ...c, delta: 0 })).sort((a, b) => b.percent - a.percent),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) => {
        const next = prev.map((c) => {
          const jitter = (Math.random() - 0.5) * 0.18;
          const np = Math.max(0, +(c.percent + jitter).toFixed(2));
          return { ...c, percent: np, delta: +(np - c.percent).toFixed(2) };
        });
        const sum = next.reduce((a, b) => a + b.percent, 0);
        const k = 100 / sum;
        const norm = next.map((c) => ({ ...c, percent: +(c.percent * k).toFixed(2) }));
        return norm.sort((a, b) => b.percent - a.percent);
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const leader = rows[0];
  const second = rows[1];
  const gap = leader.percent - second.percent;
  const max = Math.max(...rows.map((r) => r.percent));

  return (
    <div className="panel overflow-hidden">
      {/* Hero — leader */}
      <div className="border-b border-gray-200 p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <span className="uui-badge uui-badge-error uui-badge-live">Canlı · 1. Tur</span>
          <span className="text-sm text-gray-500">14 Mart 2028 · sıralama anlık güncelleniyor</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          {leader.photo && (
            <img
              src={leader.photo}
              alt={leader.name}
              className="h-24 w-24 shrink-0 rounded-xl object-cover ring-2 md:h-28 md:w-28"
              style={{ ["--tw-ring-color" as never]: leader.color }}
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Önde</p>
            <p className="mt-1 truncate font-display text-3xl font-semibold text-gray-900 md:text-4xl">
              {leader.name}
            </p>
            <p className="mt-0.5 truncate text-base text-gray-500">{leader.party}</p>
          </div>
          <div className="text-right">
            <CountUp
              to={leader.percent}
              decimals={1}
              duration={0.6}
              suffix="%"
              className="font-display text-[64px] font-semibold leading-none tabular-nums md:text-[80px]"
              style={{ color: leader.color }}
            />
            <p className="mt-1 text-sm font-semibold text-success-600 tabular-nums">
              +{gap.toFixed(1)} pt fark
            </p>
            <p className="text-xs text-gray-500 tabular-nums">{fmtTR(leader.votes)} oy</p>
          </div>
        </div>

        {/* National count progress */}
        <div className="mt-7">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-gray-700">
              Ulusal sayım
            </span>
            <span className="font-mono text-sm tabular-nums text-gray-500">
              {fmtTR(COUNTED_VOTES)} / {fmtTR(TOTAL_VOTERS)} · %{COUNT_PERCENT.toFixed(1)}
            </span>
          </div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${COUNT_PERCENT}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative h-full rounded-full race-bar-live"
              style={{ backgroundColor: "var(--color-brand-600)" }}
            />
          </div>
        </div>
      </div>

      {/* Candidate rows (lider hero'da, diğer satırı hariç) */}
      <ul className="flex flex-col gap-3 p-3 md:p-4">
        <AnimatePresence initial={false}>
          {rows.slice(1).filter((c) => c.id !== "other").map((c, i) => (
            <motion.li
              key={c.id}
              layout
              transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
            >
              <CandidateRow candidate={c} place={i + 2} max={max} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3">
        <p className="text-sm text-gray-600">
          %50 barajı aşılmadığı için <span className="font-semibold text-gray-900">2. tur</span> kaçınılmaz görünüyor.
        </p>
        <span className="uui-badge uui-badge-brand">2. Tur · 14 Nisan 2028</span>
      </div>
    </div>
  );
}

function CandidateRow({ candidate, place, max }: { candidate: Row; place: number; max: number }) {
  const isOther = candidate.id === "other";
  const widthPct = (candidate.percent / Math.max(max, 1)) * 100;
  const up = candidate.delta > 0.01;
  const down = candidate.delta < -0.01;

  return (
    <div className="relative flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold tabular-nums text-gray-600">
        {place}
      </div>

      {isOther ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
          <Users size={20} className="text-gray-400" />
        </div>
      ) : candidate.photo ? (
        <img
          src={candidate.photo}
          alt={candidate.name}
          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2"
          style={{ ["--tw-ring-color" as never]: candidate.color }}
        />
      ) : (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
          style={{ backgroundColor: candidate.color }}
        >
          {candidate.name[0]}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-semibold text-gray-900">{candidate.name}</p>
          {isOther && <span className="uui-badge uui-badge-gray text-xs">Toplam</span>}
        </div>
        <p className="truncate text-sm text-gray-500">{candidate.party}</p>
        <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="relative h-full rounded-full race-bar-live"
            style={{ backgroundColor: candidate.color }}
            initial={false}
            animate={{ width: `${widthPct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </div>

      <div className="flex w-32 shrink-0 flex-col items-end gap-0.5">
        <CountUp
          to={candidate.percent}
          decimals={1}
          duration={0.6}
          suffix="%"
          className="text-2xl font-semibold tabular-nums leading-none"
          style={{ color: candidate.color }}
        />
        <p className="text-xs text-gray-500 tabular-nums">{fmtTR(candidate.votes)} oy</p>
        <div
          className={`flex items-center gap-0.5 text-xs font-medium tabular-nums ${
            up ? "text-success-600" : down ? "text-error-600" : "text-gray-400"
          }`}
        >
          {up && <TrendingUp size={12} />}
          {down && <TrendingDown size={12} />}
          {up || down ? `${candidate.delta > 0 ? "+" : ""}${candidate.delta.toFixed(2)}` : "—"}
        </div>
      </div>
    </div>
  );
}
