import { useEffect, useState } from "react";
import { CANDIDATES, COUNT_PERCENT, COUNTED_VOTES, TOTAL_VOTERS, SECOND_ROUND_PROBABILITY, fmtTR } from "@/lib/mock-data";
import { Vote, Users, Flag, Activity, Clock } from "lucide-react";

/**
 * STATUS STRIP — seçmenin sayfaya girer girmez gördüğü tek satırlık özet.
 * Hiçbir gradient, glow ya da glassmorphism YOK; düz beyaz panel, yüksek kontrast.
 */
export function AISummary() {
  const leader = CANDIDATES[0];
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const items = [
    {
      icon: Vote,
      label: "Sayım",
      value: `%${COUNT_PERCENT.toFixed(1)}`,
      hint: `${fmtTR(COUNTED_VOTES)} / ${fmtTR(TOTAL_VOTERS)} oy`,
    },
    {
      icon: Users,
      label: "Katılım",
      value: "%86,2",
      hint: "2023: %85,4 · +0,8 pt",
    },
    {
      icon: Flag,
      label: "Önde",
      value: leader.name.split(" ").slice(-1)[0],
      hint: `%${leader.percent.toFixed(1)} · ${leader.party}`,
      color: leader.color,
    },
    {
      icon: Activity,
      label: "2. Tur ihtimali",
      value: `%${SECOND_ROUND_PROBABILITY}`,
      hint: "14 Nisan 2028",
    },
    {
      icon: Clock,
      label: "Güncelleme",
      value: time,
      hint: "Her dakika yenilenir",
    },
  ];

  return (
    <section className="border-b border-gray-200 bg-gray-50" aria-label="Durum şeridi">
      <div className="site-container py-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {items.map((it) => (
            <div
              key={it.label}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <it.icon size={16} className="text-gray-600" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {it.label}
                </p>
                <p
                  className="truncate text-lg font-semibold tabular-nums leading-tight text-gray-900"
                  style={it.color ? { color: it.color } : undefined}
                >
                  {it.value}
                </p>
                <p className="truncate text-xs text-gray-500">{it.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
