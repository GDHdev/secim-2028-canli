import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { PROVINCES, type Province, CANDIDATES } from "@/lib/mock-data";
import { X } from "lucide-react";
import trProvinces from "@/assets/tr-provinces.json";

// GeoJSON property name → mock province id
const NAME_TO_ID: Record<string, string> = {
  "Adana": "adana", "Adıyaman": "adiyaman", "Afyon": "afyonkarahisar",
  "Aksaray": "aksaray", "Amasya": "amasya", "Ankara": "ankara",
  "Antalya": "antalya", "Ardahan": "ardahan", "Artvin": "artvin",
  "Aydın": "aydin", "Ağrı": "agri", "Balıkesir": "balikesir",
  "Bartın": "bartin", "Batman": "batman", "Bayburt": "bayburt",
  "Bilecik": "bilecik", "Bingöl": "bingol", "Bitlis": "bitlis",
  "Bolu": "bolu", "Burdur": "burdur", "Bursa": "bursa",
  "Denizli": "denizli", "Diyarbakır": "diyarbakir", "Düzce": "duzce",
  "Edirne": "edirne", "Elazığ": "elazig", "Erzincan": "erzincan",
  "Erzurum": "erzurum", "Eskişehir": "eskisehir", "Gaziantep": "gaziantep",
  "Giresun": "giresun", "Gümüşhane": "gumushane", "Hakkari": "hakkari",
  "Hatay": "hatay", "Isparta": "isparta", "Iğdır": "igdir",
  "Kahramanmaraş": "kahramanmaras", "Karabük": "karabuk", "Karaman": "karaman",
  "Kars": "kars", "Kastamonu": "kastamonu", "Kayseri": "kayseri",
  "Kilis": "kilis", "Kocaeli": "kocaeli", "Konya": "konya",
  "Kütahya": "kutahya", "Kırklareli": "kirklareli", "Kırıkkale": "kirikkale",
  "Kırşehir": "kirsehir", "Malatya": "malatya", "Manisa": "manisa",
  "Mardin": "mardin", "Mersin": "mersin", "Muğla": "mugla",
  "Muş": "mus", "Nevşehir": "nevsehir", "Niğde": "nigde",
  "Ordu": "ordu", "Osmaniye": "osmaniye", "Rize": "rize",
  "Sakarya": "sakarya", "Samsun": "samsun", "Siirt": "siirt",
  "Sinop": "sinop", "Sivas": "sivas", "Tekirdağ": "tekirdag",
  "Tokat": "tokat", "Trabzon": "trabzon", "Tunceli": "tunceli",
  "Uşak": "usak", "Van": "van", "Yalova": "yalova",
  "Yozgat": "yozgat", "Zonguldak": "zonguldak", "Çanakkale": "canakkale",
  "Çankırı": "cankiri", "Çorum": "corum", "İstanbul": "istanbul",
  "İzmir": "izmir", "Şanlıurfa": "sanliurfa", "Şırnak": "sirnak",
};

const candidateColor = (id: "yilmaz" | "kaya" | "demir") =>
  CANDIDATES.find((c) => c.id === id)!.color;

const GEO_URL = trProvinces as unknown as object;
const MAP_SCALE = 3200;
const MAP_CENTER: [number, number] = [35.5, 39.1];
const MAP_W = 1200;
const MAP_H = 560;

export type TurkeyMapProps = {
  /** Hide built-in modal side panel; emit selection upward instead. */
  embedded?: boolean;
  /** Controlled selection (when embedded). */
  selectedId?: string | null;
  onSelect?: (p: Province | null) => void;
  /** Override the wrapper aspect / height. */
  className?: string;
  /** Hide title row above map. */
  hideHeader?: boolean;
  /** Show parliamentary mode (visual only — pattern overlay on top of leader). */
  mode?: "baskan" | "vekil";
};

