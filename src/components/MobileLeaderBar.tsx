import { useEffect, useState } from "react";
import { CANDIDATES, COUNT_PERCENT } from "@/lib/mock-data";

/**
 * MOBİL STICKY LİDER BARI — seçim gecesi mobil trafik %80'i bulur.
 * Ekran altında 3 aday yüzdesi + sayım % her zaman görünür.
 */
export function MobileLeaderBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const top3 = CANDIDATES.slice(0, 3);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-error-500/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-error-600">
          <span className="live-pulse h-1 w-1 rounded-full bg-error-500" />
          Canlı
        </span>
        <div className="flex flex-1 items-center justify-around gap-1">
          {top3.map((c) => (
            <div key={c.id} className="flex flex-col items-center leading-tight">
              <span
                className="font-display text-[15px] font-bold tabular-nums"
                style={{ color: c.color }}
              >
                %{c.percent.toFixed(1)}
              </span>
              <span className="text-[9.5px] font-semibold text-gray-600">
                {c.name.split(" ").slice(-1)[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end leading-tight border-l border-gray-200 pl-2.5">
          <span className="font-display text-[14px] font-bold tabular-nums text-gray-900">
            %{COUNT_PERCENT.toFixed(1)}
          </span>
          <span className="text-[9.5px] font-semibold text-gray-500">Sayım</span>
        </div>
      </div>
    </div>
  );
}
