import {
  HISTORICAL,
  NATIONAL_TURNOUT_2023,
  NATIONAL_TURNOUT_2028,
  FLIPPED_PROVINCES,
  CANDIDATES,
  PARTIES,
} from "@/lib/mock-data";
import { ArrowRight, History, TrendingUp, TrendingDown, MapPin } from "lucide-react";

/**
 * ElectionCompare — 2023 vs 2028 net karşılaştırma.
 * "Bir önceki seçimde ne olmuştu?" sorusunu tek bakışta cevaplar.
 *
 * Tasarım mantığı:
 *  - Sol: aday bazlı yan yana barlar (eski/yeni), büyük delta rozetleri
 *  - Sağ: ulusal katılım + lider değiştiren iller (swing)
 */
export function ElectionCompare() {
  const turnoutDelta = +(NATIONAL_TURNOUT_2028 - NATIONAL_TURNOUT_2023).toFixed(1);
  const biggestGainer = [...HISTORICAL].sort(
    (a, b) => b.y2028 - b.y2023 - (a.y2028 - a.y2023),
  )[0];
  const biggestLoser = [...HISTORICAL].sort(
    (a, b) => a.y2028 - a.y2023 - (b.y2028 - b.y2023),
  )[0];

  // Lider değişimi parti bazlı (basit gösterim)
  const leaderParty = PARTIES[0];
  const leaderPartyDelta = leaderParty.delta;

  return (
    <div className="panel overflow-hidden">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 px-6 py-5 md:px-8 md:py-6">
        <div className="flex items-start gap-3">
          <span className="uui-feat-icon uui-feat-icon-gray">
            <History size={20} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Bir önceki seçim
            </p>
            <h3 className="mt-0.5 font-display text-2xl font-semibold text-gray-900">
              2023 → 2028 karşılaştırması
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Adayların ulusal oy oranı, katılım ve lider değişen iller.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="uui-badge uui-badge-gray">2023</span>
          <ArrowRight size={14} className="text-gray-400" />
          <span className="uui-badge uui-badge-brand">2028</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT — aday bazlı yan yana barlar */}
        <div className="border-b border-gray-200 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <p className="mb-5 text-[12px] font-bold uppercase tracking-wider text-gray-500">
            Cumhurbaşkanlığı · ulusal oy oranı
          </p>
          <ul className="space-y-5">
            {HISTORICAL.map((h) => {
              const delta = +(h.y2028 - h.y2023).toFixed(1);
              const up = delta > 0;
              const flat = Math.abs(delta) < 0.05;
              const max = Math.max(h.y2023, h.y2028, 50);
              return (
                <li key={h.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: h.color }}
                      />
                      <span className="text-[15px] font-semibold text-gray-900">
                        {h.name}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums ${
                        flat
                          ? "bg-gray-100 text-gray-600"
                          : up
                            ? "bg-success-50 text-success-700"
                            : "bg-error-50 text-error-700"
                      }`}
                    >
                      {up && <TrendingUp size={11} />}
                      {!up && !flat && <TrendingDown size={11} />}
                      {flat ? "—" : `${up ? "+" : ""}${delta} pt`}
                    </span>
                  </div>

                  {/* Çift bar: 2023 üstte gri, 2028 altta renkli */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-[11px] font-mono text-gray-400">
                        '23
                      </span>
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gray-300"
                          style={{ width: `${(h.y2023 / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right text-[12px] font-mono text-gray-500 tabular-nums">
                        %{h.y2023}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-10 shrink-0 text-[11px] font-mono font-semibold"
                        style={{ color: h.color }}
                      >
                        '28
                      </span>
                      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(h.y2028 / max) * 100}%`,
                            backgroundColor: h.color,
                          }}
                        />
                      </div>
                      <span
                        className="w-12 shrink-0 text-right text-[13px] font-mono font-semibold tabular-nums"
                        style={{ color: h.color }}
                      >
                        %{h.y2028}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT — özet kartlar */}
        <div className="flex flex-col gap-3 p-6 md:p-8">
          <p className="text-[12px] font-bold uppercase tracking-wider text-gray-500">
            Öne çıkanlar
          </p>

          <InsightCard
            label="Katılım"
            now={`%${NATIONAL_TURNOUT_2028}`}
            prev={`%${NATIONAL_TURNOUT_2023}`}
            delta={`${turnoutDelta > 0 ? "+" : ""}${turnoutDelta} pt`}
            tone={turnoutDelta >= 0 ? "success" : "error"}
          />
          <InsightCard
            label="En çok kazanan"
            now={biggestGainer.name}
            prev={`%${biggestGainer.y2023} → %${biggestGainer.y2028}`}
            delta={`+${(biggestGainer.y2028 - biggestGainer.y2023).toFixed(1)} pt`}
            tone="success"
            accent={biggestGainer.color}
          />
          <InsightCard
            label="En çok kaybeden"
            now={biggestLoser.name}
            prev={`%${biggestLoser.y2023} → %${biggestLoser.y2028}`}
            delta={`${(biggestLoser.y2028 - biggestLoser.y2023).toFixed(1)} pt`}
            tone="error"
            accent={biggestLoser.color}
          />
          <InsightCard
            label={`Meclis · ${leaderParty.abbr}`}
            now={`${leaderParty.seats} sandalye`}
            prev={`${leaderParty.seats - leaderPartyDelta} (2023)`}
            delta={`${leaderPartyDelta > 0 ? "+" : ""}${leaderPartyDelta} sandalye`}
            tone={leaderPartyDelta >= 0 ? "success" : "error"}
            accent={leaderParty.color}
          />

          {/* Lider değişen iller */}
          <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={14} className="text-gray-500" />
              <p className="text-[12px] font-bold uppercase tracking-wider text-gray-600">
                Lider değişen iller ({FLIPPED_PROVINCES.length})
              </p>
            </div>
            {FLIPPED_PROVINCES.length === 0 ? (
              <p className="text-[13px] text-gray-500">
                Hiçbir ilde lider değişmedi.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {FLIPPED_PROVINCES.slice(0, 5).map((f) => {
                  const fromC = CANDIDATES.find((c) => c.id === f.from)!;
                  const toC = CANDIDATES.find((c) => c.id === f.to)!;
                  return (
                    <li
                      key={f.id}
                      className="flex items-center justify-between gap-2 text-[13px]"
                    >
                      <span className="font-semibold text-gray-900">{f.name}</span>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <span
                          className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                          style={{ backgroundColor: fromC.color }}
                        >
                          {fromC.name.split(" ").slice(-1)[0]}
                        </span>
                        <ArrowRight size={11} />
                        <span
                          className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                          style={{ backgroundColor: toC.color }}
                        >
                          {toC.name.split(" ").slice(-1)[0]}
                        </span>
                      </span>
                    </li>
                  );
                })}
                {FLIPPED_PROVINCES.length > 5 && (
                  <li className="pt-1 text-[12px] text-gray-500">
                    + {FLIPPED_PROVINCES.length - 5} il daha…
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-[12px] text-gray-500 md:px-8">
        Kaynak: YSK 2023 ve 2028 kesin olmayan sonuçlar · İl bazlı 2023 tahminleri
        ulusal salınım yöntemiyle hesaplanmıştır.
      </footer>
    </div>
  );
}

function InsightCard({
  label,
  now,
  prev,
  delta,
  tone,
  accent,
}: {
  label: string;
  now: string;
  prev: string;
  delta: string;
  tone: "success" | "error";
  accent?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
      {accent && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: accent }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            {label}
          </p>
          <p className="mt-1 font-display text-[20px] font-semibold leading-tight text-gray-900">
            {now}
          </p>
          <p className="mt-0.5 text-[12px] text-gray-500 tabular-nums">{prev}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums ${
            tone === "success"
              ? "bg-success-50 text-success-700"
              : "bg-error-50 text-error-700"
          }`}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}
