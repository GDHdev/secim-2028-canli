import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Vote, Users } from "lucide-react";

export type PollOption = {
  id: string;
  label: string;
  /** Baseline mock votes so the bars look populated even before users vote. */
  base: number;
  color?: string;
};

export type SitePollProps = {
  id: string;
  question: string;
  options: PollOption[];
  /** Short context line above the question. */
  kicker?: string;
  /** Hide the surrounding card chrome (for use inside another card). */
  bare?: boolean;
  /** Compact spacing for sidebar / homepage embeds. */
  compact?: boolean;
};

const STORAGE_PREFIX = "secim2028:poll:";

function readVote(id: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + id);
  } catch {
    return null;
  }
}

function readTally(id: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + id + ":tally");
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function writeVote(id: string, optionId: string, tally: Record<string, number>) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, optionId);
    window.localStorage.setItem(STORAGE_PREFIX + id + ":tally", JSON.stringify(tally));
  } catch {
    /* ignore */
  }
}

export function SitePoll({ id, question, options, kicker, bare, compact }: SitePollProps) {
  const [vote, setVote] = useState<string | null>(null);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setVote(readVote(id));
    setTally(readTally(id));
    setHydrated(true);
  }, [id]);

  const totals = useMemo(() => {
    const counts = options.map((o) => o.base + (tally[o.id] ?? 0));
    const sum = counts.reduce((a, b) => a + b, 0) || 1;
    return { counts, sum };
  }, [options, tally]);

  const choose = (optId: string) => {
    if (vote) return;
    const nextTally = { ...tally, [optId]: (tally[optId] ?? 0) + 1 };
    setTally(nextTally);
    setVote(optId);
    writeVote(id, optId, nextTally);
  };

  const showResults = !!vote;
  const totalVotes = totals.sum;

  const inner = (
    <div className={compact ? "" : "p-5 md:p-6"}>
      <div className="flex items-start gap-3">
        <span className="uui-feat-icon uui-feat-icon-violet">
          <Vote size={18} />
        </span>
        <div className="min-w-0 flex-1">
          {kicker && <p className="uui-sec-eyebrow">{kicker}</p>}
          <h3 className="mt-0.5 font-display text-[18px] font-bold tracking-tight text-gray-900 md:text-[20px]">
            {question}
          </h3>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {options.map((opt, i) => {
          const count = totals.counts[i];
          const pct = Math.round((count / totalVotes) * 1000) / 10;
          const selected = vote === opt.id;
          const color = opt.color ?? "var(--color-brand-600)";

          if (!showResults) {
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => choose(opt.id)}
                  disabled={!hydrated}
                  className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-[14.5px] font-semibold text-gray-800 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50/40 hover:text-gray-900 disabled:opacity-50"
                >
                  <span>{opt.label}</span>
                  <span className="text-[12px] font-medium text-gray-400 group-hover:text-brand-600">
                    Oy ver →
                  </span>
                </button>
              </li>
            );
          }

          return (
            <li key={opt.id}>
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3">
                <span
                  className="absolute inset-y-0 left-0 -z-0 rounded-l-xl opacity-15 transition-[width]"
                  style={{ width: `${pct}%`, background: color }}
                />
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[14.5px] font-semibold text-gray-900">
                    {selected && <CheckCircle2 size={15} style={{ color }} />}
                    {opt.label}
                  </span>
                  <span className="tabular-nums text-[14px] font-bold" style={{ color }}>
                    %{pct.toFixed(1)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between text-[12.5px] text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <Users size={13} />
          {totalVotes.toLocaleString("tr-TR")} katılımcı
        </span>
        {showResults ? (
          <span className="text-emerald-600 font-semibold">Oyunuz kaydedildi</span>
        ) : (
          <span>Bilimsel bir araştırma değildir, site içi okur anketidir.</span>
        )}
      </div>
    </div>
  );

  if (bare) return inner;
  return <div className="uui-card overflow-hidden">{inner}</div>;
}
