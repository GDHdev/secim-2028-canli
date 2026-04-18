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
    <div className="bg-background">
      <section className="site-container border-b border-border pt-10 pb-6">
        <span className="eyebrow-accent">Ekim 2026 — Mart 2028 · 18 Ay</span>
        <h1 className="display-xl mt-2 text-foreground">ANKETLER TARİHÇESİ</h1>
        <p className="mt-3 max-w-2xl font-serif text-base text-muted-foreground">
          Son 18 ayda yayımlanan tüm büyük anketleri tek grafikte birleştirdik.
          Yılmaz'ın yükselişi ve Kaya'nın stabil seyri net görülüyor.
        </p>
      </section>

      <section className="site-container py-8">
        <div className="panel p-4 md:p-6">
          <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
            <h2 className="display-lg text-foreground">OY ORANI TRENDİ</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {POLLS.length} aylık veri
            </span>
          </div>
          <div className="h-[460px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={POLLS} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--color-grid)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} fontFamily="IBM Plex Mono" />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} fontFamily="IBM Plex Mono" domain={[10, 50]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    fontSize: "12px",
                    fontFamily: "IBM Plex Mono",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "IBM Plex Mono", textTransform: "uppercase", letterSpacing: "0.14em" }} />
                <Line type="monotone" dataKey="yilmaz" name="Yılmaz" stroke={yilmaz.color} strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="kaya" name="Kaya" stroke={kaya.color} strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="demir" name="Demir" stroke={demir.color} strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="undecided" name="Kararsız" stroke="var(--color-muted-foreground)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="site-container pb-10">
        <div className="border border-border">
          <div className="flex items-center justify-between border-b border-border bg-surface-1 px-5 py-3">
            <h2 className="display-lg text-foreground">SON ANKETLER</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {POLL_FIRMS.length} şirket
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="px-5 py-3">Şirket</th>
                  <th className="px-5 py-3">Tarih</th>
                  <th className="px-5 py-3 text-right">Yılmaz</th>
                  <th className="px-5 py-3 text-right">Kaya</th>
                  <th className="px-5 py-3 text-right">Demir</th>
                  <th className="px-5 py-3 text-right">Kararsız</th>
                </tr>
              </thead>
              <tbody>
                {POLL_FIRMS.map((p) => (
                  <tr key={p.firm + p.date} className="border-b border-border/40 hover:bg-surface-1">
                    <td className="px-5 py-3 font-mono text-sm font-semibold text-foreground">{p.firm}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.date}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-mono text-sm font-semibold" style={{ color: yilmaz.color }}>%{p.yilmaz}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-mono text-sm font-semibold" style={{ color: kaya.color }}>%{p.kaya}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-mono text-sm font-semibold" style={{ color: demir.color }}>%{p.demir}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-mono text-xs text-muted-foreground">%{p.undecided}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
