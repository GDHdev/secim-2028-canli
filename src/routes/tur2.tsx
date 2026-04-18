import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CANDIDATES } from "@/lib/mock-data";

export const Route = createFileRoute("/tur2")({
  head: () => ({
    meta: [
      { title: "2. Tur Simülatörü | Seçim 2028" },
      { name: "description", content: "Yılmaz vs Kaya: Demir seçmenlerinin oylarının dağılımına göre 2. tur projeksiyonu." },
      { property: "og:title", content: "2. Tur Simülatörü | Seçim 2028" },
      { property: "og:description", content: "Demir seçmenleri ne yaparsa kim kazanır? İnteraktif 2. tur simülatörü." },
    ],
  }),
  component: Tur2Page,
});

function Tur2Page() {
  const yilmaz = CANDIDATES.find((c) => c.id === "yilmaz")!;
  const kaya = CANDIDATES.find((c) => c.id === "kaya")!;
  const demir = CANDIDATES.find((c) => c.id === "demir")!;

  const [toKaya, setToKaya] = useState(60);
  const [abstain, setAbstain] = useState(15);

  const projection = useMemo(() => {
    const baseY = yilmaz.percent;
    const baseK = kaya.percent;
    const baseD = demir.percent;
    const others = 100 - baseY - baseK - baseD;
    const otherToK = others * 0.5;
    const otherToY = others * 0.5;
    const activeDemir = baseD * (1 - abstain / 100);
    const dToK = activeDemir * (toKaya / 100);
    const dToY = activeDemir * (1 - toKaya / 100);
    const yTotal = baseY + otherToY + dToY;
    const kTotal = baseK + otherToK + dToK;
    const sum = yTotal + kTotal;
    const yPct = (yTotal / sum) * 100;
    const kPct = (kTotal / sum) * 100;
    return { yPct, kPct, winner: (yPct > kPct ? "yilmaz" : "kaya") as const };
  }, [toKaya, abstain, yilmaz, kaya, demir]);

  const winnerCand = projection.winner === "yilmaz" ? yilmaz : kaya;
  const margin = Math.abs(projection.yPct - projection.kPct);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="border-b border-border px-4 pt-10 pb-8 md:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
                ● Kesinleşti
              </span>
              <span className="eyebrow">14 Nisan 2028</span>
            </div>
            <h1 className="display-mega mt-2 text-foreground">
              İKİNCİ <span className="text-accent">TUR</span>
            </h1>
            <p className="mt-3 max-w-xl font-serif text-lg text-muted-foreground">
              Üçüncü sıradaki <span className="text-foreground">Can Demir</span> seçmenleri kararı belirleyecek.
              Aşağıdaki sliderlarla farklı senaryoları test edin.
            </p>
          </div>
        </div>
      </section>

      {/* Battle visualization */}
      <section className="px-4 py-10 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-0 border border-border md:grid-cols-[1fr_auto_1fr]">
          <CandSide candidate={yilmaz} percent={projection.yPct} winner={projection.winner === "yilmaz"} side="left" />
          <div className="flex items-center justify-center border-y border-border px-6 py-4 md:border-x md:border-y-0">
            <span className="font-display text-5xl text-muted-foreground">VS</span>
          </div>
          <CandSide candidate={kaya} percent={projection.kPct} winner={projection.winner === "kaya"} side="right" />
        </div>

        {/* Combined bar */}
        <div className="mt-6 flex h-6 overflow-hidden border border-border">
          <motion.div
            animate={{ width: `${projection.yPct}%` }}
            transition={{ type: "spring", damping: 24 }}
            style={{ backgroundColor: yilmaz.color }}
          />
          <motion.div
            animate={{ width: `${projection.kPct}%` }}
            transition={{ type: "spring", damping: 24 }}
            style={{ backgroundColor: kaya.color }}
          />
        </div>
      </section>

      {/* Controls */}
      <section className="px-4 pb-10 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <div className="panel p-6 md:p-8">
            <span className="eyebrow-accent">Demir Seçmen Davranışı</span>
            <h2 className="display-lg mt-1 mb-6 text-foreground">SENARYO PARAMETRELERİ</h2>

            <div className="space-y-8">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                    Demir oyları nereye?
                  </label>
                  <span className="tabular-nums font-mono text-xs text-muted-foreground">
                    %{100 - toKaya} Yılmaz · %{toKaya} Kaya
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg" style={{ color: yilmaz.color }}>YILMAZ</span>
                  <input
                    type="range" min={0} max={100} value={toKaya}
                    onChange={(e) => setToKaya(+e.target.value)}
                    className="h-2 flex-1 accent-accent"
                  />
                  <span className="font-display text-lg" style={{ color: kaya.color }}>KAYA</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                    Sandığa gitmeme oranı
                  </label>
                  <span className="tabular-nums font-display text-2xl text-accent">%{abstain}</span>
                </div>
                <input
                  type="range" min={0} max={50} value={abstain}
                  onChange={(e) => setAbstain(+e.target.value)}
                  className="h-2 w-full accent-accent"
                />
              </div>
            </div>
          </div>

          {/* Winner card */}
          <motion.div
            key={projection.winner}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden border border-accent bg-card p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1 stripes-warning" />
            <span className="eyebrow-accent">Projeksiyon Kazananı</span>
            <p className="mt-3 font-display text-7xl tracking-tight" style={{ color: winnerCand.color }}>
              {winnerCand.name.split(" ")[1].toUpperCase()}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{winnerCand.party}</p>

            <div className="mt-6 hr-rule" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="eyebrow">Oy oranı</span>
                <p className="font-display text-4xl text-foreground">
                  %{(projection.winner === "yilmaz" ? projection.yPct : projection.kPct).toFixed(1)}
                </p>
              </div>
              <div>
                <span className="eyebrow">Fark</span>
                <p className="font-display text-4xl text-accent">
                  +{margin.toFixed(1)}
                </p>
              </div>
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Bu bir simülasyondur · Gerçek sonuçları temsil etmez
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function CandSide({ candidate, percent, winner, side }: {
  candidate: typeof CANDIDATES[number]; percent: number; winner: boolean; side: "left" | "right";
}) {
  return (
    <div className={`flex flex-col gap-3 p-8 ${winner ? "bg-accent/[0.06]" : "bg-card"} ${side === "right" ? "items-end text-right" : "items-start"}`}>
      {winner && (
        <span className="bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
          ★ Kazanıyor
        </span>
      )}
      <p className="font-display text-5xl tracking-tight text-foreground md:text-6xl">
        {candidate.name.split(" ")[1].toUpperCase()}
      </p>
      <p className="font-mono text-xs text-muted-foreground">{candidate.party}</p>
      <motion.span
        key={percent.toFixed(1)}
        initial={{ scale: 0.92, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-display text-7xl leading-none md:text-8xl"
        style={{ color: candidate.color }}
      >
        %{percent.toFixed(1)}
      </motion.span>
    </div>
  );
}
