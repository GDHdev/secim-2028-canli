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
    <div className="site-container py-12 text-center">
      <h1 className="display-xl text-foreground">HABER BULUNAMADI</h1>
      <Link to="/haberler" className="mt-4 inline-block font-mono text-sm text-accent hover:underline">
        ← Tüm haberler
      </Link>
    </div>
  ),
});

function NewsArticle() {
  const { item } = Route.useLoaderData();
  return (
    <article className="bg-background">
      {/* Article header */}
      <header className="site-container border-b border-border pt-8 pb-10">
        <div className="mx-auto max-w-4xl">
          <Link to="/haberler" className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={12} /> Tüm haberler
          </Link>

          <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="bg-primary px-2 py-0.5 font-bold text-primary-foreground">{item.category}</span>
            <span className="text-muted-foreground">{item.source}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{item.time}</span>
          </div>

          <h1 className="font-serif mt-5 text-balance text-4xl font-bold leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
            {item.title}
          </h1>
        </div>
      </header>

      {/* Body */}
      <section className="site-container py-10">
        <div className="mx-auto max-w-3xl space-y-5 font-serif text-lg leading-relaxed text-foreground/90">
          {item.body.split(". ").filter(Boolean).map((p: string, i: number) => (
            <p key={i}>{p.trim()}{p.endsWith(".") ? "" : "."}</p>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-6">
          <Link to="/haberler" className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-accent hover:underline">
            ← Tüm haberlere dön
          </Link>
        </div>
      </section>
    </article>
  );
}
