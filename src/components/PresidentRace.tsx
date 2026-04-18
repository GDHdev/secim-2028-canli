import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CANDIDATES } from "@/lib/mock-data";
import { CountUp } from "./CountUp";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * Live "horse race" presidential card — Untitled UI styled.
 * Adaylar alt alta, sıralama oylar değiştikçe animasyonla yeniden diziliyor.
 * Diğer adaylar da listenin sonunda yer alıyor.
 */

type Row = (typeof CANDIDATES)[number] & { delta: number };

export function PresidentRace() {
  // Anlık simülasyon: her tick'te çok küçük rastgele oynamalar
  const [rows, setRows] = useState<Row[]>(() =>
    [...CANDIDATES].map((c) => ({ ...c, delta: 0 })).sort((a, b) => b.percent - a.percent),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) => {
        const next = prev.map((c) => {
          const jitter = (Math.random() - 0.5) * 0.18; // ±0.09 puan
          const np = Math.max(0, +(c.percent + jitter).toFixed(2));
          return { ...c, percent: np, delta: +(np - c.percent).toFixed(2) };
        });
        // Re-normalize to keep ~100
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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Cumhurbaşkanlığı Yarışı</h3>
            <p className="text-xs text-gray-500">1. Tur · sıralama anlık güncelleniyor</p>
          </div>
          <span className="uui-badge uui-badge-error uui-badge-live">Canlı</span>
        </div>
        <div className="hidden items-center gap-2 text-right md:flex">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Önde · Fark</p>
            <p className="text-sm font-semibold text-gray-900">
              {leader.name.split(" ").slice(-1)[0]} · +{gap.toFixed(1)} pt
            </p>
          </div>
        </div>
      </div>

      {/* Stacked live race */}
      <ul className="flex flex-col gap-2 p-3 md:p-4">
        <AnimatePresence initial={false}>
          {rows.map((c, i) => (
            <motion.li
              key={c.id}
              layout
              transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
              className="relative"
            >
              <CandidateRow candidate={c} place={i + 1} max={max} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Footer threshold note */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3">
        <p className="text-xs text-gray-500">
          %50 barajı aşılmadığı için <span className="font-medium text-gray-900">2. tur</span> kaçınılmaz görünüyor.
        </p>
        <span className="uui-badge uui-badge-brand">2. Tur · 14 Nisan 2028</span>
      </div>
    </div>
  );
}

function CandidateRow({
  candidate,
  place,
  max,
}: {
  candidate: Row;
  place: number;
  max: number;
}) {
  const isLeader = place === 1;
  const widthPct = (candidate.percent / Math.max(max, 1)) * 100;
  const up = candidate.delta > 0.01;
  const down = candidate.delta < -0.01;

  return (
    <div
      className={`relative flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors ${
        isLeader
          ? "border-brand-200 bg-brand-50/40"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      {/* Rank */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 tabular-nums">
        {place}
      </div>

      {/* Portrait */}
      <Portrait candidate={candidate} />

      {/* Name + party + bar */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {candidate.name}
          </p>
          {isLeader && (
            <span className="uui-badge uui-badge-brand !py-0 !px-2 text-[10px]">Önde</span>
          )}
          {candidate.id === "other" && (
            <span className="uui-badge uui-badge-gray !py-0 !px-2 text-[10px]">Toplam</span>
          )}
        </div>
        <p className="truncate text-xs text-gray-500">{candidate.party}</p>

        {/* Race bar */}
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

      {/* % + votes + delta */}
      <div className="flex w-32 shrink-0 flex-col items-end gap-0.5">
        <CountUp
          to={candidate.percent}
          decimals={1}
          duration={0.6}
          suffix="%"
          className="text-2xl font-semibold tabular-nums tracking-tight"
          style={{ color: candidate.color }}
        />
        <p className="text-[11px] text-gray-500 tabular-nums">
          {candidate.votes.toLocaleString("tr-TR")} oy
        </p>
        <div
          className={`flex items-center gap-0.5 text-[11px] font-medium tabular-nums ${
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

function Portrait({ candidate }: { candidate: Row }) {
  return (
    <div
      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-white"
      style={{ ["--tw-ring-color" as never]: candidate.color }}
    >
      {candidate.photo ? (
        <img
          src={candidate.photo}
          alt={candidate.name}
          loading="eager"
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-sm font-semibold text-white"
          style={{ backgroundColor: candidate.color }}
        >
          {candidate.name[0]}
        </div>
      )}
    </div>
  );
}
