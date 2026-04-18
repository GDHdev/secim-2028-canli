import { createFileRoute, Link } from "@tanstack/react-router";
import { PresidentRace } from "@/components/PresidentRace";
import { SecondRoundGauge } from "@/components/SecondRoundGauge";
import { Parliament } from "@/components/Parliament";
import { TurkeyMap } from "@/components/TurkeyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { StatsGrid } from "@/components/StatsGrid";
import { MicroNews } from "@/components/MicroNews";
import { MegaNumbers } from "@/components/MegaNumbers";
import { RegionStrip } from "@/components/RegionStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seçim 2028 — Cumhurbaşkanlığı & Milletvekili Canlı Sonuçları" },
      { name: "description", content: "14 Mart 2028 Türkiye Cumhurbaşkanlığı ve Milletvekili Seçimleri canlı sonuçları, harita, parlamento dağılımı, anketler." },
      { property: "og:title", content: "Seçim 2028 — Canlı Sonuçlar" },
      { property: "og:description", content: "Cumhurbaşkanlığı yarışı, 600 sandalye, 81 il sonuçları, 2. tur projeksiyonu." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background">
      {/* HERO BAND */}
      <section className="border-b border-border px-4 pt-8 pb-6 md:px-8 md:pt-12 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow-accent">Seçim Gecesi · 14 Mart 2028</span>
            <h1 className="display-mega mt-2 text-balance text-foreground">
              CUMHURİYETİN <br className="hidden md:inline" />
              <span className="text-primary">SEÇİMİ</span>
            </h1>
          </div>
          <div className="max-w-md">
            <p className="font-serif text-lg leading-snug text-muted-foreground">
              Türkiye 64 milyon seçmenle sandık başında. Cumhurbaşkanlığı yarışında 2. tur kaçınılmaz görünürken,
              meclis aritmetiği yeniden yazılıyor.
            </p>
            <div className="mt-4 flex gap-2">
              <Link to="/harita" className="border border-border bg-card px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-foreground hover:bg-surface-2">
                Harita →
              </Link>
              <Link to="/tur2" className="border border-accent bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/85">
                2. Tur Simülatörü
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MEGA STATS STRIP */}
      <MegaNumbers />

      {/* PRESIDENTIAL + GAUGE */}
      <section className="px-4 py-10 md:px-8 lg:px-12">
        <div className="mb-6 flex items-baseline justify-between border-b-2 border-foreground pb-2">
          <h2 className="display-lg text-foreground">CUMHURBAŞKANLIĞI</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Sayım %74.6 · Önde: Yılmaz
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <PresidentRace />
          <SecondRoundGauge />
        </div>
      </section>

      {/* REGION STRIP — 7 bölge anlık */}
      <RegionStrip />

      {/* MAP — full bleed */}
      <section className="px-4 py-10 md:px-8 lg:px-12">
        <div className="mb-6 flex items-baseline justify-between border-b-2 border-foreground pb-2">
          <h2 className="display-lg text-foreground">81 İL HARİTASI</h2>
          <Link to="/harita" className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent hover:underline">
            Detaylı harita →
          </Link>
        </div>
      </section>
      <section className="-mt-4">
        <TurkeyMap className="h-[680px] border-y border-border bg-card" />
      </section>

      {/* PARLIAMENT */}
      <section className="px-4 py-10 md:px-8 lg:px-12">
        <div className="mb-6 flex items-baseline justify-between border-b-2 border-foreground pb-2">
          <h2 className="display-lg text-foreground">MİLLETVEKİLİ</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            600 Sandalye · 7 Parti
          </span>
        </div>
        <Parliament />
      </section>

      {/* LIVE FEED + STATS */}
      <section className="px-4 py-10 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div>
            <div className="mb-6 flex items-baseline justify-between border-b-2 border-foreground pb-2">
              <h2 className="display-lg text-foreground">CANLI</h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">● AKTİF</span>
            </div>
            <LiveFeed />
          </div>
          <div>
            <div className="mb-6 flex items-baseline justify-between border-b-2 border-foreground pb-2">
              <h2 className="display-lg text-foreground">İSTATİSTİKLER</h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Veri özeti
              </span>
            </div>
            <StatsGrid />
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="px-4 pb-10 md:px-8 lg:px-12">
        <MicroNews limit={6} />
      </section>
    </div>
  );
}
