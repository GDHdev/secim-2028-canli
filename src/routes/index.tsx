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
import { AISummary } from "@/components/AISummary";
import { CommandHero } from "@/components/CommandHero";
import { Reveal, RevealItem } from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

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

function SectionHeader({
  kicker,
  title,
  meta,
  cta,
}: {
  kicker?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {kicker && (
          <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
            <span className="h-1 w-1 rounded-full bg-brand-600" />
            {kicker}
          </div>
        )}
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-[28px]">
          {title}
        </h2>
        {meta && (
          <div className="mt-1 text-sm text-gray-500">{meta}</div>
        )}
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-gray-200 bg-card px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 md:self-end"
        >
          {cta.label}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

function Index() {
  return (
    <div className="bg-background">
      {/* 1 — AI ÖZET şeridi (özet & son durum) */}
      <AISummary />

      {/* 2 — KOMUTA HERO (lider + sinyaller + sayım) */}
      <CommandHero />

      {/* 3 — CUMHURBAŞKANLIĞI YARIŞI + 2.TUR PROJEKSİYONU */}
      <Reveal as="section" className="site-container py-10 md:py-12">
        <RevealItem>
          <SectionHeader
            kicker="Cumhurbaşkanlığı · 1. Tur"
            title="Adaylar arası yarış"
            meta="Sıralama her 2.2 sn yenilenir · sandık verisi ile"
          />
        </RevealItem>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <RevealItem><PresidentRace /></RevealItem>
          <RevealItem><SecondRoundGauge /></RevealItem>
        </div>
      </Reveal>

      {/* 4 — BÖLGE RIBBONU (7 bölge anlık liderler) */}
      <Reveal>
        <RegionStrip />
      </Reveal>

      {/* 5 — TÜRKİYE HARİTASI */}
      <Reveal as="section" className="site-container pt-10 pb-4 md:pt-12">
        <RevealItem>
          <SectionHeader
            kicker="81 İl · Coğrafi Dağılım"
            title="Türkiye haritası"
            meta="İl üzerine gelin · lider parti, fark ve sayım yüzdesi"
            cta={{ to: "/harita", label: "Detaylı harita" }}
          />
        </RevealItem>
      </Reveal>
      <Reveal>
        <RevealItem>
          <section>
            <TurkeyMap className="h-[640px] border-y border-gray-200 bg-card" />
          </section>
        </RevealItem>
      </Reveal>

      {/* 6 — MECLİS + CANLI AKIŞ (yan yana) */}
      <Reveal as="section" className="site-container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <RevealItem>
              <SectionHeader
                kicker="Milletvekili · 600 Sandalye"
                title="Meclis dağılımı"
                meta="7 parti · koalisyon eşiği 301"
                cta={{ to: "/milletvekili", label: "Tüm sandalyeler" }}
              />
            </RevealItem>
            <RevealItem><Parliament /></RevealItem>
          </div>
          <div>
            <RevealItem>
              <SectionHeader
                kicker={<><span className="live-pulse mr-1 inline-block h-1.5 w-1.5 rounded-full bg-error-500 align-middle" />Canlı</>}
                title="Akış"
                meta="Son dakika gelişmeleri"
              />
            </RevealItem>
            <RevealItem><LiveFeed /></RevealItem>
          </div>
        </div>
      </Reveal>

      {/* 7 — SWING İLLER + İSTATİSTİKLER (gri zemin, analitik blok) */}
      <Reveal as="section" className="border-y border-gray-200 bg-gray-50">
        <div className="site-container py-10 md:py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <RevealItem>
                <SectionHeader
                  kicker="Değişim"
                  title="En çok salınan iller"
                  meta="2023 → 2028 · oy farkı analizi"
                />
              </RevealItem>
              <RevealItem><SwingProvinces /></RevealItem>
            </div>
            <div>
              <RevealItem>
                <SectionHeader
                  kicker="Veri"
                  title="İstatistikler"
                  meta="Sandık, katılım ve kesinleşen sonuçlar"
                />
              </RevealItem>
              <RevealItem><StatsGrid /></RevealItem>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 8 — SON HABERLER */}
      <Reveal as="section" className="site-container py-10 md:py-12">
        <RevealItem>
          <SectionHeader
            kicker="Gündem"
            title="Son haberler"
            meta="Editöryel akış · son 24 saat"
            cta={{ to: "/haberler", label: "Tüm haberler" }}
          />
        </RevealItem>
        <RevealItem><MicroNews limit={6} /></RevealItem>
      </Reveal>
    </div>
  );
}
