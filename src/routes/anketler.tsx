import { createFileRoute } from "@tanstack/react-router";
import { POLLS, POLL_FIRMS, CANDIDATES } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, TrendingUp, Building2 } from "lucide-react";
import { PageHero, SubSectionHeader } from "@/components/PageHero";

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
      <PageHero
        icon={BarChart3}
        tone="indigo"
        kicker="Ekim 2026 — Mart 2028 · 18 ay"
        title="Anketler tarihçesi"
        description="18 ayda yayımlanan tüm büyük anketleri tek grafikte birleştirdik. Yılmaz'ın yükselişi ve Kaya'nın stabil seyri net görülüyor."
        actions={<span className="uui-badge uui-badge-gray">{POLLS.length} aylık veri</span>}
      />

      <section className="site-container py-10 md:py-12">
        <SubSectionHeader
          icon={TrendingUp}
          tone="brand"
          kicker="Trend"
          title="Oy oranı eğrisi"
          meta="Aylık ortalamalar, kararsız seçmen kesik çizgi ile gösterilmiştir."
        />
        <div className="uui-card p-4 md:p-6">
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={POLLS} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--color-gray-200)" />
                <XAxis dataKey="date" stroke="var(--color-gray-500)" fontSize={12} />
                <YAxis stroke="var(--color-gray-500)" fontSize={12} domain={[10, 50]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid var(--color-gray-200)",
                    borderRadius: "12px",
                    fontSize: "13px",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "13px", paddingTop: 8 }} />
                <Line type="monotone" dataKey="yilmaz" name="Yılmaz" stroke={yilmaz.color} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="kaya" name="Kaya" stroke={kaya.color} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="demir" name="Demir" stroke={demir.color} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="undecided" name="Kararsız" stroke="var(--color-gray-400)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="site-container pb-12">
        <SubSectionHeader
          icon={Building2}
          tone="violet"
          kicker={`${POLL_FIRMS.length} şirket`}
          title="Son anketler"
          meta="Liderin oranı vurgulanmıştır."
        />
        <div className="uui-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-[12px] font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Şirket</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3 text-right">Yılmaz</th>
                  <th className="px-4 py-3 text-right">Kaya</th>
                  <th className="px-4 py-3 text-right">Demir</th>
                  <th className="px-4 py-3 text-right">Kararsız</th>
                </tr>
              </thead>
              <tbody>
                {POLL_FIRMS.map((p) => (
                  <tr key={p.firm + p.date} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{p.firm}</td>
                    <td className="px-4 py-3 text-gray-500">{p.date}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: yilmaz.color }}>%{p.yilmaz}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: kaya.color }}>%{p.kaya}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: demir.color }}>%{p.demir}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-500">%{p.undecided}</td>
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
