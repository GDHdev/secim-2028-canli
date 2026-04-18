import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PARTIES, TOTAL_SEATS, MAJORITY_THRESHOLD, COALITIONS } from "@/lib/mock-data";

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
 * Hemicycle parliament chart with hover tooltips.
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

  return (
    <div className="panel p-6 md:p-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="eyebrow-accent">Türkiye Büyük Millet Meclisi</span>
          <h2 className="display-lg mt-2 text-foreground">600 Sandalye</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Çoğunluk için <span className="font-bold text-foreground">301</span> sandalye gerekli ·
            <span className="ml-1.5 font-semibold text-primary">Hiçbir parti tek başına çoğunluğu sağlayamadı</span>
          </p>
        </div>
        <div className="hidden text-right md:block">
          <span className="eyebrow">En büyük blok</span>
          <p className="display-lg text-accent">UBP · 198</p>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox="0 0 1000 410" className="w-full">
          <line
            x1="500" y1="20" x2="500" y2="360"
            stroke="var(--color-foreground)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <text
            x="500" y="14"
            textAnchor="middle"
            className="fill-muted-foreground font-mono"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em" }}
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
                stroke={isHover ? "var(--color-foreground)" : "transparent"}
                strokeWidth={isHover ? 1.5 : 0}
                style={{ cursor: "pointer" }}
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

        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none fixed z-50 min-w-[200px] border border-border bg-popover px-3 py-2.5 shadow-2xl"
              style={{ left: hover.x + 14, top: hover.y + 14 }}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: hover.party.color }}
                />
                <span className="text-xs font-bold text-foreground">
                  {hover.party.abbr}
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  #{String(hover.seatNo).padStart(3, "0")}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-muted-foreground">
                {hover.party.name}
              </p>
              <p className="mt-1.5 border-t border-border pt-1.5 text-sm font-semibold text-foreground">
                {hover.deputy}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coalition bars */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {COALITIONS.map((cn) => (
          <div key={cn.id} className="panel-flat p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {cn.name}
              </span>
              <span className="font-display text-2xl" style={{ color: cn.color }}>
                {cn.seats}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden bg-surface-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(cn.seats / TOTAL_SEATS) * 100}%` }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="h-full"
                style={{ backgroundColor: cn.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Party legend */}
      <div className="mt-6 hr-rule" />
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4 lg:grid-cols-7">
        {PARTIES.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-foreground">{p.abbr}</span>
                <span className="tabular-nums font-mono text-xs text-muted-foreground">
                  %{p.percent}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <span className="tabular-nums">{p.seats}</span>
                <span className={p.delta >= 0 ? "text-cyan" : "text-primary"}>
                  ({p.delta >= 0 ? "+" : ""}{p.delta})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
