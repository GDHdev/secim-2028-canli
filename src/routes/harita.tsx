import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TurkeyMap, ProvincePanelBody } from "@/components/TurkeyMap";
import { PROVINCES, CANDIDATES } from "@/lib/mock-data";

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
    // Fill the viewport below the sticky TopBar (~136px tall: status+nav+ticker)
    <div className="flex h-[calc(100vh-136px)] flex-col">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-display text-2xl tracking-wider text-foreground md:text-3xl">
              TÜRKİYE HARİTASI
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              <span className="live-pulse mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
              SONUÇLAR GÜNCELLENİYOR · 22:18:42
            </p>
          </div>
          <Legend />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-sm border border-border bg-surface-1 p-0.5">
            <button
              onClick={() => setMode("baskan")}
              className={`px-3 py-1.5 font-display text-sm tracking-wider transition-colors ${
                mode === "baskan"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CUMHURBAŞKANLIĞI
            </button>
            <button
              onClick={() => setMode("vekil")}
              className={`px-3 py-1.5 font-display text-sm tracking-wider transition-colors ${
                mode === "vekil"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              MİLLETVEKİLİ
            </button>
          </div>
        </div>
      </div>

      {/* Split layout: map fills, panel persistent on right */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* Map column — fills available height */}
        <div className="relative min-h-0 bg-surface-1">
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

        {/* Persistent side panel */}
        <aside className="overflow-y-auto border-t border-border bg-card p-5 lg:border-l lg:border-t-0">
          {selected ? (
            <ProvincePanelBody province={selected} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl tracking-wider text-muted-foreground">
                BİR İL SEÇİN
              </p>
              <p className="mt-2 max-w-[260px] font-mono text-xs text-muted-foreground">
                Detaylı sonuçları, ilçe dağılımını ve katılım karşılaştırmasını görmek için haritadan il seçin.
              </p>
            </div>
          )}
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
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: c.color }}
          />
          <span className="font-mono text-[10px] text-muted-foreground">
            {c.name.split(" ")[1].toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}
