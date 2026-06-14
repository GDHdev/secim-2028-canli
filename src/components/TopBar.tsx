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

  const leader = CANDIDATES[0];
  const second = CANDIDATES[1];
  const gap = (leader.percent - second.percent).toFixed(1);
  const time = now
    ? now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";
  const dateStr = now
    ? now.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" })
    : "--";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="site-container flex h-[60px] items-center gap-6">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Seçim 2028 anasayfa">
            <img src={gdhLogo} alt="" className="h-7 w-auto" />
            <div className="hidden items-baseline gap-2 sm:flex">
              <span className="font-display text-lg font-extrabold tracking-tight text-gray-900">SEÇİM</span>
              <span className="font-mono text-sm font-semibold text-brand-600">2028</span>
            </div>
          </Link>

          {/* Primary nav — desktop */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Ana menü">
            {NAV.map((n) =>
              "children" in n ? (
                <NavDropdown key={n.label} item={n} />
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  activeProps={{ className: "text-gray-900 after:scale-x-100" }}
                  inactiveProps={{ className: "text-gray-600 hover:text-gray-900 after:scale-x-0" }}
                  activeOptions={n.to === "/" ? { exact: true } : undefined}
                  className="relative px-3 py-2 text-[13.5px] font-semibold uppercase tracking-wide transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:origin-left after:bg-brand-600 after:transition-transform"
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
              className="flex items-center gap-2.5 rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-[13px] text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 md:min-w-[260px]"
              aria-label="Ara"
            >
              <Search size={14} />
              <span className="hidden font-mono md:inline">İL · ADAY · PARTİ…</span>
              <span className="md:hidden">Ara</span>
              <kbd className="ml-auto hidden rounded-sm border border-gray-300 bg-gray-50 px-1.5 py-px font-mono text-[10px] text-gray-500 md:inline">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-sm border border-gray-300 bg-white p-2 text-gray-700 lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Bloomberg-style data sub-strip */}
        <div className="term-strip overflow-x-auto">
          <div className="site-container flex items-stretch text-[12px]">
            <div className="col !pl-0">
              <span className="term-tag term-tag-live">
                <span className="live-pulse h-1.5 w-1.5 rounded-full bg-white" /> CANLI
              </span>
              <span className="term-label term-label-light">{dateStr} · {time}</span>
            </div>
            <DataCol label="SAYIM" value={`${COUNT_PERCENT.toFixed(1)}%`} delta="+0.3" up />
            <DataCol label="KATILIM" value="86.2%" delta="+0.8 pt" up />
            <DataCol label={`ÖNDE · ${leader.name.split(" ").slice(-1)[0].toUpperCase()}`} value={`${leader.percent.toFixed(1)}%`} color={leader.color} />
            <DataCol label="FARK" value={`+${gap} pt`} amber />
            <DataCol label="2.TUR" value={`${SECOND_ROUND_PROBABILITY}%`} amber />
            <DataCol label="BARAJ AŞAN" value="7" />
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

function DataCol({
  label,
  value,
  delta,
  up,
  down,
  amber,
  color,
}: {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
  down?: boolean;
  amber?: boolean;
  color?: string;
}) {
  const valueClass = amber
    ? "term-amber"
    : up
    ? "term-up"
    : down
    ? "term-down"
    : "text-white";
  return (
    <div className="col">
      <span className="term-label term-label-light">{label}</span>
      <span
        className={`term-num text-[13px] font-semibold ${color ? "" : valueClass}`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
      {delta && (
        <span className={`term-num text-[11px] ${up ? "term-up" : down ? "term-down" : "text-white/60"} inline-flex items-center gap-0.5`}>
          {up && <ArrowUpRight size={10} />}
          {down && <ArrowDownRight size={10} />}
          {delta}
        </span>
      )}
    </div>
  );
}
