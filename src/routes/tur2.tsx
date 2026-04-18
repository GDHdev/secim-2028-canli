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

  // Slider: % of Demir voters who go to Kaya (rest go to Yılmaz, ignoring abstain for simplicity)
  const [toKaya, setToKaya] = useState(60); // default: most lean to Kaya
  const [abstain, setAbstain] = useState(15); // % of Demir voters who don't vote

  const projection = useMemo(() => {
    const baseY = yilmaz.percent;
    const baseK = kaya.percent;
    const baseD = demir.percent;
    const others = 100 - baseY - baseK - baseD; // ~7.7

    // Distribute others ~50/50, then redistribute Demir
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
    return { yPct, kPct, winner: yPct > kPct ? "yilmaz" : "kaya" as const };
  }, [toKaya, abstain, yilmaz, kaya, demir]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6">
        <span className="rounded-sm bg-accent px-2 py-0.5 font-display text-xs tracking-wider text-accent-foreground">
          2. TUR KESİNLEŞTİ
        </span>
        <h1 className="mt-2 font-display text-5xl tracking-wider text-foreground md:text-6xl">
          14 NİSAN: <span className="text-accent">İKİNCİ TUR</span>
        </h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Üçüncü sıradaki Can Demir seçmenlerinin oyları nereye giderse kim kazanır? Slider ile deneyin.
        </p>
      </div>

      {/* Head to head */}
      <div className="grid grid-cols-2 gap-3">
        <CandCard candidate={yilmaz} percent={projection.yPct} winner={projection.winner === "yilmaz"} side="left" />
        <CandCard candidate={kaya} percent={projection.kPct} winner={projection.winner === "kaya"} side="right" />
      </div>

      {/* Combined bar */}
      <div className="mt-4 flex h-4 overflow-hidden rounded-sm border border-border">
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
      <div className="mt-1 flex justify-between font-mono text-xs">
        <span style={{ color: yilmaz.color }}>%{projection.yPct.toFixed(1)}</span>
        <span style={{ color: kaya.color }}>%{projection.kPct.toFixed(1)}</span>
      </div>

      {/* Sliders */}
      <div className="mt-8 space-y-6 rounded-sm border border-border bg-surface-1 p-6">
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="font-display text-base tracking-wider text-foreground">
              CAN DEMİR SEÇMENLERİ NASIL OY KULLANIRSA?
            </label>
            <span className="font-mono text-xs text-muted-foreground">{toKaya}% Kaya · {100 - toKaya}% Yılmaz</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display text-sm" style={{ color: yilmaz.color }}>YILMAZ</span>
            <input
              type="range" min={0} max={100} value={toKaya}
              onChange={(e) => setToKaya(+e.target.value)}
              className="h-2 flex-1 accent-accent"
            />
            <span className="font-display text-sm" style={{ color: kaya.color }}>KAYA</span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="font-display text-base tracking-wider text-foreground">
              SANDIĞA GİTMEME ORANI
            </label>
            <span className="font-mono text-xs text-accent">%{abstain}</span>
          </div>
          <input
            type="range" min={0} max={50} value={abstain}
            onChange={(e) => setAbstain(+e.target.value)}
            className="h-2 w-full accent-accent"
          />
        </div>
      </div>

      {/* Winner banner */}
      <motion.div
        key={projection.winner}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex items-center justify-between rounded-sm border border-accent/40 bg-accent/10 px-6 py-4"
      >
        <div>
          <p className="font-mono text-xs text-muted-foreground">PROJEKSİYON KAZANANI</p>
          <p className="font-display text-3xl tracking-wider text-accent">
            {projection.winner === "yilmaz" ? yilmaz.name.toUpperCase() : kaya.name.toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-muted-foreground">FARK</p>
          <p className="font-display text-3xl text-foreground">
            %{Math.abs(projection.yPct - projection.kPct).toFixed(1)}
          </p>
        </div>
      </motion.div>

      <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
        BU BİR SİMÜLASYONDUR · GERÇEK SONUÇLARI TEMSİL ETMEZ
      </p>
    </div>
  );
}

function CandCard({ candidate, percent, winner, side }: {
  candidate: typeof CANDIDATES[number]; percent: number; winner: boolean; side: "left" | "right";
}) {
  return (
    <div className={`rounded-sm border p-5 transition-colors ${winner ? "border-accent bg-accent/5" : "border-border bg-surface-1"}`}>
      <div className={`flex items-baseline justify-between ${side === "right" ? "flex-row-reverse" : ""}`}>
        <div>
          {winner && (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 font-display text-xs tracking-wider text-accent-foreground">
              KAZANIYOR
            </span>
          )}
          <p className="mt-2 font-display text-2xl tracking-wider text-foreground md:text-3xl">
            {candidate.name.toUpperCase()}
          </p>
          <p className="font-mono text-xs text-muted-foreground">{candidate.party}</p>
        </div>
        <motion.span
          key={percent.toFixed(1)}
          initial={{ scale: 0.95, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-6xl"
          style={{ color: candidate.color }}
        >
          %{percent.toFixed(1)}
        </motion.span>
      </div>
    </div>
  );
}
