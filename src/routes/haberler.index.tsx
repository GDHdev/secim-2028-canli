import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NEWS, type NewsCategory } from "@/lib/mock-data";
import { Newspaper, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";

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
      <PageHero
        icon={Newspaper}
        tone="violet"
        kicker="Newsroom · Canlı"
        title="Haberler"
        description="Son 24 saatin öne çıkan başlıkları, kaynak ve kategori etiketleriyle."
        actions={<span className="uui-badge uui-badge-gray">{items.length} haber · {cat}</span>}
      />

      <section className="site-container py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                cat === c
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {lead && (
          <Link
            to="/haberler/$id"
            params={{ id: lead.id }}
            className="uui-card uui-card-hover group mb-8 block p-6 md:p-10"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="uui-badge uui-badge-brand">{lead.category}</span>
              <span className="text-[13px] text-gray-500">{lead.source} · {lead.time}</span>
            </div>
            <h2 className="font-display mt-4 max-w-4xl text-balance text-[28px] font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-brand-600 md:text-[40px] lg:text-[48px]">
              {lead.title}
            </h2>
            <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-gray-600">{lead.body}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-600">
              Devamını oku <ArrowRight size={14} />
            </span>
          </Link>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <Link
              key={n.id}
              to="/haberler/$id"
              params={{ id: n.id }}
              className="uui-card uui-card-hover group block p-5"
            >
              <div className="flex items-center gap-2">
                <span className="uui-badge uui-badge-violet">{n.category}</span>
                <span className="text-[12px] text-gray-500">{n.time} · {n.source}</span>
              </div>
              <h3 className="font-display mt-3 text-balance text-[18px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-brand-600">
                {n.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
