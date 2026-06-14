import { createFileRoute, Link } from "@tanstack/react-router";
import { NewsroomHero } from "@/components/NewsroomHero";
import { PresidentRace } from "@/components/PresidentRace";
import { SecondRoundGauge } from "@/components/SecondRoundGauge";
import { Parliament } from "@/components/Parliament";
import { TurkeyMap } from "@/components/TurkeyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { MicroNews } from "@/components/MicroNews";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seçim 2028 — Cumhurbaşkanlığı & Milletvekili Canlı Sonuçları" },
      { name: "description", content: "14 Mart 2028 Türkiye Cumhurbaşkanlığı ve Milletvekili Seçimleri canlı sonuçları, harita, parlamento dağılımı." },
      { property: "og:title", content: "Seçim 2028 — Canlı Sonuçlar" },
      { property: "og:description", content: "Cumhurbaşkanlığı yarışı, 600 sandalye, 81 il sonuçları, 2. tur projeksiyonu." },
    ],
  }),
  component: Index,
});

function SectionHeader({
  idx,
  kicker,
  title,
  meta,
  cta,
}: {
  idx: string;
  kicker: string;
  title: string;
  meta?: string;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="term-sec-label">
        <span className="idx">{idx}</span>
        <span>{kicker}</span>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="term-sec-title">{title}</h2>
          {meta && (
            <p className="mt-1.5 font-mono text-[12px] uppercase tracking-[0.12em] text-gray-500">
              {meta}
            </p>
          )}
        </div>
        {cta && (
          <Link
            to={cta.to}
            className="group inline-flex shrink-0 items-center gap-1.5 self-start border border-gray-900 bg-white px-3.5 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white sm:self-end"
          >
            {cta.label}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <div className="term-sec-rule mt-4" />
    </div>
  );
}

function Index() {
  return (
    <div className="bg-background">
      <NewsroomHero />

      {/* 02 — Adaylar yarışı */}
      <section className="site-container py-10 md:py-14">
        <SectionHeader
          idx="02"
          kicker="Cumhurbaşkanlığı · 1. Tur"
          title="Adaylar arası yarış"
          meta="Sandık verisi · sıralama 2.2 sn'de bir güncellenir"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <PresidentRace />
          <SecondRoundGauge />
        </div>
      </section>

      {/* 03 — Harita */}
      <section className="site-container">
        <SectionHeader
          idx="03"
          kicker="81 İl · Coğrafi dağılım"
          title="Türkiye haritası"
          meta="İl üzerine gelin · lider parti, fark ve sayım yüzdesi"
          cta={{ to: "/harita", label: "Detaylı harita" }}
        />
      </section>
      <section>
        <TurkeyMap className="h-[640px] border-y border-gray-200 bg-gray-50" />
      </section>

      {/* 04 — Meclis + Akış */}
      <section className="site-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeader
              idx="04"
              kicker="Milletvekili · 600 sandalye"
              title="Meclis dağılımı"
              meta="7 parti · koalisyon eşiği 301 sandalye"
              cta={{ to: "/milletvekili", label: "Tüm sandalyeler" }}
            />
            <Parliament />
          </div>
          <div>
            <SectionHeader
              idx="05"
              kicker="Canlı akış"
              title="Anlık gelişmeler"
              meta="Son dakika · editöryel akış"
            />
            <LiveFeed />
          </div>
        </div>
      </section>

      {/* 06 — Haberler */}
      <section className="site-container pb-16">
        <SectionHeader
          idx="06"
          kicker="Gündem"
          title="Son haberler"
          meta="Editöryel akış · son 24 saat"
          cta={{ to: "/haberler", label: "Tüm haberler" }}
        />
        <MicroNews limit={6} />
      </section>
    </div>
  );
}
