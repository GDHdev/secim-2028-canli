import { createFileRoute } from "@tanstack/react-router";
import { Vote, Sparkles } from "lucide-react";
import { PageHero, SubSectionHeader } from "@/components/PageHero";
import { SitePoll } from "@/components/SitePoll";
import { SITE_POLLS } from "@/lib/site-polls";

export const Route = createFileRoute("/oylama")({
  head: () => ({
    meta: [
      { title: "Site Anketi · Sen ne diyorsun? | Seçim 2028" },
      { name: "description", content: "2. tur tahmini, koalisyon tercihi, seçmen gündemi ve katılım niyeti üzerine site içi okur anketleri." },
      { property: "og:title", content: "Site Anketi | Seçim 2028" },
      { property: "og:description", content: "Okurlarımızın 2028 seçimi hakkında ne düşündüğünü 4 soruda görün, siz de oy verin." },
    ],
  }),
  component: OylamaPage,
});

function OylamaPage() {
  return (
    <div className="bg-background">
      <PageHero
        icon={Vote}
        tone="violet"
        kicker="Site anketi · Okur oylaması"
        title="Sen ne diyorsun?"
        description="Anket şirketlerinin kamuoyu araştırmalarından ayrı olarak, Seçim 2028 okurlarının nabzını tutuyoruz. 4 soruda görüşünüzü paylaşın, sonuçlar anında güncellensin."
        actions={
          <span className="uui-badge uui-badge-violet inline-flex items-center gap-1">
            <Sparkles size={12} /> Anonim · Cihaz başına 1 oy
          </span>
        }
      />

      <section className="site-container py-10 md:py-12">
        <SubSectionHeader
          icon={Vote}
          tone="violet"
          kicker={`${SITE_POLLS.length} soru`}
          title="Bugünün anketleri"
          meta="Her sorudan sonra dağılımı anında görürsünüz. Sonuçlar bilimsel bir araştırma değildir."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SITE_POLLS.map((p) => (
            <SitePoll key={p.id} id={p.id} question={p.question} kicker={p.kicker} options={p.options} />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="site-container">
          <div className="uui-card p-5 md:p-6">
            <p className="uui-sec-eyebrow">Metodoloji</p>
            <h3 className="mt-1 font-display text-[18px] font-bold tracking-tight text-gray-900">
              Site anketleri nasıl çalışır?
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600 max-w-3xl">
              Cevaplar tarayıcınızda anonim olarak saklanır; kimlik bilgisi toplamayız. Her cihaz her ankete bir kez oy
              verebilir. Bu sonuçlar <strong>temsili bir kamuoyu araştırması değildir</strong>; yalnızca
              sitemizi takip eden okur kitlesinin görüşünü yansıtır. Bilimsel anketler için
              {" "}<a href="/anketler" className="font-semibold text-brand-700 hover:underline">Anketler Tarihçesi</a>{" "}
              sayfasını inceleyin.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
