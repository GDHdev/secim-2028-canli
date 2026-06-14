import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Users, Vote, TrendingUp, TrendingDown } from "lucide-react";
import { getProvince, CANDIDATES, getDistricts, province2023, fmtTR } from "@/lib/mock-data";
import { ShareBar } from "@/components/ShareBar";

export const Route = createFileRoute("/il/$id")({
  head: ({ params }) => {
    const p = getProvince(params.id);
    const title = p ? `${p.name} — Seçim 2028 Sonuçları` : "İl bulunamadı";
    const desc = p
      ? `${p.name} ilinde Cumhurbaşkanlığı seçimi canlı sonuçları. Sayım %${p.counted}, katılım %${p.turnout}.`
      : "Seçim 2028 il sonuçları.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const p = getProvince(params.id);
    if (!p) throw notFound();
    return { province: p };
  },
  component: ProvincePage,
  notFoundComponent: () => (
    <div className="site-container py-24 text-center">
      <p className="font-display text-4xl text-gray-900">İl bulunamadı</p>
      <Link to="/harita" className="mt-4 inline-block text-brand-600 hover:underline">
        ← Haritaya dön
      </Link>
    </div>
  ),
});

function ProvincePage() {
  const { province } = Route.useLoaderData();
  const districts = getDistricts(province);
  const prev = province2023(province);
  const leader = CANDIDATES.find((c) => c.id === province.leader)!;
  const order = (["yilmaz", "kaya", "demir", "other"] as const)
    .map((id) => ({ id, c: CANDIDATES.find((x) => x.id === id)!, v: province.results[id] }))
    .sort((a, b) => b.v - a.v);

  const flipped = prev.leader !== province.leader;

  return (
    <div className="bg-background">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="site-container py-6">
          <Link
            to="/harita"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={14} /> Türkiye haritası
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                <MapPin size={11} /> {province.region}
              </p>
              <h1 className="mt-1 font-display text-4xl font-semibold text-gray-900 md:text-5xl">
                {province.name}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Nüfus {fmtTR(province.population)} · sayım %{province.counted} · katılım %{province.turnout}
              </p>
            </div>
            <ShareBar title={`${province.name}: ${leader.name.split(" ").slice(-1)[0]} %${province.results[province.leader]} önde`} />
          </div>
        </div>
      </section>

      {/* Hero leader */}
      <section className="site-container py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div
            className="panel relative overflow-hidden p-6 md:p-8"
            style={{ borderTop: `4px solid ${leader.color}` }}
          >
            <div className="flex items-center gap-2">
              <span className="uui-badge uui-badge-error uui-badge-live">Canlı · 1. Tur</span>
              {flipped && (
                <span className="uui-badge uui-badge-warning">
                  Lider değişti · 2023 → {leader.name.split(" ").slice(-1)[0]}
                </span>
              )}
            </div>
            <div className="mt-5 flex items-center gap-5">
              {leader.photo && (
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="h-20 w-20 rounded-xl object-cover ring-2"
                  style={{ ["--tw-ring-color" as never]: leader.color }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Önde</p>
                <p className="font-display text-2xl font-semibold text-gray-900">{leader.name}</p>
                <p className="text-sm text-gray-500">{leader.party}</p>
              </div>
              <p
                className="font-display text-[64px] font-semibold leading-none tabular-nums md:text-[80px]"
                style={{ color: leader.color }}
              >
                %{province.results[province.leader]}
              </p>
            </div>

            <ul className="mt-7 space-y-3">
              {order.map(({ id, c, v }) => (
                <li key={id}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: c.color }}>
                      %{v}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: c.color }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 2023 vs 2028 */}
          <div className="panel overflow-hidden">
            <div className="border-b border-gray-200 px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                2023 → 2028 karşılaştırması
              </p>
              <h3 className="mt-0.5 font-display text-lg font-semibold text-gray-900">
                İl bu seçimde ne yaptı?
              </h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {(["yilmaz", "kaya", "demir"] as const).map((id) => {
                const c = CANDIDATES.find((x) => x.id === id)!;
                const now = province.results[id];
                const then = prev[id];
                const delta = +(now - then).toFixed(1);
                const up = delta > 0;
                return (
                  <li key={id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm tabular-nums text-gray-400">%{then}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono text-sm font-bold tabular-nums" style={{ color: c.color }}>
                        %{now}
                      </span>
                      <span
                        className={`inline-flex w-14 justify-end items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                          up ? "bg-success-500/10 text-success-600" : "bg-error-500/10 text-error-600"
                        }`}
                      >
                        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {up ? "+" : ""}{delta}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="grid grid-cols-2 gap-px bg-gray-200">
              <div className="bg-white px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Katılım 2028
                </p>
                <p className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-gray-900">
                  %{province.turnout}
                </p>
              </div>
              <div className="bg-white px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Katılım 2023
                </p>
                <p className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-gray-500">
                  %{province.turnout2023}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* District table */}
      <section className="site-container py-8">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <Vote size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-gray-900">
                İlçe bazında sonuçlar
              </h2>
              <p className="text-xs text-gray-500">
                {districts.length} ilçe · sayım yüzdesine göre güncellenir.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-2.5">İlçe</th>
                  <th className="px-3 py-2.5 text-right">Nüfus</th>
                  <th className="px-3 py-2.5 text-right">Sayım</th>
                  <th className="px-3 py-2.5 text-right">Katılım</th>
                  <th className="px-3 py-2.5 text-right" style={{ color: CANDIDATES[0].color }}>Yılmaz</th>
                  <th className="px-3 py-2.5 text-right" style={{ color: CANDIDATES[1].color }}>Kaya</th>
                  <th className="px-3 py-2.5 text-right" style={{ color: CANDIDATES[2].color }}>Demir</th>
                  <th className="px-4 py-2.5">Lider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {districts.map((d) => {
                  const lead = d.yilmaz >= d.kaya && d.yilmaz >= d.demir ? "yilmaz" : d.kaya >= d.demir ? "kaya" : "demir";
                  const leadColor = CANDIDATES.find((c) => c.id === lead)!.color;
                  return (
                    <tr key={d.name} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-semibold text-gray-900">{d.name}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums text-gray-500">{fmtTR(d.population)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums text-gray-700">%{d.counted}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums text-gray-700">%{d.turnout.toFixed(0)}</td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums">%{d.yilmaz.toFixed(1)}</td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums">%{d.kaya.toFixed(1)}</td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums">%{d.demir.toFixed(1)}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                          style={{ background: leadColor }}
                        >
                          {CANDIDATES.find((c) => c.id === lead)!.name.split(" ").slice(-1)[0]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="site-container pb-12">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <Users size={16} className="mt-0.5 shrink-0 text-gray-500" />
            İlçe ve sandık bazlı veriler YSK tutanaklarının dijitalleşmesiyle anlık güncellenir.
            Geçersiz oy ve itiraz bilgileri için{" "}
            <Link to="/" className="font-semibold text-brand-600 hover:underline">
              ana sayfa sandık şeffaflığı
            </Link>{" "}
            paneline bakınız.
          </p>
        </div>
      </section>
    </div>
  );
}
