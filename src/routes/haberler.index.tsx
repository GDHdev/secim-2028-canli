import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NEWS, type NewsCategory } from "@/lib/mock-data";

export const Route = createFileRoute("/haberler/")({
  head: () => ({
    meta: [
      { title: "Haberler | Seçim 2028" },
      { name: "description", content: "Seçim haberleri, sonuç bültenleri ve uzman analizleri." },
      { property: "og:title", content: "Haberler | Seçim 2028" },
      { property: "og:description", content: "Seçim haberleri ve analizleri." },
    ],
  }),
  component: HaberlerPage,
});

const CATEGORIES: ("Tümü" | NewsCategory)[] = ["Tümü", "Seçim", "Sonuçlar", "Analiz"];

function HaberlerPage() {
  const [cat, setCat] = useState<"Tümü" | NewsCategory>("Tümü");
  const items = cat === "Tümü" ? NEWS : NEWS.filter((n) => n.category === cat);
  const [lead, ...rest] = items;

  return (
    <div className="bg-background">
      <section className="site-container border-b border-border pt-10 pb-6">
        <span className="eyebrow-accent">Newsroom · Canlı</span>
        <h1 className="display-xl mt-2 text-foreground">HABERLER</h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{items.length} HABER · {cat}</p>
      </section>

      <section className="site-container border-b border-border bg-surface-1 py-3">
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                cat === c
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="site-container py-8">
        {lead && (
          <Link
            to="/haberler/$id"
            params={{ id: lead.id }}
            className="group mb-8 block border border-border bg-card p-6 transition-colors hover:border-accent md:p-10"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
              <span className="bg-primary px-2 py-0.5 font-bold text-primary-foreground">{lead.category}</span>
              <span className="text-muted-foreground">{lead.source}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{lead.time}</span>
            </div>
            <h2 className="font-serif mt-4 max-w-4xl text-balance text-4xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent md:text-5xl lg:text-6xl">
              {lead.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{lead.body}</p>
          </Link>
        )}

        <div className="grid grid-cols-1 gap-0 divide-y divide-border border border-border md:grid-cols-2 md:divide-x lg:grid-cols-3">
          {rest.map((n, i) => (
            <Link
              key={n.id}
              to="/haberler/$id"
              params={{ id: n.id }}
              className={`group block bg-card p-5 transition-colors hover:bg-surface-2 ${i >= 2 ? "md:border-t md:border-border" : ""}`}
            >
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <span className="text-primary">{n.category}</span>
                <span>·</span>
                <span>{n.time}</span>
                <span>·</span>
                <span>{n.source}</span>
              </div>
              <h3 className="font-serif mt-2 text-balance text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                {n.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
