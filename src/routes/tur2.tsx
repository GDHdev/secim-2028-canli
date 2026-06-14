import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CANDIDATES } from "@/lib/mock-data";
import { Swords, SlidersHorizontal, Trophy } from "lucide-react";
import { PageHero, SubSectionHeader } from "@/components/PageHero";

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
    const winner: "yilmaz" | "kaya" = yPct > kPct ? "yilmaz" : "kaya";
    return { yPct, kPct, winner };
  }, [toKaya, abstain, yilmaz, kaya, demir]);

  const winnerCand = projection.winner === "yilmaz" ? yilmaz : kaya;
  const margin = Math.abs(projection.yPct - projection.kPct);

  return (
    <div className="bg-background">
      <PageHero
        icon={Swords}
        tone="violet"
        kicker="14 Nisan 2028 · Kesinleşti"
        title="İkinci tur simülatörü"
        description="Üçüncü sıradaki Can Demir seçmenleri kararı belirleyecek. Sliderlarla farklı senaryoları test edin."
        actions={<span className="uui-badge uui-badge-brand">● Canlı projeksiyon</span>}
      />

      <section className="site-container py-10">
        <div className="uui-card overflow-hidden">
          <div className="grid grid-cols-1 items-stretch md:grid-cols-[1fr_auto_1fr]">
            <CandSide candidate={yilmaz} percent={projection.yPct} winner={projection.winner === "yilmaz"} side="left" />
            <div className="flex items-center justify-center border-y border-gray-200 px-6 py-4 md:border-x md:border-y-0">
              <span className="font-display text-3xl font-bold text-gray-400">VS</span>
            </div>
            <CandSide candidate={kaya} percent={projection.kPct} winner={projection.winner === "kaya"} side="right" />
          </div>
        </div>

        <div className="mt-5 flex h-3 overflow-hidden rounded-full border border-gray-200">
          <motion.div animate={{ width: `${projection.yPct}%` }} transition={{ type: "spring", damping: 24 }} style={{ backgroundColor: yilmaz.color }} />
          <motion.div animate={{ width: `${projection.kPct}%` }} transition={{ type: "spring", damping: 24 }} style={{ backgroundColor: kaya.color }} />
        </div>
      </section>

      <section className="site-container pb-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <div className="uui-card p-6 md:p-7">
            <SubSectionHeader
              icon={SlidersHorizontal}
              tone="indigo"
              kicker="Senaryo parametreleri"
              title="Demir seçmen davranışı"
              meta="Demir'in seçmenleri farklı oranlarda iki adaya dağıldığında ne olur?"
            />

            <div className="space-y-7">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="text-[14px] font-semibold text-gray-900">Demir oyları nereye?</label>
                  <span className="tabular-nums text-[13px] text-gray-500">
                    %{100 - toKaya} Yılmaz · %{toKaya} Kaya
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-[15px] font-bold" style={{ color: yilmaz.color }}>YILMAZ</span>
                  <input
                    type="range" min={0} max={100} value={toKaya}
                    onChange={(e) => setToKaya(+e.target.value)}
                    className="h-2 flex-1 accent-brand-600"
                  />
                  <span className="font-display text-[15px] font-bold" style={{ color: kaya.color }}>KAYA</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="text-[14px] font-semibold text-gray-900">Sandığa gitmeme oranı</label>
                  <span className="tabular-nums font-display text-[22px] font-bold text-brand-600">%{abstain}</span>
                </div>
                <input
                  type="range" min={0} max={50} value={abstain}
                  onChange={(e) => setAbstain(+e.target.value)}
                  className="h-2 w-full accent-brand-600"
                />
              </div>
            </div>
          </div>

          <motion.div
            key={projection.winner}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="uui-card relative overflow-hidden p-7"
          >
            <div className="flex items-center gap-3">
              <span className="uui-feat-icon uui-feat-icon-warning">
                <Trophy size={20} />
              </span>
              <p className="uui-sec-eyebrow">Projeksiyon kazananı</p>
            </div>
            <p className="mt-4 font-display text-[44px] font-bold tracking-tight" style={{ color: winnerCand.color }}>
              {winnerCand.name.split(" ")[1]}
            </p>
            <p className="mt-0.5 text-[13px] text-gray-500">{winnerCand.party}</p>

            <div className="mt-5 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">Oy oranı</p>
                  <p className="mt-1 font-display text-[28px] font-bold tabular-nums text-gray-900">
                    %{(projection.winner === "yilmaz" ? projection.yPct : projection.kPct).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">Fark</p>
                  <p className="mt-1 font-display text-[28px] font-bold tabular-nums text-brand-600">
                    +{margin.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[12px] text-gray-400">
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
    <div className={`flex flex-col gap-2 p-7 ${winner ? "bg-brand-50" : "bg-white"} ${side === "right" ? "items-end text-right" : "items-start"}`}>
      {winner && <span className="uui-badge uui-badge-brand">★ Kazanıyor</span>}
      <p className="font-display text-[28px] font-bold tracking-tight text-gray-900 md:text-[32px]">
        {candidate.name.split(" ")[1]}
      </p>
      <p className="text-[13px] text-gray-500">{candidate.party}</p>
      <motion.span
        key={percent.toFixed(1)}
        initial={{ scale: 0.92, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-display text-[60px] font-bold leading-none tabular-nums md:text-[72px]"
        style={{ color: candidate.color }}
      >
        %{percent.toFixed(1)}
      </motion.span>
    </div>
  );
}