export function TurkeyMap({
  embedded = false,
  selectedId,
  onSelect,
  className,
  hideHeader = false,
  mode = "baskan",
}: TurkeyMapProps) {
  const [internalSelected, setInternalSelected] = useState<Province | null>(null);
  const selected = embedded
    ? (selectedId ? PROVINCES.find((p) => p.id === selectedId) ?? null : null)
    : internalSelected;
  const setSelected = (p: Province | null) => {
    if (embedded) onSelect?.(p);
    else setInternalSelected(p);
  };

  const [hover, setHover] = useState<Province | null>(null);
  const [tipPos, setTipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const provinceById = useMemo(() => {
    const m = new Map<string, Province>();
    PROVINCES.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  return (
    <div className="relative">
      {!hideHeader && (
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-wider text-foreground">TÜRKİYE HARİTASI</h2>
            <p className="font-mono text-xs text-muted-foreground">
              81 İL · ÖNDE OLAN ADAYA GÖRE RENKLENDİRME
            </p>
          </div>
          <Legend />
        </div>
      )}

      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className ?? ""}`}
        onMouseLeave={() => setHover(null)}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: MAP_SCALE, center: MAP_CENTER }}
          width={MAP_W}
          height={MAP_H}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          {/* SVG patterns + filters */}
          <defs>
            <filter id="province-hover-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.45" />
            </filter>
            {(["yilmaz", "kaya", "demir"] as const).map((id) => (
              <pattern
                key={id}
                id={`hatch-${id}`}
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(45)"
              >
                <rect width="6" height="6" fill={candidateColor(id)} />
                <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
              </pattern>
            ))}
          </defs>

          <Geographies geography={GEO_URL}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const name = geo.properties.name as string;
                  const id = NAME_TO_ID[name];
                  const province = id ? provinceById.get(id) : undefined;
                  const baseFill = province
                    ? (mode === "vekil"
                        ? `url(#hatch-${province.leader})`
                        : candidateColor(province.leader))
                    : "var(--color-surface-2)";
                  const isSelected = selected?.id === id;
                  const isHover = hover?.id === id;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => {
                        if (province) {
                          setHover(province);
                          setTipPos({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseMove={(e) => setTipPos({ x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => province && setSelected(province)}
                      filter={isHover || isSelected ? "url(#province-hover-shadow)" : undefined}
                      style={{
                        default: {
                          fill: baseFill,
                          stroke: "var(--color-background)",
                          strokeWidth: 0.6,
                          outline: "none",
                          transition: "fill 0.4s ease, opacity 0.3s ease",
                          opacity: isSelected ? 1 : 0.95,
                          cursor: "pointer",
                        },
                        hover: {
                          fill: baseFill,
                          stroke: "var(--color-background)",
                          strokeWidth: 0.6,
                          outline: "none",
                          opacity: 1,
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: baseFill,
                          stroke: "var(--color-background)",
                          strokeWidth: 0.6,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })}

                {/* Province labels — always visible */}
                {geographies.map((geo) => {
                  const name = geo.properties.name as string;
                  const id = NAME_TO_ID[name];
                  const province = id ? provinceById.get(id) : undefined;
                  if (!province) return null;
                  const centroid = geoCentroid(geo);
                  if (!Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) return null;
                  return (
                    <g key={`lbl-${geo.rsmKey}`} transform={`translate(${projectPoint(centroid)})`} pointerEvents="none">
                      <text
                        textAnchor="middle"
                        y={0}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 7,
                          fontWeight: 700,
                          fill: "white",
                          paintOrder: "stroke",
                          stroke: "rgba(0,0,0,0.6)",
                          strokeWidth: 0.7,
                        }}
                      >
                        {province.name.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {hover && (
          <div
            className="pointer-events-none fixed z-40 rounded-sm border border-border bg-popover px-3 py-2 text-xs shadow-lg"
            style={{ left: tipPos.x + 14, top: tipPos.y + 14 }}
          >
            <div className="font-display text-base tracking-wider text-popover-foreground">{hover.name}</div>
            <div className="text-muted-foreground">
              Önde: <span className="font-medium text-foreground">{candName(hover.leader)}</span>{" "}
              <span className="font-mono text-accent">%{hover.results[hover.leader]}</span>
            </div>
            <div className="font-mono text-xs text-muted-foreground">Sayım: %{hover.counted}</div>
          </div>
        )}
      </div>

      {/* Modal side panel — only when not embedded */}
      <AnimatePresence>
        {!embedded && selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-card p-6 shadow-2xl"
            >
              <ProvincePanelBody province={selected} onClose={() => setSelected(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Reusable province panel body — used in both modal and embedded layouts. */
export function ProvincePanelBody({ province, onClose }: { province: Province; onClose?: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{province.region.toUpperCase()}</p>
          <h3 className="font-display text-4xl tracking-wider text-foreground">{province.name.toUpperCase()}</h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Nüfus: {province.population.toLocaleString("tr-TR")} · Sayım: %{province.counted}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {(["yilmaz", "kaya", "demir", "other"] as const).map((id) => {
          const c = CANDIDATES.find((x) => x.id === id)!;
          const v = province.results[id];
          const isLeader = id === province.leader;
          return (
            <div key={id}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className={`font-display text-lg tracking-wide ${isLeader ? "text-accent" : "text-foreground"}`}>
                  {c.name.toUpperCase()}
                </span>
                <span className={`font-display text-2xl ${isLeader ? "text-accent" : "text-foreground"}`}>
                  %{v}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-sm bg-surface-2">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${v}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full" style={{ backgroundColor: c.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-sm border border-border bg-surface-1 p-3">
          <p className="font-mono text-xs text-muted-foreground">KATILIM 2028</p>
          <p className="font-display text-3xl text-foreground">%{province.turnout}</p>
        </div>
        <div className="rounded-sm border border-border bg-surface-1 p-3">
          <p className="font-mono text-xs text-muted-foreground">KATILIM 2023</p>
          <p className="font-display text-3xl text-muted-foreground">%{province.turnout2023}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs text-muted-foreground">İLÇE BAZINDA (ÖRNEK)</p>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-xs text-muted-foreground">
              <th className="py-2">İLÇE</th>
              <th>YIL.</th>
              <th>KAYA</th>
              <th>DEMİR</th>
            </tr>
          </thead>
          <tbody>
            {fakeDistricts(province).map((d) => (
              <tr key={d.name} className="border-b border-border/40">
                <td className="py-1.5 text-foreground">{d.name}</td>
                <td className="font-mono text-foreground">%{d.y}</td>
                <td className="font-mono text-foreground">%{d.k}</td>
                <td className="font-mono text-foreground">%{d.de}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/sonuclar"
        className="mt-6 inline-block font-mono text-xs text-accent hover:underline"
      >
        Tüm sonuçlar tablosu →
      </Link>
    </>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3">
      {CANDIDATES.slice(0, 3).map((c) => (
        <div key={c.id} className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: c.color }} />
          <span className="font-mono text-xs text-muted-foreground">{c.name.split(" ")[1].toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

function candName(id: "yilmaz" | "kaya" | "demir") {
  return CANDIDATES.find((c) => c.id === id)!.name;
}

function fakeDistricts(p: Province) {
  const base = p.results;
  const names = ["Merkez", "Çankaya", "Kadıköy", "Şişli", "Bağcılar"].slice(0, 4);
  return names.map((n, i) => {
    const drift = (i - 1.5) * 3;
    return {
      name: n,
      y: Math.max(0, Math.round(base.yilmaz + drift)),
      k: Math.max(0, Math.round(base.kaya - drift / 2)),
      de: Math.max(0, Math.round(base.demir + drift / 3)),
    };
  });
}

/** Project [lon, lat] to SVG coords matching ComposableMap's default projection. */
function projectPoint([lon, lat]: [number, number]): string {
  // Recreate the same Mercator transform used by ComposableMap above
  const scale = 2400;
  const cx = 35.2, cy = 39;
  const w = 900, h = 420;
  const lonRad = ((lon - cx) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const cyRad = (cy * Math.PI) / 180;
  const x = w / 2 + scale * lonRad;
  const yMerc = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const yMercC = Math.log(Math.tan(Math.PI / 4 + cyRad / 2));
  const y = h / 2 - scale * (yMerc - yMercC);
  return `${x} ${y}`;
}
