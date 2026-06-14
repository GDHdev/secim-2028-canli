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
    <div className="mb-7 flex flex-col gap-3 md:mb-9 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {kicker && (
          <div className="mb-2 inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_oklch(0.68_0.25_25/0.7)]" />
            {kicker}
          </div>
        )}
        <h2 className="text-[28px] font-bold tracking-tight text-gray-900 md:text-[34px]">
          {title}
        </h2>
        {meta && (
          <div className="mt-1.5 text-[15px] text-gray-500">{meta}</div>
        )}
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-white/[0.16] hover:bg-white/[0.07] hover:text-gray-900 md:self-end"
        >
          {cta.label}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

function Index() {
  return (
    <div className="bg-background">
      {/* 1 — AI ÖZET şeridi */}
      <AISummary />

      {/* 2 — KOMUTA HERO */}
      <CommandHero />

      {/* 3 — CUMHURBAŞKANLIĞI YARIŞI + 2.TUR PROJEKSİYONU */}
      <Reveal as="section" className="site-container py-14 md:py-16">
        <RevealItem>
          <SectionHeader
            kicker="Cumhurbaşkanlığı · 1. Tur"
            title="Adaylar arası yarış"
            meta="Sıralama her 2.2 sn yenilenir · sandık verisi ile"
          />
        </RevealItem>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
          <RevealItem><PresidentRace /></RevealItem>
          <RevealItem><SecondRoundGauge /></RevealItem>
        </div>
      </Reveal>

      {/* 4 — BÖLGE RIBBONU */}
      <Reveal>
        <RegionStrip />
      </Reveal>

      {/* 5 — TÜRKİYE HARİTASI */}
      <Reveal as="section" className="site-container pt-14 pb-5 md:pt-16">
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
            <TurkeyMap className="h-[680px] border-y border-white/[0.06] bg-[oklch(0.155_0.020_264)]" />
          </section>
        </RevealItem>
      </Reveal>

      {/* 6 — MECLİS + CANLI AKIŞ */}
      <Reveal as="section" className="site-container py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <RevealItem>
              <SectionHeader
                kicker="Milletvekili · 600 Sandalye"
                title="Meclis dağılımı"
                meta="7 parti · koalisyon eşiği 301 sandalye"
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

      {/* 7 — SWING + İSTATİSTİKLER */}
      <Reveal as="section" className="relative overflow-hidden border-y border-white/[0.06] bg-[oklch(0.155_0.020_264)]">
        <div
          className="pointer-events-none absolute -top-32 left-[20%] h-72 w-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.62 0.25 25)" }}
        />
        <div className="site-container relative py-14 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr]">
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
      <Reveal as="section" className="site-container py-14 md:py-16">
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
