import { createFileRoute, Link } from "@tanstack/react-router";
import { PresidentRace } from "@/components/PresidentRace";
import { SecondRoundGauge } from "@/components/SecondRoundGauge";
import { Parliament } from "@/components/Parliament";
import { TurkeyMap } from "@/components/TurkeyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { StatsGrid } from "@/components/StatsGrid";
import { MicroNews } from "@/components/MicroNews";
import { RegionStrip } from "@/components/RegionStrip";
import { SwingProvinces } from "@/components/SwingProvinces";

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

function SectionHeader({ kicker, title, meta }: { kicker?: React.ReactNode; title: string; meta?: React.ReactNode }) {
  return (
    <div className="mb-5 border-b border-foreground pb-2">
      {kicker && <div className="eyebrow-accent mb-1">{kicker}</div>}
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="display-lg text-foreground">{title}</h2>
        {meta && <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{meta}</div>}
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="bg-background">
      {/* PRESIDENTIAL + GAUGE */}
      <section className="site-container py-9">
        <SectionHeader
          kicker="Cumhurbaşkanlığı Seçimi"
          title="Adaylar Arası Yarış"
          meta={<>Sayım %74.6 · Önde: Yılmaz</>}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <PresidentRace />
          <SecondRoundGauge />
        </div>
      </section>

      {/* REGION STRIP — 7 bölge anlık */}
      <RegionStrip />

      {/* MAP — full bleed */}
      <section className="site-container pt-9 pb-3">
        <SectionHeader
          kicker="81 İl · Anlık Liderler"
          title="Türkiye Haritası"
          meta={<Link to="/harita" className="text-primary hover:underline">Detaylı harita →</Link>}
        />
      </section>
      <section>
        <TurkeyMap className="h-[640px] border-y border-border bg-card" />
      </section>

      {/* PARLIAMENT */}
      <section className="site-container py-9">
        <SectionHeader
          kicker="Milletvekili Seçimi"
          title="Meclis Dağılımı"
          meta={<>600 Sandalye · 7 Parti · <Link to="/milletvekili" className="text-primary hover:underline">Detay →</Link></>}
        />
        <Parliament />
      </section>

      {/* SWING PROVINCES + LIVE */}
      <section className="site-container border-t border-border bg-surface-1 py-9">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeader
              kicker="Değişim"
              title="En Çok Salınan İller"
              meta={<>2023 → 2028</>}
            />
            <SwingProvinces />
          </div>
          <div>
            <SectionHeader
              kicker={<><span className="live-pulse mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />Canlı</>}
              title="Akış"
              meta="Son dakika"
            />
            <LiveFeed />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="site-container border-t border-border py-9">
        <SectionHeader
          kicker="Veri"
          title="İstatistikler"
          meta="Veri özeti"
        />
        <StatsGrid />
      </section>

      {/* NEWS */}
      <section className="site-container py-9">
        <SectionHeader
          kicker="Gündem"
          title="Son Haberler"
          meta={<Link to="/haberler" className="text-primary hover:underline">Tüm haberler →</Link>}
        />
        <MicroNews limit={6} />
      </section>
    </div>
  );
}
