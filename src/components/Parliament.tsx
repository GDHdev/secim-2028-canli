import { motion } from "framer-motion";
import { PARTIES, TOTAL_SEATS, MAJORITY_THRESHOLD, COALITIONS } from "@/lib/mock-data";

/**
 * Hemicycle parliament chart.
 * Distributes 600 seats across an arc, colored by party.
 */
export function Parliament() {
  // Build seats in expanded order based on PARTIES seat counts
  const seatList: { party: typeof PARTIES[number] }[] = [];
  PARTIES.forEach((p) => {
    for (let i = 0; i < p.seats; i++) seatList.push({ party: p });
  });

  // Hemicycle layout: 12 rows, distributed seats
  const rows = 14;
  const seatsPerRow: number[] = [];
  let remaining = TOTAL_SEATS;
  // Geometric distribution: outer rows have more seats
  const baseWeights = Array.from({ length: rows }, (_, i) => 1 + i * 0.18);
  const weightSum = baseWeights.reduce((s, w) => s + w, 0);
  baseWeights.forEach((w, i) => {
    const count = i === rows - 1
      ? remaining
      : Math.round((w / weightSum) * TOTAL_SEATS);
    seatsPerRow.push(count);
    remaining -= count;
  });

  // Generate (cx,cy) for each seat
  const cx = 500;
  const cy = 360;
  const innerR = 130;
  const outerR = 340;
  const seatPositions: { x: number; y: number; partyId: string }[] = [];
  let idx = 0;
  seatsPerRow.forEach((count, rowI) => {
    const r = innerR + ((outerR - innerR) * rowI) / (rows - 1);
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = Math.PI * (1 - t); // from π (left) to 0 (right)
      const x = cx + Math.cos(angle) * r;
      const y = cy - Math.sin(angle) * r;
      const seat = seatList[idx];
      if (seat) {
        seatPositions.push({ x, y, partyId: seat.party.id });
        idx++;
      }
    }
  });

  return (
    <div className="panel p-6 md:p-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="eyebrow-accent">Türkiye Büyük Millet Meclisi</span>
          <h2 className="display-lg mt-1 text-foreground">600 SANDALYE</h2>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Çoğunluk için <span className="font-bold text-foreground">301</span> sandalye gerekli ·
            <span className="ml-1.5 text-primary">Hiçbir parti tek başına çoğunluğu sağlayamadı</span>
          </p>
        </div>
        <div className="hidden text-right md:block">
          <span className="eyebrow">En büyük blok</span>
          <p className="display-lg text-accent">
            UBP · 198
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox="0 0 1000 410" className="w-full">
          {/* majority threshold marker */}
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
            style={{ fontSize: 11, letterSpacing: "0.12em" }}
          >
            ÇOĞUNLUK · {MAJORITY_THRESHOLD}
          </text>

          {seatPositions.map((s, i) => {
            const party = PARTIES.find((p) => p.id === s.partyId)!;
            return (
              <motion.circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={6.5}
                fill={party.color}
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
      </div>

      {/* Coalition bars */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {COALITIONS.map((c) => (
          <div key={c.id} className="panel-flat p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {c.name}
              </span>
              <span className="font-display text-3xl" style={{ color: c.color }}>
                {c.seats}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden bg-surface-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(c.seats / TOTAL_SEATS) * 100}%` }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="h-full"
                style={{ backgroundColor: c.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Party legend */}
      <div className="mt-6 hr-rule" />
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4 lg:grid-cols-7">
        {PARTIES.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-xs font-bold text-foreground">{p.abbr}</span>
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
