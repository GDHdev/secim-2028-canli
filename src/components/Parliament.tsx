import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PARTIES, TOTAL_SEATS, MAJORITY_THRESHOLD, COALITIONS } from "@/lib/mock-data";
import { Users, ArrowUp, ArrowDown } from "lucide-react";

const FIRST_NAMES = [
  "Mehmet", "Ayşe", "Can", "Zeynep", "Emre", "Elif", "Ahmet", "Selin",
  "Mustafa", "Defne", "Barış", "Esra", "Ali", "Hülya", "Onur", "Berk",
  "Burcu", "Eren", "Gökhan", "İrem", "Kerem", "Leyla", "Murat", "Nazlı",
  "Okan", "Pınar", "Sinan", "Tuna", "Umut", "Yusuf",
];
const LAST_NAMES = [
  "Yılmaz", "Demir", "Kaya", "Şahin", "Çelik", "Aydın", "Öztürk", "Arslan",
  "Doğan", "Polat", "Aksoy", "Korkmaz", "Çetin", "Erdoğan", "Tekin", "Aslan",
  "Güneş", "Karaca", "Ergin", "Bozkurt",
];

function deputyName(seed: number) {
  const f = FIRST_NAMES[seed % FIRST_NAMES.length];
  const l = LAST_NAMES[(seed * 7) % LAST_NAMES.length];
  return `${f} ${l}`;
}

/**
 * Untitled UI–styled hemicycle parliament.
 * - Soft-shadow card, hemicycle on left, party list on right with UUI badges + progress.
 * - Hover seat → soft shadow popover with party + deputy info.
 */
