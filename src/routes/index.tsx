import { createFileRoute, Link } from "@tanstack/react-router";
import { NewsroomHero } from "@/components/NewsroomHero";
import { PresidentRace } from "@/components/PresidentRace";
import { SecondRoundGauge } from "@/components/SecondRoundGauge";
import { Parliament } from "@/components/Parliament";
import { TurkeyMap } from "@/components/TurkeyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { MicroNews } from "@/components/MicroNews";
import { ArrowRight, Users, Map, Landmark, Radio, Newspaper, type LucideIcon } from "lucide-react";

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
  kicker,
  title,
  meta,
  cta,
  icon: Icon,
}: {
  kicker?: string;
  title: string;
  meta?: string;
  cta?: { to: string; label: string };
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 border-b border-gray-200 pb-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {kicker && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1">
            {Icon && <Icon size={14} className="text-brand-700" strokeWidth={2.5} />}
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
              {kicker}
            </span>
          </div>
        )}
        <h2 className="font-display text-[40px] font-extrabold tracking-[-0.03em] text-gray-900 md:text-[56px]">
          {title}
        </h2>
        {meta && <p className="mt-2 text-[15px] font-medium text-gray-500 md:text-[16px]">{meta}</p>}
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-gray-900 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 md:self-end"
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
      <NewsroomHero />



      <section className="site-container py-10 md:py-14">
        <SectionHeader
          kicker="Cumhurbaşkanlığı · 1. Tur"
          title="Adaylar arası yarış"
          meta="Sandık verisi · sıralama 2,2 sn'de bir güncellenir"
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <PresidentRace />
          <SecondRoundGauge />
        </div>
      </section>

      <section className="site-container pb-4">
        <SectionHeader
          kicker="81 İl · Coğrafi dağılım"
          title="Türkiye haritası"
          meta="İlin üzerine gelin · lider parti, fark ve sayım yüzdesi"
          cta={{ to: "/harita", label: "Detaylı harita" }}
        />
      </section>
      <section>
        <TurkeyMap className="h-[640px] border-y border-gray-200 bg-gray-50" />
      </section>

      <section className="site-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeader
              kicker="Milletvekili · 600 sandalye"
              title="Meclis dağılımı"
              meta="7 parti · koalisyon eşiği 301 sandalye"
              cta={{ to: "/milletvekili", label: "Tüm sandalyeler" }}
            />
            <Parliament />
          </div>
          <div>
            <SectionHeader
              kicker="Canlı"
              title="Akış"
              meta="Son dakika gelişmeleri"
            />
            <LiveFeed />
          </div>
        </div>
      </section>

      <section className="site-container pb-16">
        <SectionHeader
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
