import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { Search, MapPin, User, Users, X, ArrowRight, Clock } from "lucide-react";
import { CANDIDATES, PARTIES, PROVINCES } from "@/lib/mock-data";

/** Türkçe karakter normalizasyonu */
function norm(s: string) {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const LS_KEY = "secim2028-recent-search";

type Recent = { id: string; label: string; type: "il" | "aday" | "parti"; href: string };

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<Recent[]>([]);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, [open]);

  // Global hotkeys: ⌘K / Ctrl+K / "/"
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isEditable(e.target))) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const nq = norm(q.trim());

  const provinceHits = useMemo(() => {
    if (!nq) return PROVINCES.slice(0, 6);
    return PROVINCES.filter((p) => norm(p.name).includes(nq) || norm(p.region).includes(nq)).slice(0, 8);
  }, [nq]);

  const candidateHits = useMemo(() => {
    if (!nq) return CANDIDATES.filter((c) => c.id !== "other");
    return CANDIDATES.filter(
      (c) => c.id !== "other" && (norm(c.name).includes(nq) || norm(c.party).includes(nq)),
    );
  }, [nq]);

  const partyHits = useMemo(() => {
    if (!nq) return PARTIES.slice(0, 4);
    return PARTIES.filter(
      (p) => norm(p.abbr).includes(nq) || norm(p.name).includes(nq),
    ).slice(0, 8);
  }, [nq]);

  const remember = useCallback((r: Recent) => {
    const next = [r, ...recent.filter((x) => x.id !== r.id)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  }, [recent]);

  const go = useCallback(
    (r: Recent) => {
      remember(r);
      onOpenChange(false);
      setQ("");
      navigate({ to: r.href });
    },
    [navigate, onOpenChange, remember],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]">
      <button
        type="button"
        aria-label="Aramayı kapat"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-gray-900/40"
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <Command shouldFilter={false} loop>
          <div className="flex items-center gap-3 border-b border-gray-200 px-4">
            <Search size={20} className="text-gray-400" />
            <Command.Input
              value={q}
              onValueChange={setQ}
              autoFocus
              placeholder="İl, aday veya parti ara… (örn. İstanbul, Yılmaz, UBP)"
              className="flex-1 bg-transparent py-4 text-base text-gray-900 outline-none placeholder:text-gray-400"
            />
            <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 md:inline">
              Esc
            </kbd>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 md:hidden"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-gray-500">
              Sonuç bulunamadı.
            </Command.Empty>

            {!nq && recent.length > 0 && (
              <Command.Group heading="Son aramalar" className="cmd-group">
                {recent.map((r) => (
                  <Command.Item
                    key={`r-${r.id}`}
                    value={`recent-${r.id}`}
                    onSelect={() => go(r)}
                    className="cmd-item"
                  >
                    <Clock size={16} className="text-gray-400" />
                    <span className="flex-1 truncate text-gray-900">{r.label}</span>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400">{r.type}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {provinceHits.length > 0 && (
              <Command.Group heading={`İller (${provinceHits.length})`} className="cmd-group">
                {provinceHits.map((p) => {
                  const cand = CANDIDATES.find((c) => c.id === p.leader)!;
                  return (
                    <Command.Item
                      key={`p-${p.id}`}
                      value={`il-${p.name}`}
                      onSelect={() =>
                        go({
                          id: `il-${p.id}`,
                          label: p.name,
                          type: "il",
                          href: `/harita?il=${p.id}`,
                        })
                      }
                      className="cmd-item"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100"
                      >
                        <MapPin size={15} className="text-gray-500" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
                        <p className="truncate text-xs text-gray-500">{p.region} · sayım %{p.counted}</p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: cand.color }}
                        />
                        <span className="font-medium text-gray-700">
                          {cand.name.split(" ").slice(-1)[0]}
                        </span>
                      </span>
                      <ArrowRight size={14} className="text-gray-300" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}

            {candidateHits.length > 0 && (
              <Command.Group heading="Adaylar" className="cmd-group">
                {candidateHits.map((c) => (
                  <Command.Item
                    key={`c-${c.id}`}
                    value={`aday-${c.name}`}
                    onSelect={() =>
                      go({
                        id: `aday-${c.id}`,
                        label: c.name,
                        type: "aday",
                        href: `/sonuclar`,
                      })
                    }
                    className="cmd-item"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${c.color}1a` }}
                    >
                      <User size={15} style={{ color: c.color }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="truncate text-xs text-gray-500">{c.party}</p>
                    </div>
                    <span className="font-mono text-sm font-bold tabular-nums" style={{ color: c.color }}>
                      %{c.percent.toFixed(1)}
                    </span>
                    <ArrowRight size={14} className="text-gray-300" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {partyHits.length > 0 && (
              <Command.Group heading="Partiler" className="cmd-group">
                {partyHits.map((p) => (
                  <Command.Item
                    key={`pa-${p.id}`}
                    value={`parti-${p.abbr}`}
                    onSelect={() =>
                      go({
                        id: `parti-${p.id}`,
                        label: `${p.abbr} — ${p.name}`,
                        type: "parti",
                        href: `/milletvekili`,
                      })
                    }
                    className="cmd-item"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${p.color}1a` }}
                    >
                      <Users size={15} style={{ color: p.color }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {p.abbr} <span className="font-normal text-gray-500">— {p.name}</span>
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        %{p.percent} · {p.seats} sandalye
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-[11px] text-gray-500">
            <span>
              <kbd className="rounded border border-gray-200 bg-white px-1.5 font-mono">↑↓</kbd> gez ·{" "}
              <kbd className="rounded border border-gray-200 bg-white px-1.5 font-mono">↵</kbd> aç
            </span>
            <span>81 il · {CANDIDATES.length - 1} aday · {PARTIES.length} parti</span>
          </div>
        </Command>
      </div>

      {/* cmdk class hooks via global styles */}
      <style>{`
        [cmdk-group-heading] {
          padding: 8px 12px 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6B7280;
        }
        [cmdk-item].cmd-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          color: #1F2937;
        }
        [cmdk-item][data-selected="true"].cmd-item {
          background: #F5F6F8;
        }
      `}</style>
    </div>
  );
}

function isEditable(t: EventTarget | null) {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable;
}
