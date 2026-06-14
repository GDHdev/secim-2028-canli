import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCcw, ChevronRight } from "lucide-react";

/**
 * AI ÖZET — 10 dk'da bir son durumu 2 cümlede özetler.
 * Şeffaf etiketleme: "AI ÖZET · model çıktısı" + zaman damgası.
 * Süs değil — kullanıcı 5 dk uzaklaşıp döndüğünde ne kaçırdığını tek bakışta görür.
 */

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
    <div className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="site-container py-4 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-5">
          {/* Label column */}
          <div className="flex shrink-0 items-center gap-2 md:w-44 md:flex-col md:items-start md:justify-center md:gap-1.5 md:border-r md:border-gray-200 md:pr-5">
            <div className="flex items-center gap-1.5 rounded-md border border-gray-900/10 bg-gray-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              <Sparkles size={11} strokeWidth={2.5} className="text-brand-500" />
              AI Özet
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium tabular-nums text-gray-500">
              <RefreshCcw size={10} />
              {time} · 10 dk
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <p className="text-base font-semibold leading-snug tracking-tight text-gray-900 md:text-lg">
                  {current.headline}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 md:text-[15px]">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pager dots */}
          <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end md:justify-between md:gap-3">
            <div className="flex items-center gap-1.5">
              {SUMMARIES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Özet ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-6 bg-brand-600" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % SUMMARIES.length)}
              className="hidden items-center gap-0.5 text-xs font-medium text-gray-500 hover:text-gray-900 md:inline-flex"
            >
              Sonraki
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
