import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PROVINCES, type Province, CANDIDATES } from "@/lib/mock-data";
import { X } from "lucide-react";

// Approximate (col, row) positions for Turkey's 81 provinces in a stylized cartogram grid.
// Map roughly mimics geographic position.
const POS: Record<string, [number, number]> = {
  // row 0 = north, increases southward; col 0 = west
  // Marmara / Northwest
  edirne: [0, 1], kirklareli: [1, 0], tekirdag: [1, 1], istanbul: [2, 1],
  kocaeli: [3, 1], sakarya: [4, 1], duzce: [5, 1], bolu: [5, 2],
  bilecik: [4, 2], bursa: [3, 2], yalova: [3, 1.5] as unknown as [number, number],
  balikesir: [2, 2], canakkale: [1, 2],

  // Ege
  izmir: [1, 3], manisa: [2, 3], aydin: [2, 4], mugla: [2, 5],
  denizli: [3, 4], usak: [3, 3], kutahya: [4, 3], afyonkarahisar: [4, 4],

  // Akdeniz
  burdur: [4, 5], isparta: [5, 4], antalya: [5, 5],
  mersin: [7, 6], adana: [8, 6], osmaniye: [9, 6], hatay: [9, 7],
  kahramanmaras: [9, 5], kilis: [10, 7],

  // İç Anadolu
  eskisehir: [5, 3], ankara: [6, 3], konya: [6, 5], karaman: [7, 5],
  kirikkale: [7, 3], cankiri: [7, 2], kirsehir: [7, 4], aksaray: [7, 4.5] as unknown as [number, number],
  nevsehir: [8, 4], nigde: [8, 5], yozgat: [8, 3], sivas: [9, 3],
  kayseri: [9, 4],

  // Karadeniz
  zonguldak: [5, 0.5] as unknown as [number, number], bartin: [6, 0.5] as unknown as [number, number],
  karabuk: [6, 1.5] as unknown as [number, number], kastamonu: [7, 1],
  sinop: [8, 0.5] as unknown as [number, number], samsun: [9, 1], amasya: [9, 2],
  tokat: [10, 2], corum: [8, 2], ordu: [10, 1], giresun: [11, 1],
  trabzon: [12, 1], rize: [13, 1], artvin: [14, 1],
  bayburt: [12, 2], gumushane: [11, 2],

  // Doğu Anadolu
  erzurum: [12, 3], erzincan: [11, 3], tunceli: [10, 3], elazig: [10, 4],
  malatya: [10, 5], bingol: [11, 4], mus: [12, 4], bitlis: [13, 5],
  van: [14, 5], hakkari: [14, 6], agri: [13, 4], kars: [14, 3],
  ardahan: [15, 2], igdir: [15, 4],

  // Güneydoğu
  adiyaman: [10, 6], gaziantep: [10, 7], sanliurfa: [11, 7], diyarbakir: [12, 6],
  mardin: [12, 7], batman: [13, 6], siirt: [13, 7], sirnak: [13, 8],
};

const candidateColor = (id: "yilmaz" | "kaya" | "demir") =>
  CANDIDATES.find((c) => c.id === id)!.color;

