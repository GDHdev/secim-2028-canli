import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import gdhLogo from "@/assets/gdh-logo.svg";
import { GlobalSearch } from "./GlobalSearch";

type NavItem =
  | { to: string; label: string }
  | {
      label: string;
      children: { to: string; label: string; hint?: string }[];
    };

const NAV: NavItem[] = [
  { to: "/", label: "Anasayfa" },
  {
    label: "Cumhurbaşkanı",
    children: [
      { to: "/sonuclar", label: "Sonuçlar", hint: "Aday bazında oy dağılımı" },
      { to: "/tur2", label: "2. Tur Simülatörü", hint: "Olası eşleşmeler" },
      { to: "/anketler", label: "Anketler", hint: "Şirket karşılaştırması" },
    ],
  },
  { to: "/milletvekili", label: "Milletvekili" },
  { to: "/harita", label: "Harita" },
  {
    label: "Rehber",
    children: [
      { to: "/rehber", label: "Seçmen Rehberi", hint: "Oy nasıl kullanılır, kimlik, haklar" },
      { to: "/rehber/secim-takvimi", label: "Seçim Takvimi", hint: "Önemli tarihler" },
      { to: "/rehber/yurt-disi-secmen", label: "Yurt Dışı Oy", hint: "Temsilcilik ve gümrük" },
      { to: "/rehber/sss", label: "Sıkça Sorulanlar", hint: "Telefon, kıyafet, sayım" },
    ],
  },
  { to: "/haberler", label: "Haberler" },
];

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now
    ? now.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" })
    : "--";

  return (
    <>
      {/* Slim announcement bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="site-container flex h-9 items-center justify-between text-[12.5px] text-gray-600">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-500 live-pulse" />
            <span className="font-semibold text-gray-900">Canlı sayım sürüyor</span>
            <span className="hidden sm:inline text-gray-500">· 14 Mart 2028 · {dateStr}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="site-container flex h-[72px] items-center gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Seçim 2028 anasayfa">
            <img src={gdhLogo} alt="" className="h-8 w-auto" />
            <div className="hidden items-baseline gap-2 sm:flex">
              <span className="font-display text-[20px] font-bold tracking-tight text-gray-900">Seçim</span>
              <span className="rounded-md px-1.5 py-0.5 font-mono text-[14px] font-bold text-white" style={{ background: "var(--color-brand-600)" }}>2028</span>
            </div>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {NAV.map((n) =>
              "children" in n ? (
                <NavDropdown key={n.label} item={n} />
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  activeProps={{ className: "text-gray-900 bg-gray-100" }}
                  inactiveProps={{ className: "text-gray-700 hover:text-gray-900 hover:bg-gray-50" }}
                  activeOptions={n.to === "/" ? { exact: true } : undefined}
                  className="rounded-lg px-3.5 py-2 text-[15px] font-semibold transition-colors"
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-[14px] text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-900 md:flex md:min-w-[260px]"
              aria-label="Ara"
            >
              <Search size={16} />
              <span>İl, aday, parti…</span>
              <kbd className="ml-auto rounded border border-gray-200 bg-gray-50 px-1.5 py-px font-mono text-[11px] text-gray-500">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 md:hidden"
              aria-label="Ara"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              onClick={() => document.dispatchEvent(new CustomEvent("open-ai-assistant"))}
              className="hidden items-center gap-2 rounded-lg px-3.5 py-2 text-[14px] font-semibold text-white shadow-xs transition-colors md:inline-flex"
              style={{ background: "var(--color-violet-600)" }}
            >
              <Sparkles size={15} />
              AI Asistan
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-gray-900/40"
          />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-white shadow-xl">
            <div className="flex h-[72px] items-center justify-between border-b border-gray-200 px-5">
              <span className="font-display text-xl font-bold text-gray-900">Menü</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col p-3" aria-label="Mobil menü">
              {NAV.flatMap((n) =>
                "children" in n
                  ? [
                      <div key={n.label} className="mt-3 px-3 pb-1 text-[12px] font-bold uppercase tracking-wider text-gray-500">
                        {n.label}
                      </div>,
                      ...n.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => setMobileOpen(false)}
                          activeProps={{ className: "text-brand-600 bg-brand-50" }}
                          inactiveProps={{ className: "text-gray-800 hover:bg-gray-50" }}
                          className="flex flex-col rounded-lg px-3 py-3"
                        >
                          <span className="text-[15px] font-semibold">{c.label}</span>
                          {c.hint && <span className="text-xs text-gray-500">{c.hint}</span>}
                        </Link>
                      )),
                    ]
                  : [
                      <Link
                        key={n.to}
                        to={n.to}
                        onClick={() => setMobileOpen(false)}
                        activeProps={{ className: "text-brand-600 bg-brand-50" }}
                        inactiveProps={{ className: "text-gray-800 hover:bg-gray-50" }}
                        activeOptions={n.to === "/" ? { exact: true } : undefined}
                        className="rounded-lg px-3 py-3 text-[16px] font-semibold"
                      >
                        {n.label}
                      </Link>,
                    ],
              )}
            </nav>
          </div>
        </div>
      )}

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function NavDropdown({
  item,
}: {
  item: Extract<NavItem, { children: { to: string; label: string; hint?: string }[] }>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 min-w-[280px] pt-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {item.children.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 border-b border-gray-100 px-4 py-3 transition-colors last:border-0 hover:bg-gray-50"
              >
                <span className="text-[15px] font-semibold text-gray-900">{c.label}</span>
                {c.hint && <span className="text-[13px] text-gray-500">{c.hint}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
