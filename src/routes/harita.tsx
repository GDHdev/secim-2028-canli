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
  const [selectedId, setSelectedId] = useState<string | null>("istanbul");
  const selected = selectedId ? PROVINCES.find((p) => p.id === selectedId) ?? null : null;

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

      <section className="site-container py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <div className="uui-card overflow-hidden">
            <div className="relative h-[560px] bg-gray-50">
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

          <aside className="uui-card p-5">
            {selected ? (
              <ProvincePanelBody province={selected} />
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                <span className="uui-feat-icon uui-feat-icon-gray">
                  <MapPin size={20} />
                </span>
                <p className="mt-3 font-display text-lg font-semibold text-gray-900">İl seçin</p>
                <p className="mt-1 max-w-[260px] text-[14px] text-gray-500">
                  Detaylı sonuçları görmek için haritadan bir il seçin.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
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
