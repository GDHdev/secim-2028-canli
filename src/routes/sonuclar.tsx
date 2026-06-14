import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PROVINCES, REGIONS, CANDIDATES, province2023 } from "@/lib/mock-data";
import { Search, ChevronUp, ChevronDown, Table2, ArrowRight, Minus } from "lucide-react";
import { PageHero } from "@/components/PageHero";

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
      <PageHero
        icon={Table2}
        tone="brand"
        kicker="81 il · Cumhurbaşkanlığı 1. tur"
        title="Sonuçlar tablosu"
        description="Sıralayın, filtreleyin, illere göre gezinin. Lider hücreler renklendirilmiştir."
        actions={<span className="uui-badge uui-badge-gray">{filtered.length} il</span>}
      />

      <section className="sticky top-[72px] z-10 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="site-container py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-xs flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="İl ara..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-[14px] text-gray-900 placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["Tümü", ...REGIONS] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    region === r
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-8">
        <div className="uui-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200 text-left">
                  <Th label="İl" k="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  <th className="px-3 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-gray-500">Bölge</th>
                  <Th label="Yılmaz" k="yilmaz" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                  <Th label="Kaya" k="kaya" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                  <Th label="Demir" k="demir" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                  <Th label="Sayım" k="counted" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                  <Th label="Katılım" k="turnout" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                  <th className="px-3 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-gray-500">2023 · Değişim</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const leaderColor = candColor(p.leader);
                  const prev = province2023(p);
                  const flipped = prev.leader !== p.leader;
                  const prevLeaderC = CANDIDATES.find((c) => c.id === prev.leader)!;
                  const currLeaderC = CANDIDATES.find((c) => c.id === p.leader)!;
                  const shift = +(p.results[p.leader] - prev[p.leader]).toFixed(1);
                  return (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-4 w-1 rounded-full" style={{ backgroundColor: leaderColor }} />
                          <span className="font-semibold text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500">{p.region}</td>
                      <Cell value={p.results.yilmaz} highlight={p.leader === "yilmaz"} color={candColor("yilmaz")} />
                      <Cell value={p.results.kaya} highlight={p.leader === "kaya"} color={candColor("kaya")} />
                      <Cell value={p.results.demir} highlight={p.leader === "demir"} color={candColor("demir")} />
                      <td className="px-3 py-3 text-right tabular-nums text-gray-700">%{p.counted}</td>
                      <td className="px-3 py-3 text-right tabular-nums font-semibold text-indigo-600">%{p.turnout}</td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-[12px]">
                          {flipped ? (
                            <span className="inline-flex items-center gap-1">
                              <span
                                className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                                style={{ backgroundColor: prevLeaderC.color }}
                                title="2023 lideri"
                              >
                                {prevLeaderC.name.split(" ").slice(-1)[0]}
                              </span>
                              <ArrowRight size={11} className="text-gray-400" />
                              <span
                                className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                                style={{ backgroundColor: currLeaderC.color }}
                                title="2028 lideri"
                              >
                                {currLeaderC.name.split(" ").slice(-1)[0]}
                              </span>
                            </span>
                          ) : (
                            <span className="text-gray-500" title="2023 lideri ile aynı">
                              {prevLeaderC.name.split(" ").slice(-1)[0]} korudu
                            </span>
                          )}
                          <span
                            className={`ml-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                              shift > 0.05
                                ? "bg-success-50 text-success-700"
                                : shift < -0.05
                                  ? "bg-error-50 text-error-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {Math.abs(shift) < 0.05 ? <Minus size={10} /> : null}
                            {Math.abs(shift) < 0.05 ? "0" : `${shift > 0 ? "+" : ""}${shift}`}
                            <span className="text-[10px] opacity-70">pt</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
    <th className={`px-3 py-3 text-[12px] font-semibold uppercase tracking-wide ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 transition-colors hover:text-gray-900 ${active ? "text-gray-900" : "text-gray-500"}`}
      >
        {label}
        {active && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
    </th>
  );
}

function Cell({ value, highlight, color }: { value: number; highlight: boolean; color: string }) {
  return (
    <td className="px-3 py-3 text-right">
      <span
        className={`inline-block min-w-[56px] rounded-md px-2 py-0.5 tabular-nums ${highlight ? "font-bold text-white" : "text-gray-500"}`}
        style={highlight ? { backgroundColor: color } : {}}
      >
        %{value}
      </span>
    </td>
  );
}
