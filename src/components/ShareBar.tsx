import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { CANDIDATES, COUNT_PERCENT } from "@/lib/mock-data";

/**
 * PAYLAŞIM — Türkiye'de seçim gecesi sonuçlar WhatsApp gruplarında dolaşır.
 */
export function ShareBar({ url, title }: { url?: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const top = CANDIDATES.slice(0, 3)
    .map((c) => `${c.name.split(" ").slice(-1)[0]} %${c.percent.toFixed(1)}`)
    .join(" · ");
  const text = title ?? `Seçim 2028 canlı: ${top} · Sayım %${COUNT_PERCENT.toFixed(1)}`;
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "https://secim-2028-canli.lovable.app");
  const fullText = `${text}\n${shareUrl}`;

  const wa = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
        <Share2 size={12} /> Paylaş
      </span>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.003a9.87 9.87 0 01-5.03-1.378l-.36-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        {copied ? <Check size={12} className="text-success-600" /> : <Copy size={12} />}
        {copied ? "Kopyalandı" : "Kopyala"}
      </button>
    </div>
  );
}
