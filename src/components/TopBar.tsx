import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Menu, X, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import gdhLogo from "@/assets/gdh-logo.svg";
import { GlobalSearch } from "./GlobalSearch";
import { CANDIDATES, COUNT_PERCENT, SECOND_ROUND_PROBABILITY } from "@/lib/mock-data";

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
  { to: "/haberler", label: "Haberler" },
];

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="site-container flex h-[72px] items-center gap-6">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Seçim 2028 anasayfa">
            <img src={gdhLogo} alt="" className="h-8 w-auto" />
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                Seçim
              </span>
              <span className="font-display text-xl font-semibold text-gray-900">2028</span>
            </div>
          </Link>

          {/* Primary nav — desktop */}
          <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {NAV.map((n) =>
              "children" in n ? (
                <NavDropdown key={n.label} item={n} />
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  activeProps={{ className: "text-brand-600 bg-brand-50" }}
                  inactiveProps={{ className: "text-gray-700 hover:bg-gray-100 hover:text-gray-900" }}
                  activeOptions={n.to === "/" ? { exact: true } : undefined}
                  className="rounded-lg px-3.5 py-2 text-[15px] font-semibold transition-colors"
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right: search + live indicator */}
          <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-white hover:text-gray-700 md:min-w-[280px]"
              aria-label="İl, aday veya parti ara"
            >
              <Search size={16} />
              <span className="hidden md:inline">İl, aday, parti ara…</span>
              <span className="md:hidden">Ara</span>
              <kbd className="ml-auto hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[11px] text-gray-500 md:inline">
                ⌘K
              </kbd>
            </button>

            <span className="hidden items-center gap-2 rounded-lg border border-error-500/30 bg-error-500/5 px-2.5 py-2 text-[12px] font-bold uppercase tracking-wider text-error-600 md:inline-flex">
              <span className="live-pulse h-1.5 w-1.5 rounded-full bg-error-500" />
              Canlı
              <span className="font-mono text-[12px] font-medium tabular-nums text-gray-500">{time}</span>
            </span>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
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
              <span className="font-display text-xl font-semibold text-gray-900">Menü</span>
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
                      <div key={n.label} className="mt-3 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
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
        className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 min-w-[260px] pt-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {item.children.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 border-b border-gray-100 px-4 py-3 transition-colors last:border-0 hover:bg-gray-50"
              >
                <span className="text-sm font-semibold text-gray-900">{c.label}</span>
                {c.hint && <span className="text-xs text-gray-500">{c.hint}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
