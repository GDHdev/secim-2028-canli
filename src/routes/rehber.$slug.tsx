import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, BookOpen, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { GUIDES, getGuide, type GuideSection } from "@/lib/guides";

export const Route = createFileRoute("/rehber/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    const g = loaderData?.guide;
    if (!g) return { meta: [{ title: "Rehber bulunamadı" }] };
    return {
      meta: [
        { title: `${g.title} | Seçmen Rehberi` },
        { name: "description", content: g.summary },
        { property: "og:title", content: `${g.title} | Seçim 2028 Rehberi` },
        { property: "og:description", content: g.summary },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="site-container py-20 text-center">
      <h1 className="font-display text-3xl font-bold text-gray-900">Rehber bulunamadı</h1>
      <Link to="/rehber" className="uui-btn uui-btn-secondary mt-6 inline-flex">
        <ArrowLeft size={16} /> Tüm rehberler
      </Link>
    </div>
  ),
  component: GuideDetail,
});

function GuideDetail() {
  const { guide } = Route.useLoaderData();
  const Icon = guide.icon;
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 4);

  return (
    <div className="bg-background">
      <PageHero
        icon={Icon}
        tone={guide.tone}
        kicker={`Seçmen Rehberi · ${guide.readMinutes} dk okuma`}
        title={guide.title}
        description={guide.summary}
        actions={
          <Link to="/rehber" className="uui-btn uui-btn-secondary">
            <ArrowLeft size={16} /> Tüm konular
          </Link>
        }
      />

      <section className="site-container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <article className="uui-card p-6 md:p-8">
            <div className="prose-content space-y-7">
              {guide.sections.map((s: GuideSection, i: number) => (
                <section key={i}>
                  <h2 className="font-display text-[20px] font-bold tracking-tight text-gray-900 md:text-[22px]">
                    {s.heading}
                  </h2>
                  <p className="mt-2 text-[15px] leading-[1.7] text-gray-700">{s.body}</p>
                  {s.bullets && (
                    <ul className="mt-3 space-y-1.5">
                      {s.bullets.map((b: string, j: number) => (
                        <li key={j} className="flex gap-2 text-[14.5px] leading-[1.6] text-gray-700">
                          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 border-t border-gray-100 pt-5 text-[13px] text-gray-500">
              <Clock size={13} /> Yaklaşık {guide.readMinutes} dakika · Kaynak: YSK & ilgili mevzuat
            </div>
          </article>

          <aside className="space-y-3">
            <div className="uui-card p-4">
              <p className="uui-sec-eyebrow flex items-center gap-1.5">
                <BookOpen size={12} /> Diğer konular
              </p>
              <ul className="mt-3 divide-y divide-gray-100">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link
                      to="/rehber/$slug"
                      params={{ slug: g.slug }}
                      className="group flex items-center gap-2 py-2.5 text-[14px] font-semibold text-gray-800 hover:text-brand-700"
                    >
                      <ChevronRight size={14} className="text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                      <span className="min-w-0 flex-1">{g.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
