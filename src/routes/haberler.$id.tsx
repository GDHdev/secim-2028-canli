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
    <div className="mx-auto max-w-3xl px-6 py-12 text-center">
      <h1 className="font-display text-4xl text-foreground">HABER BULUNAMADI</h1>
      <Link to="/haberler" className="mt-4 inline-block font-mono text-sm text-accent hover:underline">
        ← Tüm haberler
      </Link>
    </div>
  ),
});

function NewsArticle() {
  const { item } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Link to="/haberler" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft size={12} /> Tüm haberler
      </Link>

      <div className="mt-6 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
        <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-primary">{item.category.toUpperCase()}</span>
        <span>{item.source}</span>
        <span>·</span>
        <span>{item.time}</span>
      </div>

      <h1 className="mt-3 text-balance font-display text-4xl tracking-wide text-foreground md:text-5xl">
        {item.title}
      </h1>

      <div className="mt-6 space-y-4 leading-relaxed text-foreground/90">
        {item.body.split(". ").filter(Boolean).map((p, i) => (
          <p key={i} className="text-base">{p.trim()}{p.endsWith(".") ? "" : "."}</p>
        ))}
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Link to="/haberler" className="font-mono text-xs text-accent hover:underline">
          ← Tüm haberlere dön
        </Link>
      </div>
    </article>
  );
}
