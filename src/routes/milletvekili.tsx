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

export const Route = createFileRoute("/milletvekili")({
  head: () => ({
    meta: [
      { title: "Milletvekili Sonuçları | Seçim 2028" },
      {
        name: "description",
        content:
          "İl bazında parti birinciliği, baraj durumu ve interaktif koalisyon hesaplayıcısı.",
      },
      { property: "og:title", content: "Milletvekili Sonuçları — Seçim 2028" },
      {
        property: "og:description",
        content: "600 sandalyenin il dağılımı, baraj ve koalisyon simülatörü.",
      },
    ],
  }),
  component: MilletvekiliPage,
});

function MilletvekiliPage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="site-container border-b border-border py-8 md:py-10">
        <span className="eyebrow-accent">Milletvekili Seçimleri</span>
        <h1 className="display-mega mt-2 text-foreground">
          600 Sandalye, <span className="text-primary">7 Parti</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Türkiye Büyük Millet Meclisi'nin yeni dağılımı. Baraj durumu, il bazında parti
          birinciliği ve interaktif koalisyon hesaplayıcısı.
        </p>
      </section>

      {/* PARLIAMENT */}
      <section className="site-container py-8">
        <Parliament />
      </section>

      {/* THRESHOLD STATUS */}
      <section className="site-container border-y border-border bg-surface-1 py-8">
        <div className="mb-5 flex items-baseline justify-between border-b-2 border-foreground pb-2">
          <h2 className="display-lg text-foreground">Baraj Durumu</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Seçim barajı %{ELECTION_THRESHOLD}
          </span>
        </div>
        <ThresholdGrid />
      </section>

      {/* COALITION CALCULATOR */}
      <section className="site-container py-10">
        <div className="mb-5 flex items-baseline justify-between border-b-2 border-foreground pb-2">
          <h2 className="display-lg text-foreground">Koalisyon Hesaplayıcı</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Çoğunluk için {MAJORITY_THRESHOLD} sandalye
          </span>
        </div>
        <CoalitionBuilder />
      </section>

      {/* PROVINCE LEADERS */}
      <section className="site-container border-t border-border py-10">
        <div className="mb-5 flex items-baseline justify-between border-b-2 border-foreground pb-2">
          <h2 className="display-lg text-foreground">İl Bazında Birincilik</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            81 il · birinci parti dağılımı
          </span>
        </div>
        <ProvinceWinners />
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
          <div key={p.id} className="panel p-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-sm font-bold text-foreground">{p.abbr}</span>
              </div>
              <span
                className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                  passes ? "text-success-600" : "text-brand-600"
                }`}
              >
                {passes ? "● GEÇTİ" : "● ALTINDA"}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">{p.name}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl text-foreground tabular-nums">
                %{p.percent}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {p.seats} sandalye
              </span>
            </div>
            <div className="relative mt-3 h-2 overflow-hidden bg-surface-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ratio * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full"
                style={{ backgroundColor: p.color }}
              />
              <span
                className="absolute top-0 h-full w-px bg-foreground"
                style={{ left: `${(ELECTION_THRESHOLD / 15) * 100}%` }}
              />
            </div>
            <div
              className="mt-1 font-mono text-[9px] text-muted-foreground"
              style={{ marginLeft: `${(ELECTION_THRESHOLD / 15) * 100}%` }}
            >
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Party toggles */}
      <div className="grid gap-2 md:grid-cols-2">
        {PARTIES.map((p) => {
          const on = selected.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all ${
                on
                  ? "border-foreground bg-surface-2"
                  : "border-border bg-surface-1 hover:border-muted-foreground"
              }`}
            >
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  on ? "bg-foreground" : "bg-surface-3"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${
                    on ? "translate-x-5 bg-background" : "translate-x-1 bg-muted-foreground"
                  }`}
                />
              </span>
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-foreground">{p.abbr}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    %{p.percent}
                  </span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{p.name}</p>
              </div>
              <span className="font-display text-xl tabular-nums text-foreground">
                {p.seats}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result panel */}
      <div className="panel p-5">
        <span className="eyebrow-accent">Koalisyon Toplamı</span>
        <p className="mt-3 font-display text-6xl tabular-nums text-foreground">
          {totals.seats}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          %{totals.percent} oy · {totals.chosen.length} parti
        </p>

        <div className="relative mt-5 h-3 overflow-hidden bg-surface-3">
          <motion.div
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${reachesMajority ? "bg-success-600" : "bg-brand-600"}`}
          />
          <span
            className="absolute top-0 h-full w-px bg-foreground"
            style={{ left: `${majorityRatio * 100}%` }}
          />
        </div>
        <div
          className="mt-1 font-mono text-[10px] text-muted-foreground"
          style={{ marginLeft: `${majorityRatio * 100}%` }}
        >
          ↑ {MAJORITY_THRESHOLD} (çoğunluk)
        </div>

        <div
          className={`mt-5 border px-3 py-2.5 text-center text-xs font-bold ${
            reachesMajority
              ? "border-success-600/30 bg-success-500/10 text-success-600"
              : totals.seats > 0
                ? "border-brand-600/30 bg-brand-50 text-brand-700"
                : "border-gray-200 bg-gray-50 text-gray-500"
          }`}
        >
          {reachesMajority
            ? "✓ ÇOĞUNLUK SAĞLANDI — HÜKÜMET KURABİLİR"
            : totals.seats > 0
              ? `✕ ${MAJORITY_THRESHOLD - totals.seats} SANDALYE EKSİK`
              : "BİR PARTİ SEÇİN"}
        </div>

        <div className="mt-5 space-y-2">
          {totals.chosen.map((p) => (
            <div key={p.id} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="flex-1 font-mono text-foreground">{p.abbr}</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                +{p.seats}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProvinceWinners() {
  // Map candidate leaders to fictional party-winner mapping
  const winners = useMemo(() => {
    // group provinces by leader candidate as proxy for party in chart
    const map: Record<string, number> = {};
    PARTIES.forEach((p) => (map[p.id] = 0));
    // pseudo-distribute 81 provinces by party percent
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
          <div key={p.id} className="panel-flat flex items-center gap-3 p-4">
            <span
              className="inline-block h-10 w-1.5"
              style={{ backgroundColor: p.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-foreground">{p.abbr}</span>
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                  {p.name}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Birinci olduğu il
              </p>
            </div>
            <span className="font-display text-3xl tabular-nums text-foreground">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
