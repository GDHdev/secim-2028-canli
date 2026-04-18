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
    <div className="flex h-[calc(100vh-148px)] flex-col bg-background">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-5">
          <div>
            <span className="eyebrow-accent">81 İl Haritası</span>
            <h1 className="display-lg mt-1 text-foreground">TÜRKİYE</h1>
          </div>
          <Legend />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-border bg-surface-1">
            <button
              onClick={() => setMode("baskan")}
              className={`px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                mode === "baskan"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cumhurbaşkanı
            </button>
            <button
              onClick={() => setMode("vekil")}
              className={`px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                mode === "vekil"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Milletvekili
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_400px]">
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

        <aside className="overflow-y-auto border-t border-border bg-card p-6 lg:border-l lg:border-t-0">
          {selected ? (
            <ProvincePanelBody province={selected} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="eyebrow">İl seçiniz</span>
              <p className="mt-2 max-w-[260px] font-mono text-xs text-muted-foreground">
                Detaylı sonuçları görmek için haritadan il seçin.
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
            className="inline-block h-3 w-3"
            style={{ backgroundColor: c.color }}
          />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
            {c.name.split(" ")[1]}
          </span>
        </div>
      ))}
    </div>
  );
}
