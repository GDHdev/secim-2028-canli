import { createFileRoute, Link } from "@tanstack/react-router";
import { ElectionSummary } from "@/components/ElectionSummary";
import { PresidentRace } from "@/components/PresidentRace";
import { SecondRoundGauge } from "@/components/SecondRoundGauge";
import { Parliament } from "@/components/Parliament";
import { TurkeyMap } from "@/components/TurkeyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { MicroNews } from "@/components/MicroNews";
import { ArrowRight, Users, Map, Landmark, Radio, Newspaper, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seçim 2028 — Cumhurbaşkanlığı & Milletvekili Canlı Sonuçları" },
      { name: "description", content: "14 Mart 2028 Türkiye Cumhurbaşkanlığı ve Milletvekili Seçimleri canlı sonuçları, harita, parlamento dağılımı, AI destekli özet." },
      { property: "og:title", content: "Seçim 2028 — Canlı Sonuçlar" },
      { property: "og:description", content: "Cumhurbaşkanlığı yarışı, 600 sandalye, 81 il sonuçları, AI asistan." },
    ],
  }),
  component: Index,
});

function SectionHeader({
  icon: Icon,
  kicker,
  title,
  meta,
  cta,
  tone = "brand",
}: {
  icon: typeof Users;
  kicker: string;
  title: string;
  meta?: string;
  cta?: { to: string; label: string };
  tone?: "brand" | "indigo" | "violet" | "warning" | "success" | "gray";
}) {
  const toneClass = {
    brand: "",
    indigo: "uui-feat-icon-indigo",
    violet: "uui-feat-icon-violet",
    warning: "uui-feat-icon-warning",
    success: "uui-feat-icon-success",
    gray: "uui-feat-icon-gray",
  }[tone];

  return (
    <div className="mb-6 md:mb-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span className={`uui-feat-icon ${toneClass}`}>
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <p className="uui-sec-eyebrow">{kicker}</p>
            <h2 className="mt-0.5 uui-sec-title">{title}</h2>
            {meta && <p className="mt-1.5 uui-sec-desc">{meta}</p>}
          </div>
        </div>
        {cta && (
          <Link to={cta.to} className="uui-btn uui-btn-secondary self-start sm:self-end">
            {cta.label}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="bg-background">
      <ElectionSummary />

      {/* Aday yarışı */}
      <section className="site-container py-10 md:py-14">
        <SectionHeader
          icon={Users}
          tone="brand"
          kicker="Cumhurbaşkanlığı · 1. Tur"
          title="Adaylar arası yarış"
          meta="Sandık verisi her 2 saniyede bir güncellenir. Aday kartına tıklayın, detaylı il bazlı analizi açın."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <PresidentRace />
          <SecondRoundGauge />
        </div>
      </section>

      {/* Harita */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="site-container">
          <SectionHeader
            icon={Map}
            tone="indigo"
            kicker="81 il · Coğrafi dağılım"
            title="Türkiye haritası"
            meta="Bir ilin üzerine gelin: lider parti, oy farkı, sayım yüzdesi ve katılım oranı görünür."
            cta={{ to: "/harita", label: "Detaylı harita" }}
          />
        </div>
        <TurkeyMap className="h-[560px] bg-white border-y border-gray-200" />
      </section>

      {/* Meclis + Akış */}
      <section className="site-container py-10 md:py-14">
        <SectionHeader
          icon={Landmark}
          tone="warning"
          kicker="Milletvekili · 600 sandalye"
          title="Meclis dağılımı"
          meta="7 parti yarışıyor. Çoğunluk için 301 sandalye gerekiyor; koalisyon senaryoları açılır."
          cta={{ to: "/milletvekili", label: "Tüm sandalyeler" }}
        />
        <Parliament />
        <div className="mt-10 md:mt-12">
          <SectionHeader
            icon={Radio}
            tone="success"
            kicker="Canlı akış"
            title="Anlık gelişmeler"
            meta="Editörlerin doğruladığı son dakika bildirimleri."
          />
          <LiveFeed />
        </div>
      </section>

      {/* Haberler */}
      <section className="bg-gray-50 border-t border-gray-200 py-10 md:py-14">
        <div className="site-container">
          <SectionHeader
            icon={Newspaper}
            tone="violet"
            kicker="Gündem"
            title="Son haberler"
            meta="Son 24 saatin öne çıkan başlıkları, kaynak ve kategori etiketleriyle."
            cta={{ to: "/haberler", label: "Tüm haberler" }}
          />
          <MicroNews limit={6} />
        </div>
      </section>

      {/* Ek navigasyon kartları */}
      <section className="site-container py-10 md:py-12">
        <SectionHeader
          icon={BarChart3}
          tone="gray"
          kicker="Daha fazla"
          title="Veri merkezi"
          meta="Anketleri karşılaştırın, 2. tur senaryolarını simüle edin."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard to="/anketler" tone="indigo" icon={BarChart3} title="Anket karşılaştırması" desc="10 anket şirketi · 18 ay trend" />
          <FeatureCard to="/tur2" tone="violet" icon={Users} title="2. tur simülatörü" desc="Olası tüm eşleşmeler" />
          <FeatureCard to="/harita" tone="brand" icon={Map} title="İl bazlı keşif" desc="81 il · katılım & farklar" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  to, tone, icon: Icon, title, desc,
}: {
  to: string;
  tone: "brand" | "indigo" | "violet";
  icon: typeof Users;
  title: string;
  desc: string;
}) {
  const toneClass = { brand: "", indigo: "uui-feat-icon-indigo", violet: "uui-feat-icon-violet" }[tone];
  return (
    <Link to={to} className="uui-card uui-card-hover group flex items-center gap-3 p-4">
      <span className={`uui-feat-icon ${toneClass}`}>
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[16px] font-semibold text-gray-900">{title}</p>
        <p className="text-[13px] text-gray-500">{desc}</p>
      </div>
      <ArrowRight size={16} className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-900" />
    </Link>
  );
}
