import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PARTIES,
  TOTAL_SEATS,
  MAJORITY_THRESHOLD,
  ELECTION_THRESHOLD,
} from "@/lib/mock-data";
import { Parliament } from "@/components/Parliament";
import { Landmark, Gauge, Handshake, MapPin, Check } from "lucide-react";
import { PageHero, SubSectionHeader } from "@/components/PageHero";

export const Route = createFileRoute("/milletvekili")({
  head: () => ({
    meta: [
      { title: "Milletvekili Sonuçları | Seçim 2028" },
      { name: "description", content: "İl bazında parti birinciliği, baraj durumu ve interaktif koalisyon hesaplayıcısı." },
      { property: "og:title", content: "Milletvekili Sonuçları — Seçim 2028" },
      { property: "og:description", content: "600 sandalyenin il dağılımı, baraj ve koalisyon simülatörü." },
    ],
  }),
  component: MilletvekiliPage,
});

function MilletvekiliPage() {
  return (
    <div className="bg-background">
      <PageHero
        icon={Landmark}
        tone="warning"
        kicker="Milletvekili · 600 sandalye"
        title="Meclis dağılımı"
        description="TBMM'nin yeni dağılımı, baraj durumu, il bazında parti birinciliği ve interaktif koalisyon hesaplayıcısı."
        actions={
          <>
            <span className="uui-badge uui-badge-gray">7 parti</span>
            <span className="uui-badge uui-badge-brand">Çoğunluk {MAJORITY_THRESHOLD}</span>
          </>
        }
      />

      <section className="site-container py-10">
        <Parliament />
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="site-container py-10">
          <SubSectionHeader
            icon={Gauge}
            tone="brand"
            kicker={`Seçim barajı %${ELECTION_THRESHOLD}`}
            title="Baraj durumu"
            meta="Her parti için oy oranı ve baraj eşiği gösterilmiştir."
          />
          <ThresholdGrid />
        </div>
      </section>

      <section className="site-container py-10">
        <SubSectionHeader
          icon={Handshake}
          tone="violet"
          kicker={`Çoğunluk için ${MAJORITY_THRESHOLD} sandalye`}
          title="Koalisyon hesaplayıcı"
          meta="Partileri seçin, toplam sandalye sayısı anında güncellensin."
        />
        <CoalitionBuilder />
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="site-container py-10">
          <SubSectionHeader
            icon={MapPin}
            tone="indigo"
            kicker="81 il"
            title="İl bazında birincilik"
            meta="Her partinin birinci olduğu il sayısı."
          />
          <ProvinceWinners />
        </div>
      </section>
    </div>
  );
}

function ThresholdGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {PARTIES.map((p) => {
        const passes = p.percent >= ELECTION_THRESHOLD;
        const ratio = Math.min(1, p.percent / 15);
        return (
          <div key={p.id} className="uui-card p-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[15px] font-bold text-gray-900">{p.abbr}</span>
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wide ${passes ? "text-success-600" : "text-brand-600"}`}
              >
                {passes ? "● Geçti" : "● Altında"}
              </span>
            </div>
            <p className="mt-1 truncate text-[13px] text-gray-500">{p.name}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-[28px] font-bold tabular-nums text-gray-900">%{p.percent}</span>
              <span className="text-[12px] text-gray-500">{p.seats} sandalye</span>
            </div>
            <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ratio * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="absolute top-0 h-full w-px bg-gray-900" style={{ left: `${(ELECTION_THRESHOLD / 15) * 100}%` }} />
            </div>
            <div className="mt-1 text-[11px] text-gray-500" style={{ marginLeft: `${(ELECTION_THRESHOLD / 15) * 100}%` }}>
              ↑ %{ELECTION_THRESHOLD}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CoalitionBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["ubp", "agp"]));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totals = useMemo(() => {
    const chosen = PARTIES.filter((p) => selected.has(p.id));
    const seats = chosen.reduce((s, p) => s + p.seats, 0);
    const percent = chosen.reduce((s, p) => s + p.percent, 0);
    return { seats, percent: +percent.toFixed(1), chosen };
  }, [selected]);

  const ratio = Math.min(1, totals.seats / TOTAL_SEATS);
  const majorityRatio = MAJORITY_THRESHOLD / TOTAL_SEATS;
  const reachesMajority = totals.seats >= MAJORITY_THRESHOLD;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-2 md:grid-cols-2">
        {PARTIES.map((p) => {
          const on = selected.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                on
                  ? "border-gray-900 bg-white shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${on ? "bg-gray-900" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-1"}`}
                />
              </span>
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] font-bold text-gray-900">{p.abbr}</span>
                  <span className="text-[12px] text-gray-500">%{p.percent}</span>
                </div>
                <p className="truncate text-[12px] text-gray-500">{p.name}</p>
              </div>
              <span className="font-display text-[20px] font-bold tabular-nums text-gray-900">{p.seats}</span>
            </button>
          );
        })}
      </div>

      <div className="uui-card p-5">
        <p className="uui-sec-eyebrow">Koalisyon toplamı</p>
        <p className="mt-3 font-display text-[48px] font-bold leading-none tabular-nums text-gray-900">
          {totals.seats}
        </p>
        <p className="mt-1 text-[13px] text-gray-500">
          %{totals.percent} oy · {totals.chosen.length} parti
        </p>

        <div className="relative mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${reachesMajority ? "bg-success-600" : "bg-brand-600"}`}
          />
          <span className="absolute top-0 h-full w-px bg-gray-900" style={{ left: `${majorityRatio * 100}%` }} />
        </div>
        <div className="mt-1 text-[11px] text-gray-500" style={{ marginLeft: `${majorityRatio * 100}%` }}>
          ↑ {MAJORITY_THRESHOLD} (çoğunluk)
        </div>

        <div
          className={`mt-5 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-bold ${
            reachesMajority
              ? "border-green-200 bg-green-50 text-success-600"
              : totals.seats > 0
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-gray-200 bg-gray-50 text-gray-500"
          }`}
        >
          {reachesMajority ? <Check size={16} /> : null}
          {reachesMajority
            ? "Çoğunluk sağlandı — hükümet kurabilir"
            : totals.seats > 0
              ? `${MAJORITY_THRESHOLD - totals.seats} sandalye eksik`
              : "Bir parti seçin"}
        </div>

        <div className="mt-5 space-y-2">
          {totals.chosen.map((p) => (
            <div key={p.id} className="flex items-center gap-2 text-[13px]">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="flex-1 font-semibold text-gray-900">{p.abbr}</span>
              <span className="tabular-nums text-gray-500">+{p.seats}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProvinceWinners() {
  const winners = useMemo(() => {
    const map: Record<string, number> = {};
    PARTIES.forEach((p) => (map[p.id] = 0));
    const totalPct = PARTIES.reduce((s, p) => s + p.percent, 0);
    let assigned = 0;
    PARTIES.forEach((p, i) => {
      const count = i === PARTIES.length - 1 ? 81 - assigned : Math.round((p.percent / totalPct) * 81);
      map[p.id] = count;
      assigned += count;
    });
    return map;
  }, []);

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {PARTIES.map((p) => {
        const count = winners[p.id];
        return (
          <div key={p.id} className="uui-card flex items-center gap-3 p-4">
            <span className="inline-block h-10 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold text-gray-900">{p.abbr}</span>
                <span className="truncate text-[12px] text-gray-500">{p.name}</span>
              </div>
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-gray-500">Birinci olduğu il</p>
            </div>
            <span className="font-display text-[26px] font-bold tabular-nums text-gray-900">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
