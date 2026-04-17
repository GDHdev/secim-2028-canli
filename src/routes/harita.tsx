import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TurkeyMap } from "@/components/TurkeyMap";

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
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wider text-foreground">TÜRKİYE HARİTASI</h1>
          <p className="font-mono text-xs text-muted-foreground">SONUÇLAR GÜNCELLENİYOR...</p>
        </div>
        <div className="flex rounded-sm border border-border bg-surface-1 p-0.5">
          <button
            onClick={() => setMode("baskan")}
            className={`px-3 py-1.5 font-display text-sm tracking-wider transition-colors ${mode === "baskan" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            CUMHURBAŞKANLIĞI
          </button>
          <button
            onClick={() => setMode("vekil")}
            className={`px-3 py-1.5 font-display text-sm tracking-wider transition-colors ${mode === "vekil" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            MİLLETVEKİLİ
          </button>
        </div>
      </div>

      <TurkeyMap />

      <div className="mt-4 flex items-center justify-between rounded-sm border border-border bg-surface-1 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono">SONUÇLAR HER 30 SANİYEDE GÜNCELLENİYOR</span>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">SON GÜNCELLEME: 22:18:42</div>
      </div>
    </div>
  );
}
