import { createFileRoute, Link } from "@tanstack/react-router";
import { ElectionSummary } from "@/components/ElectionSummary";
import { PresidentRace } from "@/components/PresidentRace";
import { SecondRoundGauge } from "@/components/SecondRoundGauge";
import { Parliament } from "@/components/Parliament";
import { TurkeyMap } from "@/components/TurkeyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { MicroNews } from "@/components/MicroNews";
import { ElectionCompare } from "@/components/ElectionCompare";
import { AllianceBlocs } from "@/components/AllianceBlocs";
import { DiasporaCard } from "@/components/DiasporaCard";
import { HourlyTurnout } from "@/components/HourlyTurnout";
import { BallotTransparency } from "@/components/BallotTransparency";
import { ShareBar } from "@/components/ShareBar";
import { GUIDES } from "@/lib/guides";
import { POLLS, POLL_FIRMS, CANDIDATES } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, Users, Map, Landmark, Radio, Newspaper, BarChart3, History, BookOpen, Clock, TrendingUp, Plane, Clock3, ShieldCheck, Handshake } from "lucide-react";

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
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <SectionHeader
              icon={Users}
              tone="brand"
              kicker="Cumhurbaşkanlığı · 1. Tur"
              title="Adaylar arası yarış"
              meta="Sandık verisi her 2 saniyede bir güncellenir. Aday kartına tıklayın, detaylı il bazlı analizi açın."
            />
          </div>
          <div className="shrink-0">
            <ShareBar />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <PresidentRace />
          <SecondRoundGauge />
        </div>
      </section>

      {/* Sandık şeffaflığı */}
      <section className="site-container pb-10 md:pb-14">
        <SectionHeader
          icon={ShieldCheck}
          tone="gray"
          kicker="YSK · Şeffaflık"
          title="Sandık güvenliği ve sayım"
          meta="Açılan sandık, dijital tutanak akışı, geçersiz oy ve itiraz sayıları — anlık güncellenir."
        />
        <BallotTransparency />
      </section>

      {/* 2023 vs 2028 karşılaştırması */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="site-container">
          <SectionHeader
            icon={History}
            tone="gray"
            kicker="Bir önceki seçim · 2023"
            title="Geçen seçimde ne olmuştu?"
            meta="2023 ve 2028 sonuçlarını yan yana koyarak hangi adayın yükseldiğini, hangi illerin el değiştirdiğini ve katılımın nasıl değiştiğini gösteriyoruz."
            cta={{ to: "/sonuclar", label: "Tüm il karşılaştırması" }}
          />
          <ElectionCompare />
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
            meta="Bir ile tıklayın, sandık ve ilçe bazlı detay sayfasına gidin. 2023 ile karşılaştırma dahil."
            cta={{ to: "/harita", label: "Detaylı harita" }}
          />
        </div>
        <TurkeyMap className="h-[560px] bg-white border-y border-gray-200" />
      </section>

      {/* Saatlik katılım + Yurt dışı oyları */}
      <section className="site-container py-10 md:py-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <SectionHeader
              icon={Clock3}
              tone="success"
              kicker="Katılım eğrisi · 08:00–18:00"
              title="Sandığa gidiş saat saat"
              meta="2028 birikimli katılımı 2023 ile yan yana — öğleden sonra ivme korundu mu?"
            />
            <HourlyTurnout />
          </div>
          <div>
            <SectionHeader
              icon={Plane}
              tone="violet"
              kicker="Yurt dışı · 10 ülke + gümrük"
              title="Diaspora ne dedi?"
              meta="3.4 milyon kayıtlı yurt dışı seçmen, 78 bin gümrük oyu — Almanya'da Yılmaz, Londra'da Kaya."
            />
            <DiasporaCard />
          </div>
        </div>
      </section>

      {/* Meclis + İttifak + Akış */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="site-container">
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
              icon={Handshake}
              tone="indigo"
              kicker="İttifak matematiği"
              title="Hangi blok çoğunluğu kurabilir?"
              meta="Türkiye'de meclis = ittifak. Her bloğun sandalyesi, çoğunluğa farkı ve olası koalisyon senaryosu."
            />
            <AllianceBlocs />
          </div>

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
        </div>
      </section>

      {/* Anket trendi + Rehber */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeader
                icon={TrendingUp}
                tone="indigo"
                kicker="Anket şirketleri · 18 ay"
                title="Adayların oy oranı nasıl değişti?"
                meta="10 büyük anket şirketinin aylık ortalamaları. Yılmaz'ın yükselişi ve Kaya'nın stabil seyri net görünüyor."
                cta={{ to: "/anketler", label: "Tüm anketler" }}
              />
              <PollTrendCard />
            </div>

            <div>
              <SectionHeader
                icon={BookOpen}
                tone="indigo"
                kicker="Seçmen rehberi · 8 konu"
                title="Sandığa hazır mısın?"
                meta="Kimlik, takvim, yurt dışı oy, engelli seçmen hakları ve itiraz süreci."
                cta={{ to: "/rehber", label: "Tüm rehber" }}
              />
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {GUIDES.slice(0, 6).map((g) => {
                  const Icon = g.icon;
                  const toneClass = {
                    brand: "",
                    indigo: "uui-feat-icon-indigo",
                    violet: "uui-feat-icon-violet",
                    warning: "uui-feat-icon-warning",
                    success: "uui-feat-icon-success",
                    gray: "uui-feat-icon-gray",
                  }[g.tone];
                  return (
                    <li key={g.slug}>
                      <Link
                        to="/rehber/$slug"
                        params={{ slug: g.slug }}
                        className="uui-card uui-card-hover group flex h-full items-start gap-3 p-3.5"
                      >
                        <span className={`uui-feat-icon ${toneClass}`}>
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[14.5px] font-semibold leading-tight text-gray-900 group-hover:text-brand-700">
                            {g.title}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-gray-500">
                            <Clock size={11} /> {g.readMinutes} dk
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
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

function PollTrendCard() {
  const yilmaz = CANDIDATES.find((c) => c.id === "yilmaz")!;
  const kaya = CANDIDATES.find((c) => c.id === "kaya")!;
  const demir = CANDIDATES.find((c) => c.id === "demir")!;
  const latest = POLL_FIRMS[0];
  const candidates = [
    { name: "Yılmaz", value: latest.yilmaz, color: yilmaz.color, key: "yilmaz" as const },
    { name: "Kaya", value: latest.kaya, color: kaya.color, key: "kaya" as const },
    { name: "Demir", value: latest.demir, color: demir.color, key: "demir" as const },
  ];
  return (
    <div className="uui-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-4">
          {candidates.map((c) => (
            <div key={c.key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
              <span className="text-[12.5px] font-semibold text-gray-700">{c.name}</span>
              <span className="tabular-nums text-[12.5px] font-bold" style={{ color: c.color }}>%{c.value}</span>
            </div>
          ))}
        </div>
        <span className="text-[11.5px] text-gray-500">
          Son: <strong className="text-gray-700">{latest.firm}</strong> · {latest.date}
        </span>
      </div>
      <div className="h-[260px] w-full p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={POLLS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="var(--color-gray-200)" />
            <XAxis dataKey="date" stroke="var(--color-gray-500)" fontSize={11} />
            <YAxis stroke="var(--color-gray-500)" fontSize={11} domain={[10, 50]} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid var(--color-gray-200)",
                borderRadius: "10px",
                fontSize: "12.5px",
                boxShadow: "var(--shadow-md)",
              }}
            />
            <Line type="monotone" dataKey="yilmaz" name="Yılmaz" stroke={yilmaz.color} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="kaya" name="Kaya" stroke={kaya.color} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="demir" name="Demir" stroke={demir.color} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="undecided" name="Kararsız" stroke="var(--color-gray-400)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
