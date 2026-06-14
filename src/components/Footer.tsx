import { Link } from "@tanstack/react-router";
import { Shield, GitBranch, Mail } from "lucide-react";
import gdhLogo from "@/assets/gdh-logo.svg";

const SECTIONS = [
  {
    title: "Sonuçlar",
    links: [
      { to: "/", label: "Anasayfa" },
      { to: "/sonuclar", label: "Cumhurbaşkanlığı" },
      { to: "/milletvekili", label: "Milletvekili" },
      { to: "/harita", label: "Türkiye haritası" },
    ],
  },
  {
    title: "Analiz",
    links: [
      { to: "/tur2", label: "2. tur simülatörü" },
      { to: "/anketler", label: "Anketler" },
      { to: "/haberler", label: "Haberler" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={gdhLogo} alt="" className="h-9 w-auto" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                  Seçim
                </span>
                <span className="font-display text-xl font-semibold text-gray-900">2028</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-gray-600">
              Türkiye'nin canlı seçim gecesi platformu. Cumhurbaşkanlığı ve milletvekili
              sonuçlarını harita, meclis ve il bazında dakika dakika takip edin.
            </p>
          </div>

          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                {sec.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {sec.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-[15px] font-medium text-gray-700 transition-colors hover:text-brand-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
              Şeffaflık
            </h3>
            <ul className="mt-4 space-y-3 text-[14px] text-gray-600">
              <li className="flex items-start gap-2">
                <Shield size={14} className="mt-0.5 shrink-0 text-gray-500" />
                <span>YSK resmi verisi — sandık doğrulama</span>
              </li>
              <li className="flex items-start gap-2">
                <GitBranch size={14} className="mt-0.5 shrink-0 text-gray-500" />
                <span>Otomatik özetler model çıktısı olarak işaretlenir</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 shrink-0 text-gray-500" />
                <a href="mailto:iletisim@gdh.com.tr" className="hover:text-brand-600">
                  iletisim@gdh.com.tr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 py-5 text-[12px] text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2028 GDH · Seçim Merkezi · Tüm hakları saklıdır</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-warning-500" />
            DEMO — veriler kurgusaldır
          </p>
        </div>
      </div>
    </footer>
  );
}
