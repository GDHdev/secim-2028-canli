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

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12">
      <div className="mb-4">
        <h1 className="font-display text-4xl tracking-wider text-foreground">HABERLER</h1>
        <p className="font-mono text-xs text-muted-foreground">{items.length} HABER</p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-sm border px-3 py-1.5 font-display text-sm tracking-wider transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-1 text-muted-foreground hover:text-foreground"}`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border rounded-sm border border-border bg-surface-1">
        {items.map((n) => (
          <Link
            key={n.id}
            to="/haberler/$id"
            params={{ id: n.id }}
            className="block px-4 py-3 transition-colors hover:bg-surface-2"
          >
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-primary">{n.category.toUpperCase()}</span>
              <span>{n.source}</span>
              <span>·</span>
              <span>{n.time}</span>
            </div>
            <h2 className="mt-1 text-balance font-medium text-foreground">{n.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