export function Parliament() {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    party: typeof PARTIES[number];
    seatNo: number;
    deputy: string;
  } | null>(null);

  const seatList: { party: typeof PARTIES[number]; seatNo: number; deputy: string }[] = [];
  let globalSeat = 1;
  PARTIES.forEach((p) => {
    for (let i = 0; i < p.seats; i++) {
      seatList.push({
        party: p,
        seatNo: globalSeat,
        deputy: deputyName(globalSeat * 31 + p.id.length),
      });
      globalSeat++;
    }
  });

  const rows = 14;
  const seatsPerRow: number[] = [];
  let remaining = TOTAL_SEATS;
  const baseWeights = Array.from({ length: rows }, (_, i) => 1 + i * 0.18);
  const weightSum = baseWeights.reduce((s, w) => s + w, 0);
  baseWeights.forEach((w, i) => {
    const count = i === rows - 1
      ? remaining
      : Math.round((w / weightSum) * TOTAL_SEATS);
    seatsPerRow.push(count);
    remaining -= count;
  });

  const cx = 500;
  const cy = 360;
  const innerR = 130;
  const outerR = 340;
  const seatPositions: {
    x: number;
    y: number;
    party: typeof PARTIES[number];
    seatNo: number;
    deputy: string;
  }[] = [];
  let idx = 0;
  seatsPerRow.forEach((count, rowI) => {
    const r = innerR + ((outerR - innerR) * rowI) / (rows - 1);
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = Math.PI * (1 - t);
      const x = cx + Math.cos(angle) * r;
      const y = cy - Math.sin(angle) * r;
      const seat = seatList[idx];
      if (seat) {
        seatPositions.push({ x, y, ...seat });
        idx++;
      }
    }
  });

  const leadingParty = [...PARTIES].sort((a, b) => b.seats - a.seats)[0];

  return (
    <div className="panel overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
            <Users size={20} className="text-brand-700" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Türkiye Büyük Millet Meclisi
            </h2>
            <p className="text-xs text-gray-500">
              600 sandalye · Çoğunluk için {MAJORITY_THRESHOLD} sandalye gerekli
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="uui-badge uui-badge-error uui-badge-live">Hung Parliament</span>
          <span className="uui-badge uui-badge-brand">
            En büyük blok · {leadingParty.abbr} {leadingParty.seats}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.4fr_1fr]">
        {/* Hemicycle */}
        <div className="relative border-b border-gray-200 p-5 lg:border-b-0 lg:border-r">
          <svg viewBox="0 0 1000 410" className="w-full">
            {/* Center majority line */}
            <line
              x1="500" y1="20" x2="500" y2="360"
              stroke="var(--color-gray-300)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x="500" y="14"
              textAnchor="middle"
              style={{
                fontFamily: "Inter, system-ui",
                fontSize: 11,
                fontWeight: 600,
                fill: "var(--color-gray-500)",
              }}
            >
              ÇOĞUNLUK · {MAJORITY_THRESHOLD}
            </text>

            {seatPositions.map((s, i) => {
              const isHover = hover?.seatNo === s.seatNo;
              return (
                <motion.circle
                  key={i}
                  cx={s.x}
                  cy={s.y}
                  r={isHover ? 8.5 : 6.5}
                  fill={s.party.color}
                  stroke={isHover ? "white" : "transparent"}
                  strokeWidth={isHover ? 2 : 0}
                  style={{
                    cursor: "pointer",
                    filter: isHover ? "drop-shadow(0 2px 6px rgba(16,24,40,0.25))" : undefined,
                  }}
                  onMouseEnter={(e) =>
                    setHover({
                      x: e.clientX,
                      y: e.clientY,
                      party: s.party,
                      seatNo: s.seatNo,
                      deputy: s.deputy,
                    })
                  }
                  onMouseMove={(e) =>
                    setHover((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : h))
                  }
                  onMouseLeave={() => setHover(null)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(0.8, i * 0.0008),
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </svg>

          {/* Coalition mini-bars */}
          <div className="mt-2 grid gap-2.5 md:grid-cols-3">
            {COALITIONS.map((cn) => {
              const pct = (cn.seats / TOTAL_SEATS) * 100;
              const reachesMajority = cn.seats >= MAJORITY_THRESHOLD;
              return (
                <div key={cn.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-medium text-gray-600">{cn.name}</span>
                    <span className="text-base font-semibold tabular-nums text-gray-900">
                      {cn.seats}
                    </span>
                  </div>
                  <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-card">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, delay: 0.4 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cn.color }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500">
                    {reachesMajority ? (
                      <span className="font-medium text-success-600">Çoğunluk ✓</span>
                    ) : (
                      <>%{pct.toFixed(1)} · çoğunluğa {MAJORITY_THRESHOLD - cn.seats}</>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Party list — Untitled UI table-row style */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Partiler</h3>
            <span className="text-[11px] text-gray-500">7 parti · 600 sandalye</span>
          </div>
          <ul className="flex-1 divide-y divide-gray-100">
            {[...PARTIES].sort((a, b) => b.seats - a.seats).map((p) => {
              const pct = (p.seats / TOTAL_SEATS) * 100;
              const up = p.delta > 0;
              const down = p.delta < 0;
              return (
                <li key={p.id} className="px-5 py-3 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-8 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{p.abbr}</span>
                        <span className="truncate text-xs text-gray-500">{p.name}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                        </div>
                        <span className="w-12 text-right text-[11px] font-medium tabular-nums text-gray-500">
                          %{p.percent}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-16 shrink-0 flex-col items-end">
                      <span className="text-base font-semibold tabular-nums text-gray-900">
                        {p.seats}
                      </span>
                      <span
                        className={`mt-0.5 inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${
                          up
                            ? "border-success-600/20 bg-success-500/10 text-success-600"
                            : down
                            ? "border-error-600/20 bg-error-500/10 text-error-600"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }`}
                      >
                        {up && <ArrowUp size={10} strokeWidth={2.5} />}
                        {down && <ArrowDown size={10} strokeWidth={2.5} />}
                        {p.delta > 0 ? "+" : ""}{p.delta}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Floating UUI tooltip */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none fixed z-50 min-w-[220px] rounded-lg border border-gray-200 bg-card p-3 shadow-lg"
            style={{ left: hover.x + 14, top: hover.y + 14 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: hover.party.color }}
                />
                <span className="text-sm font-semibold text-gray-900">
                  {hover.party.abbr}
                </span>
              </div>
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium tabular-nums text-gray-600">
                Sandalye #{String(hover.seatNo).padStart(3, "0")}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">{hover.party.name}</p>
            <div className="mt-2 border-t border-gray-100 pt-2">
              <p className="text-[10px] uppercase tracking-wide text-gray-400">Milletvekili</p>
              <p className="text-sm font-semibold text-gray-900">{hover.deputy}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
