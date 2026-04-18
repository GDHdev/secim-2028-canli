import { createFileRoute } from "@tanstack/react-router";
import { POLLS, POLL_FIRMS, CANDIDATES } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/anketler")({
  head: () => ({
    meta: [
      { title: "Anketler Tarihçesi | Seçim 2028" },
      { name: "description", content: "Son 18 ayın seçim anketleri, adayların oy oranlarındaki değişim ve kararsız seçmen oranı." },
      { property: "og:title", content: "Anketler Tarihçesi | Seçim 2028" },
      { property: "og:description", content: "18 aylık anket trend grafiği ve son anket şirketleri tablosu." },
    ],
  }),
  component: AnketlerPage,
});

function AnketlerPage() {
  const yilmaz = CANDIDATES.find((c) => c.id === "yilmaz")!;
  const kaya = CANDIDATES.find((c) => c.id === "kaya")!;
  const demir = CANDIDATES.find((c) => c.id === "demir")!;

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12">
      <div className="mb-6">
        <h1 className="font-display text-4xl tracking-wider text-foreground">ANKETLER TARİHÇESİ</h1>
        <p className="font-mono text-xs text-muted-foreground">EKİM 2026 — MART 2028 · 18 AY</p>
      </div>

      {/* Trend chart */}
      <div className="rounded-sm border border-border bg-surface-1 p-4">
        <h2 className="mb-4 font-display text-lg tracking-wider text-foreground">OY ORANI TRENDİ</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={POLLS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grid)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={[10, 50]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="yilmaz" name="Yılmaz" stroke={yilmaz.color} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="kaya" name="Kaya" stroke={kaya.color} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="demir" name="Demir" stroke={demir.color} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="undecided" name="Kararsız" stroke="var(--color-muted-foreground)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest polls table */}
      <div className="mt-6 rounded-sm border border-border bg-surface-1">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-lg tracking-wider text-foreground">SON ANKETLER</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2">
              <tr className="text-left font-mono text-xs text-muted-foreground">
                <th className="px-4 py-2">ŞİRKET</th>
                <th className="px-4 py-2">TARİH</th>
                <th className="px-4 py-2 text-right">YILMAZ</th>
                <th className="px-4 py-2 text-right">KAYA</th>
                <th className="px-4 py-2 text-right">DEMİR</th>
                <th className="px-4 py-2 text-right">KARARSIZ</th>
              </tr>
            </thead>
            <tbody>
              {POLL_FIRMS.map((p) => (
                <tr key={p.firm + p.date} className="border-b border-border/40 hover:bg-surface-2">
                  <td className="px-4 py-2 font-medium text-foreground">{p.firm}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-2 text-right font-mono" style={{ color: yilmaz.color }}>%{p.yilmaz}</td>
                  <td className="px-4 py-2 text-right font-mono" style={{ color: kaya.color }}>%{p.kaya}</td>
                  <td className="px-4 py-2 text-right font-mono" style={{ color: demir.color }}>%{p.demir}</td>
                  <td className="px-4 py-2 text-right font-mono text-muted-foreground">%{p.undecided}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
