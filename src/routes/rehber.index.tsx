import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { GUIDES } from "@/lib/guides";

export const Route = createFileRoute("/rehber/")({
  head: () => ({
    meta: [
      { title: "Seçmen Rehberi | Seçim 2028" },
      { name: "description", content: "Oy nasıl kullanılır, hangi kimlikler geçerli, engelli seçmen hakları, yurt dışı oy, sandık kurulu ve seçim takvimi. Seçim 2028 için kapsamlı seçmen rehberi." },
      { property: "og:title", content: "Seçmen Rehberi | Seçim 2028" },
      { property: "og:description", content: "Sandığa gitmeden önce bilmeniz gereken her şey: kimlik, takvim, haklar, itiraz süreci ve SSS." },
    ],
  }),
  component: RehberPage,
});

function RehberPage() {
  return (
    <div className="bg-background">
      <PageHero
        icon={BookOpen}
        tone="indigo"
        kicker="Seçmen Rehberi · 8 başlık"
        title="Sandığa gitmeden önce bilmeniz gereken her şey"
        description="Resmi YSK kaynaklarına göre derlenmiş, sade dilde anlatım. Her konu 2–5 dakikada okunur, hızlı referans için listeler içerir."
        actions={<span className="uui-badge uui-badge-gray">{GUIDES.length} konu · Türkçe</span>}
      />

      <section className="site-container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => {
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
              <Link
                key={g.slug}
                to="/rehber/$slug"
                params={{ slug: g.slug }}
                className="uui-card uui-card-hover group flex flex-col gap-4 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`uui-feat-icon uui-feat-icon-lg ${toneClass}`}>
                    <Icon size={20} />
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-500">
                    <Clock size={12} /> {g.readMinutes} dk
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-[17px] font-bold tracking-tight text-gray-900 group-hover:text-brand-700">
                    {g.title}
                  </h2>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600 line-clamp-3">
                    {g.summary}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600">
                  Rehberi oku <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200 py-10 md:py-12">
        <div className="site-container">
          <div className="uui-card p-5 md:p-6">
            <p className="uui-sec-eyebrow">Hatırlatma</p>
            <h3 className="mt-1 font-display text-[20px] font-bold tracking-tight text-gray-900">
              Bu sayfadaki bilgiler bilgilendirme amaçlıdır
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600 max-w-3xl">
              Resmi takvim, kimlik kuralları ve itiraz süreleri için her zaman <strong>Yüksek Seçim Kurulu</strong> (YSK)
              duyurularını esas alın. Seçim 2028, YSK verilerini sade bir dilde özetlemek için tasarlanmıştır;
              hukuki danışmanlık vermez.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
