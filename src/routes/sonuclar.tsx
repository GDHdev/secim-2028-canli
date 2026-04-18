import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PROVINCES, REGIONS, CANDIDATES } from "@/lib/mock-data";
import { Search, Download, ChevronUp, ChevronDown } from "lucide-react";

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
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wider text-foreground">SONUÇLAR TABLOSU</h1>
          <p className="font-mono text-xs text-muted-foreground">81 İL · CUMHURBAŞKANLIĞI 1. TUR</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="İl ara..."
              className="rounded-sm border border-border bg-surface-1 py-1.5 pl-8 pr-3 text-sm placeholder-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-sm border border-border bg-surface-1 px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
          >
            <option>Tümü</option>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button
            onClick={() => alert("Görsel olarak dışa aktarma özelliği demo'dur.")}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-1 px-3 py-1.5 text-sm text-foreground hover:bg-surface-2"
          >
            <Download size={14} /> PNG
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-surface-1">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2">
            <tr className="text-left">
              <Th label="İL" k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <th className="px-3 py-2 text-left font-mono text-xs text-muted-foreground">BÖLGE</th>
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
                <tr key={p.id} className="border-b border-border/40 hover:bg-surface-2">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: leaderColor }} />
                      <span className="font-medium text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{p.region}</td>
                  <Cell value={p.results.yilmaz} highlight={p.leader === "yilmaz"} color="cand-yilmaz" />
                  <Cell value={p.results.kaya} highlight={p.leader === "kaya"} color="cand-kaya" />
                  <Cell value={p.results.demir} highlight={p.leader === "demir"} color="cand-demir" />
                  <td className="px-3 py-2 text-right font-mono">%{p.counted}</td>
                  <td className="px-3 py-2 text-right font-mono text-accent">%{p.turnout}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 font-mono text-xs text-muted-foreground">{filtered.length} İL GÖSTERİLİYOR</p>
    </div>
  );
}

function Th({ label, k, sortKey, sortDir, onSort, align = "left" }: {
  label: string; k: SortKey; sortKey: SortKey; sortDir: "asc" | "desc"; onSort: (k: SortKey) => void; align?: "left" | "right";
}) {
  const active = sortKey === k;
  return (
    <th className={`px-3 py-2 font-mono text-xs text-muted-foreground ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 hover:text-foreground ${active ? "text-foreground" : ""}`}
      >
        {label}
        {active && (sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
      </button>
    </th>
  );
}

function Cell({ value, highlight, color }: { value: number; highlight: boolean; color: string }) {
  return (
    <td className="px-3 py-2 text-right">
      <span
        className={`inline-block min-w-[50px] rounded-sm px-2 py-0.5 font-mono ${highlight ? "font-semibold text-foreground" : "text-muted-foreground"}`}
        style={highlight ? { backgroundColor: `var(--color-${color})`, color: "white" } : {}}
      >
        %{value}
      </span>
    </td>
  );
}
