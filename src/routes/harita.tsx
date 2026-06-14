import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TurkeyMap, ProvincePanelBody } from "@/components/TurkeyMap";
import { PROVINCES, CANDIDATES } from "@/lib/mock-data";
import { Map as MapIcon, X } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/harita")({
  head: () => ({
    meta: [
      { title: "Harita | Seçim 2028" },
      { name: "description", content: "81 il bazında Cumhurbaşkanlığı ve Milletvekili seçim sonuçları haritası." },
      { property: "og:title", content: "Harita | Seçim 2028" },
      { property: "og:description", content: "81 il bazında interaktif Türkiye seçim haritası." },
    ],
  }),
  component: HaritaPage,
});

function HaritaPage() {
  const [mode, setMode] = useState<"baskan" | "vekil">("baskan");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? PROVINCES.find((p) => p.id === selectedId) ?? null : null;
  const open = !!selected;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex flex-col bg-background">
      <PageHero
        icon={MapIcon}
        tone="indigo"
        kicker="81 il · Coğrafi dağılım"
        title="Türkiye haritası"
        description="Bir ilin üzerine gelin: lider parti, oy farkı, sayım yüzdesi ve katılım oranı görünür."
        actions={
          <div className="flex items-center gap-3">
            <Legend />
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-xs">
              <button
                onClick={() => setMode("baskan")}
                className={`rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  mode === "baskan" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cumhurbaşkanı
              </button>
              <button
                onClick={() => setMode("vekil")}
                className={`rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  mode === "vekil" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Milletvekili
              </button>
            </div>
          </div>
        }
      />

      <section className="site-container py-6">
        <div className="uui-card overflow-hidden">
          <div className="relative h-[calc(100vh-260px)] min-h-[560px] bg-gray-50">
            <div className="absolute inset-0">
              <TurkeyMap
                embedded
                hideHeader
                mode={mode}
                selectedId={selectedId}
                onSelect={(p) => setSelectedId(p?.id ?? null)}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal/drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-full max-w-[440px] transform bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-gray-200 px-5">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">
              İl detayı
            </span>
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>
          <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-5">
            {selected && <ProvincePanelBody province={selected} />}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="hidden items-center gap-3 md:flex">
      {CANDIDATES.slice(0, 3).map((c) => (
        <div key={c.id} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
          <span className="text-[13px] font-semibold text-gray-700">{c.name.split(" ")[1]}</span>
        </div>
      ))}
    </div>
  );
}