export function TurkeyMap({ inline = false }: { inline?: boolean }) {
  const [selected, setSelected] = useState<Province | null>(null);
  const [hover, setHover] = useState<Province | null>(null);
  const [tipPos, setTipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const cellW = 44;
  const cellH = 44;
  const gap = 4;

  const placed = PROVINCES.filter((p) => POS[p.id]);
  const cols = Math.max(...placed.map((p) => POS[p.id]![0])) + 1;
  const rows = Math.max(...placed.map((p) => POS[p.id]![1])) + 1;

  const width = cols * (cellW + gap) + 20;
  const height = rows * (cellH + gap) + 20;

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-wider text-foreground">TÜRKİYE HARİTASI</h2>
          <p className="font-mono text-[10px] text-muted-foreground">81 İL · ÖNDE OLAN ADAYA GÖRE RENKLENDİRME</p>
        </div>
        <Legend />
      </div>

      <div
        className="relative overflow-x-auto rounded-sm border border-border bg-surface-1 p-3"
        onMouseLeave={() => setHover(null)}
      >
        <svg width={width} height={height} className="block">
          {placed.map((p, i) => {
            const [c, r] = POS[p.id]!;
            const x = 10 + c * (cellW + gap);
            const y = 10 + r * (cellH + gap);
            const fill = candidateColor(p.leader);
            const isSelected = selected?.id === p.id;
            const initial = p.name.slice(0, 3).toUpperCase();
            return (
              <motion.g
                key={p.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.012, duration: 0.3 }}
                onMouseEnter={(e) => {
                  setHover(p);
                  setTipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => setTipPos({ x: e.clientX, y: e.clientY })}
                onClick={() => setSelected(p)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={x} y={y}
                  width={cellW} height={cellH}
                  fill={fill}
                  fillOpacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? "var(--color-accent)" : "var(--color-background)"}
                  strokeWidth={isSelected ? 2 : 1}
                  rx="2"
                />
                <text
                  x={x + cellW / 2} y={y + cellH / 2 + 4}
                  textAnchor="middle"
                  className="pointer-events-none select-none font-mono"
                  fontSize="10"
                  fontWeight="700"
                  fill="white"
                >
                  {initial}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hover && !inline && (
          <div
            className="pointer-events-none fixed z-40 rounded-sm border border-border bg-popover px-3 py-2 text-xs shadow-lg"
            style={{ left: tipPos.x + 14, top: tipPos.y + 14 }}
          >
            <div className="font-display text-base tracking-wider">{hover.name}</div>
            <div className="text-muted-foreground">
              Önde: <span className="font-medium text-foreground">{candName(hover.leader)}</span>{" "}
              <span className="font-mono text-accent">%{hover.results[hover.leader]}</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">Sayım: %{hover.counted}</div>
          </div>
        )}
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{selected.region.toUpperCase()}</p>
                  <h3 className="font-display text-4xl tracking-wider text-foreground">{selected.name.toUpperCase()}</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    Nüfus: {selected.population.toLocaleString("tr-TR")} · Sayım: %{selected.counted}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-sm p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  aria-label="Kapat"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {(["yilmaz", "kaya", "demir", "other"] as const).map((id) => {
                  const c = CANDIDATES.find((x) => x.id === id)!;
                  const v = selected.results[id];
                  const isLeader = id === selected.leader;
                  return (
                    <div key={id}>
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className={`font-display text-lg tracking-wide ${isLeader ? "text-accent" : "text-foreground"}`}>
                          {c.name.toUpperCase()}
                        </span>
                        <span className={`font-display text-2xl ${isLeader ? "text-accent" : "text-foreground"}`}>
                          %{v}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-sm bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${v}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full" style={{ backgroundColor: c.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-sm border border-border bg-surface-1 p-3">
                  <p className="font-mono text-[10px] text-muted-foreground">KATILIM 2028</p>
                  <p className="font-display text-3xl text-foreground">%{selected.turnout}</p>
                </div>
                <div className="rounded-sm border border-border bg-surface-1 p-3">
                  <p className="font-mono text-[10px] text-muted-foreground">KATILIM 2023</p>
                  <p className="font-display text-3xl text-muted-foreground">%{selected.turnout2023}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-mono text-[10px] text-muted-foreground">İLÇE BAZINDA (ÖRNEK)</p>
                <table className="mt-2 w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[10px] text-muted-foreground">
                      <th className="py-2">İLÇE</th>
                      <th>YIL.</th>
                      <th>KAYA</th>
                      <th>DEMİR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fakeDistricts(selected).map((d) => (
                      <tr key={d.name} className="border-b border-border/40">
                        <td className="py-1.5">{d.name}</td>
                        <td className="font-mono">%{d.y}</td>
                        <td className="font-mono">%{d.k}</td>
                        <td className="font-mono">%{d.de}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Link
                to="/sonuclar"
                className="mt-6 inline-block font-mono text-xs text-accent hover:underline"
              >
                Tüm sonuçlar tablosu →
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3">
      {CANDIDATES.slice(0, 3).map((c) => (
        <div key={c.id} className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: c.color }} />
          <span className="font-mono text-[10px] text-muted-foreground">{c.name.split(" ")[1].toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

function candName(id: "yilmaz" | "kaya" | "demir") {
  return CANDIDATES.find((c) => c.id === id)!.name;
}

function fakeDistricts(p: Province) {
  const base = p.results;
  const names = ["Merkez", "Çankaya", "Kadıköy", "Şişli", "Bağcılar"].slice(0, 4);
  return names.map((n, i) => {
    const drift = (i - 1.5) * 3;
    return {
      name: n,
      y: Math.max(0, Math.round(base.yilmaz + drift)),
      k: Math.max(0, Math.round(base.kaya - drift / 2)),
      de: Math.max(0, Math.round(base.demir + drift / 3)),
    };
  });
}
