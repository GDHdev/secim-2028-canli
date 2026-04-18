import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PROVINCES, REGIONS, CANDIDATES } from "@/lib/mock-data";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/sonuclar")({
  head: () => ({
    meta: [
      { title: "Sonuçlar Tablosu | Seçim 2028" },
      { name: "description", content: "81 il için sıralanabilir, filtrelenebilir Cumhurbaşkanlığı seçim sonuçları tablosu." },
      { property: "og:title", content: "Sonuçlar Tablosu | Seçim 2028" },
      { property: "og:description", content: "81 il için sıralanabilir, filtrelenebilir seçim sonuçları." },
    ],
  }),
  component: SonuclarPage,
});

type SortKey = "name" | "yilmaz" | "kaya" | "demir" | "counted" | "turnout";

function SonuclarPage() {
  const [region, setRegion] = useState<string>("Tümü");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let list = PROVINCES;
    if (region !== "Tümü") list = list.filter((p) => p.region === region);
    if (q) list = list.filter((p) => p.name.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")));
    list = [...list].sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      switch (sortKey) {
        case "name": av = a.name; bv = b.name; break;
        case "yilmaz": av = a.results.yilmaz; bv = b.results.yilmaz; break;
        case "kaya": av = a.results.kaya; bv = b.results.kaya; break;
        case "demir": av = a.results.demir; bv = b.results.demir; break;
        case "counted": av = a.counted; bv = b.counted; break;
        case "turnout": av = a.turnout; bv = b.turnout; break;
      }
      const cmp = typeof av === "string" ? av.localeCompare(bv as string, "tr") : (av as number) - (bv as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [region, q, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir(k === "name" ? "asc" : "desc"); }
  };

  const candColor = (id: "yilmaz" | "kaya" | "demir") => CANDIDATES.find((c) => c.id === id)!.color;

  return (
    <div className="bg-background">
      {/* Header band */}
      <section className="border-b border-border px-4 pt-10 pb-6 md:px-8 lg:px-12">
        <span className="eyebrow-accent">81 İl · Cumhurbaşkanlığı 1. Tur</span>
        <h1 className="display-xl mt-2 text-foreground">SONUÇLAR TABLOSU</h1>
        <p className="mt-2 max-w-2xl font-serif text-base text-muted-foreground">
          Sıralayın, filtreleyin, illere göre gezinin. Lider hücreler renklendirilmiştir.
        </p>
      </section>

      {/* Filter band */}
      <section className="sticky top-[136px] z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md md:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="İl ara..."
              className="w-full border border-border bg-surface-1 py-2 pl-9 pr-3 font-mono text-sm text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {(["Tümü", ...REGIONS] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  region === r
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface-1 text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {filtered.length} il
          </span>
        </div>
      </section>

      {/* Table */}
      <section className="px-4 py-6 md:px-8 lg:px-12">
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-1">
              <tr className="text-left">
                <Th label="İL" k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <th className="px-3 py-3 text-left font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">BÖLGE</th>
                <Th label="YILMAZ" k="yilmaz" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                <Th label="KAYA" k="kaya" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                <Th label="DEMİR" k="demir" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                <Th label="SAYIM" k="counted" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                <Th label="KATILIM" k="turnout" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const leaderColor = candColor(p.leader);
                return (
                  <tr key={p.id} className="border-b border-border/40 transition-colors hover:bg-surface-1">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-1" style={{ backgroundColor: leaderColor }} />
                        <span className="font-mono text-sm font-semibold text-foreground">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{p.region}</td>
                    <Cell value={p.results.yilmaz} highlight={p.leader === "yilmaz"} color={candColor("yilmaz")} />
                    <Cell value={p.results.kaya} highlight={p.leader === "kaya"} color={candColor("kaya")} />
                    <Cell value={p.results.demir} highlight={p.leader === "demir"} color={candColor("demir")} />
                    <td className="px-3 py-2.5 text-right tabular-nums font-mono text-xs">%{p.counted}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-mono text-xs text-accent">%{p.turnout}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Th({ label, k, sortKey, sortDir, onSort, align = "left" }: {
  label: string; k: SortKey; sortKey: SortKey; sortDir: "asc" | "desc"; onSort: (k: SortKey) => void; align?: "left" | "right";
}) {
  const active = sortKey === k;
  return (
    <th className={`px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${active ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
        {active && (sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
      </button>
    </th>
  );
}

function Cell({ value, highlight, color }: { value: number; highlight: boolean; color: string }) {
  return (
    <td className="px-3 py-2.5 text-right">
      <span
        className={`inline-block min-w-[52px] px-2 py-0.5 tabular-nums font-mono text-xs ${highlight ? "font-bold" : "text-muted-foreground"}`}
        style={highlight ? { backgroundColor: color, color: "#0A0E1A" } : {}}
      >
        %{value}
      </span>
    </td>
  );
}
