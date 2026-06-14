import { Link } from "@tanstack/react-router";
import { Radio, Shield, GitBranch, Mail } from "lucide-react";
import gdhLogo from "@/assets/gdh-logo.svg";

const SECTIONS = [
  {
    title: "Yayın",
    links: [
      { to: "/", label: "Genel Görünüm" },
      { to: "/harita", label: "Türkiye Haritası" },
      { to: "/sonuclar", label: "Sonuçlar Tablosu" },
      { to: "/milletvekili", label: "Meclis Dağılımı" },
    ],
  },
  {
    title: "Analiz",
    links: [
      { to: "/tur2", label: "2. Tur Simülatörü" },
      { to: "/anketler", label: "Anket Karşılaştırma" },
      { to: "/haberler", label: "Haber Akışı" },
    ],
  },
] as const;

export function Footer() {
  const now = new Date().toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/[0.06] bg-[oklch(0.115_0.018_264)]">
      {/* Top accent stripe */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[800px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "oklch(0.55 0.22 25)" }}
      />

      <div className="site-container relative">
        {/* Top section — broadcast credits */}
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-3">
              <img src={gdhLogo} alt="GDH" className="h-10 w-auto" />
              <span className="h-9 w-px bg-white/10" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gray-500">
                  Seçim Merkezi
                </span>
                <span className="text-xl font-bold tracking-tight text-gray-900">2028</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-gray-500">
              Türkiye'nin canlı seçim gecesi platformu. Cumhurbaşkanlığı ve Milletvekili
              sonuçlarını dakika dakika, harita, meclis ve bölge bazında ekrana taşır.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-success-500/25 bg-success-500/10 px-3 py-2 text-[13px] font-semibold text-success-500">
              <span className="live-pulse h-1.5 w-1.5 rounded-full bg-success-500" />
              <Radio size={13} />
              Yayın aktif · veri akışı stabil
            </div>
          </div>

          {/* Link columns */}
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-500">
                {sec.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {sec.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-gray-600 transition-colors hover:text-gray-900"
                    >
                      <span className="h-px w-0 bg-brand-500 transition-all group-hover:w-4" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Last column — transparency */}
          <div>
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-500">
              Şeffaflık
            </h3>
            <ul className="mt-5 space-y-3">
              <li className="flex items-start gap-2 text-[14px] text-gray-500">
                <Shield size={14} className="mt-0.5 shrink-0 text-gray-600" />
                <span>YSK resmi verisi · sandık doğrulama</span>
              </li>
              <li className="flex items-start gap-2 text-[14px] text-gray-500">
                <GitBranch size={14} className="mt-0.5 shrink-0 text-gray-600" />
                <span>AI özet · model çıktısı olarak işaretlidir</span>
              </li>
              <li className="flex items-start gap-2 text-[14px] text-gray-500">
                <Mail size={14} className="mt-0.5 shrink-0 text-gray-600" />
                <span>iletisim@gdh.com.tr</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom rail */}
        <div className="flex flex-col gap-3 border-t border-white/[0.06] py-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-500">
            © 2028 GDH · Seçim Merkezi · Tüm hakları saklıdır
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tabular-nums text-gray-500">
            <span>Son güncelleme · {now}</span>
            <span className="text-gray-400/30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
              DEMO · veriler kurgusaldır
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
