import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CANDIDATES } from "@/lib/mock-data";
import { CountUp } from "./CountUp";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

type Row = (typeof CANDIDATES)[number] & { delta: number };

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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cumhurbaşkanlığı Yarışı</h3>
            <p className="text-sm text-gray-500">1. Tur · sıralama anlık güncelleniyor</p>
          </div>
          <span className="uui-badge uui-badge-error uui-badge-live">Canlı</span>
        </div>
        <div className="hidden text-right md:block">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Önde · Fark</p>
          <p className="text-base font-semibold text-gray-900">
            {leader.name.split(" ").slice(-1)[0]} · +{gap.toFixed(1)} pt
          </p>
        </div>
      </div>

      {/* Stacked live race */}
      <ul className="flex flex-col gap-3 p-3 md:p-4">
        <AnimatePresence initial={false}>
          {rows.map((c, i) => (
            <motion.li
              key={c.id}
              layout
              transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.8 }}
              className="relative"
            >
              <CandidateRow candidate={c} place={i + 1} max={max} isLeader={i === 0} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Footer threshold note */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3">
        <p className="text-sm text-gray-500">
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
  isLeader,
}: {
  candidate: Row;
  place: number;
  max: number;
  isLeader: boolean;
}) {
  const isOther = candidate.id === "other";
  const widthPct = (candidate.percent / Math.max(max, 1)) * 100;
  const up = candidate.delta > 0.01;
  const down = candidate.delta < -0.01;

  return (
    <div
      className={`relative flex items-center gap-4 rounded-xl border transition-colors ${
        isLeader
          ? "border-brand-200 bg-brand-50/50 px-4 py-5"
          : "border-gray-200 bg-card px-4 py-3 hover:bg-gray-50"
      }`}
    >
      {/* Rank */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-full border font-semibold tabular-nums ${
          isLeader
            ? "h-10 w-10 border-brand-200 bg-card text-brand-700 text-base"
            : "h-8 w-8 border-gray-200 bg-card text-gray-600 text-sm"
        }`}
      >
        {place}
      </div>

      {/* Portrait / icon */}
      {isOther ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
          <Users size={20} className="text-gray-400" />
        </div>
      ) : (
        <Portrait candidate={candidate} large={isLeader} />
      )}

      {/* Name + party + bar */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`truncate font-semibold text-gray-900 ${
              isLeader ? "text-xl md:text-2xl" : "text-base"
            }`}
          >
            {candidate.name}
          </p>
          {isLeader && (
            <span className="uui-badge uui-badge-brand text-xs">Önde</span>
          )}
          {isOther && (
            <span className="uui-badge uui-badge-gray text-xs">Toplam</span>
          )}
        </div>
        <p className={`truncate text-gray-500 ${isLeader ? "text-sm" : "text-sm"}`}>
          {candidate.party}
        </p>

        {/* Race bar */}
        <div className={`relative mt-2 overflow-hidden rounded-full bg-gray-100 ${isLeader ? "h-2.5" : "h-2"}`}>
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
      <div className="flex w-36 shrink-0 flex-col items-end gap-0.5">
        <CountUp
          to={candidate.percent}
          decimals={1}
          duration={0.6}
          suffix="%"
          className={`font-semibold tabular-nums tracking-tight ${
            isLeader ? "text-4xl md:text-5xl" : "text-2xl"
          }`}
          style={{ color: candidate.color }}
        />
        <p className="text-xs text-gray-500 tabular-nums">
          {candidate.votes.toLocaleString("tr-TR")} oy
        </p>
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

function Portrait({ candidate, large }: { candidate: Row; large: boolean }) {
  const dim = large ? "h-16 w-16 md:h-20 md:w-20" : "h-12 w-12";
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-white ${dim}`}
      style={{ ["--tw-ring-color" as never]: candidate.color }}
    >
      {candidate.photo ? (
        <img
          src={candidate.photo}
          alt={candidate.name}
          loading="eager"
          width={160}
          height={160}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-base font-semibold text-white"
          style={{ backgroundColor: candidate.color }}
        >
          {candidate.name[0]}
        </div>
      )}
    </div>
  );
}
