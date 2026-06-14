import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NEWS } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/haberler/$id")({
  loader: ({ params }) => {
    const item = NEWS.find((n) => n.id === params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.title} | Seçim 2028` },
          { name: "description", content: loaderData.item.body.slice(0, 160) },
          { property: "og:title", content: loaderData.item.title },
          { property: "og:description", content: loaderData.item.body.slice(0, 160) },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Haber bulunamadı | Seçim 2028" }],
  }),
  component: NewsArticle,
  notFoundComponent: () => (
    <div className="site-container py-16 text-center">
      <h1 className="uui-sec-title">Haber bulunamadı</h1>
      <Link to="/haberler" className="mt-6 inline-flex uui-btn uui-btn-secondary">
        <ArrowLeft size={16} /> Tüm haberler
      </Link>
    </div>
  ),
});

function NewsArticle() {
  const { item } = Route.useLoaderData();
  return (
    <article className="bg-background">
      <header className="border-b border-gray-200 bg-white">
        <div className="site-container py-8 md:py-10">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/haberler"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 transition-colors hover:text-gray-900"
            >
              <ArrowLeft size={14} /> Tüm haberler
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="uui-badge uui-badge-brand">{item.category}</span>
              <span className="text-[13px] text-gray-500">{item.source} · {item.time}</span>
            </div>

            <h1 className="font-display mt-4 text-balance text-[32px] font-bold leading-[1.1] tracking-tight text-gray-900 md:text-[44px] lg:text-[52px]">
              {item.title}
            </h1>
          </div>
        </div>
      </header>

      <section className="site-container py-10">
        <div className="mx-auto max-w-3xl space-y-4 text-[17px] leading-relaxed text-gray-700">
          {item.body.split(". ").filter(Boolean).map((p: string, i: number) => (
            <p key={i}>{p.trim()}{p.endsWith(".") ? "" : "."}</p>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl border-t border-gray-200 pt-6">
          <Link to="/haberler" className="uui-btn uui-btn-secondary">
            <ArrowLeft size={16} /> Tüm haberlere dön
          </Link>
        </div>
      </section>
    </article>
  );
}
