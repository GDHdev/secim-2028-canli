import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCcw, ChevronRight } from "lucide-react";

const SUMMARIES = [
  {
    headline: "Yılmaz farkı açıyor, ama eşik hâlâ uzak",
    body: "Son 10 dakikada sayım %72 → %74.6'ya çıktı. Yılmaz, Kaya karşısında farkı 6.5 puana taşıdı; ancak %50 barajının 12 puan altında — 2. tur olasılığı %73.",
  },
  {
    headline: "Marmara'da sürpriz dengeler",
    body: "Tekirdağ, Edirne ve Kırklareli'de Kaya öne geçti. Bursa ve Kocaeli'de fark 1 puanın altında — bu üç il gece boyunca el değiştirebilir.",
  },
  {
    headline: "Meclis: koalisyon kaçınılmaz",
    body: "Hiçbir parti tek başına 301 sandalyeye ulaşamıyor. UBP+YYH bloku 287'de takılı; HSP merkezli alternatif blok 264 sandalyede.",
  },
  {
    headline: "Katılım 2023'ün üzerinde",
    body: "Şu ana kadar açıklanan sandıklarda katılım %86.4 — 2023'e göre +1.2 puan. En yüksek artış Doğu Anadolu'da (+3.1).",
  },
];

export function AISummary() {
  const [idx, setIdx] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setUpdatedAt(new Date());
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SUMMARIES.length);
      setUpdatedAt(new Date());
    }, 12000);
    return () => clearInterval(t);
  }, []);

  const current = SUMMARIES[idx];
  const time = updatedAt
    ? updatedAt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <div className="relative overflow-hidden border-b border-white/[0.06] bg-[oklch(0.155_0.020_264)]">
      {/* Subtle accent stripe */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="site-container py-5 md:py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {/* Label */}
          <div className="flex shrink-0 items-center gap-3 md:w-52 md:flex-col md:items-start md:gap-2 md:border-r md:border-white/[0.06] md:pr-6">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-brand-500/30 bg-brand-700/20 px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-500 shadow-[0_0_16px_oklch(0.62_0.25_25/0.25)]">
              <Sparkles size={12} strokeWidth={2.5} />
              AI Özet
            </div>
            <div className="inline-flex items-center gap-1.5 text-[12px] font-medium tabular-nums text-gray-500">
              <RefreshCcw size={11} />
              <span>{time}</span>
              <span className="text-gray-400/40">·</span>
              <span>10 dk'da bir</span>
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className="text-lg font-bold leading-snug tracking-tight text-gray-900 md:text-xl">
                  {current.headline}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600 md:text-base">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pager */}
          <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end md:justify-between md:gap-3">
            <div className="flex items-center gap-1.5">
              {SUMMARIES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Özet ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-7 bg-brand-500 shadow-[0_0_8px_oklch(0.68_0.25_25/0.6)]" : "w-1.5 bg-card/[0.15] hover:bg-card/[0.3]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % SUMMARIES.length)}
              className="hidden items-center gap-0.5 text-[12px] font-semibold text-gray-500 transition-colors hover:text-gray-900 md:inline-flex"
            >
              Sonraki
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
