import { motion } from "framer-motion";
import { CANDIDATES } from "@/lib/mock-data";
import { CountUp } from "./CountUp";

/**
 * Editorial-style presidential race card.
 * Headline-oriented: leader gets massive type, trailing get subordinated.
 */
export function PresidentRace() {
  const ranked = [...CANDIDATES].filter((c) => c.id !== "other").sort((a, b) => b.percent - a.percent);
  const leader = ranked[0];
  const second = ranked[1];
  const third = ranked[2];
  const other = CANDIDATES.find((c) => c.id === "other")!;
  const gap = leader.percent - second.percent;

  return (
    <div className="panel relative overflow-hidden">
      {/* Top eyebrow strip */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="eyebrow-accent">Cumhurbaşkanlığı · 1. Tur</span>
          <span className="rounded-sm bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
            Canlı
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          %50 Barajı · 2. Tur Kaçınılmaz
        </span>
      </div>

      {/* Leader hero */}
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative border-b border-border p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-start gap-5">
            <Portrait candidate={leader} size="lg" />
            <div className="min-w-0 flex-1">
              <span className="rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: leader.color, color: "#0A0E1A" }}>
                Önde
              </span>
              <h2 className="mt-2 font-display text-5xl tracking-tight text-foreground md:text-6xl lg:text-7xl">
                {leader.name.toUpperCase()}
              </h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {leader.party}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <CountUp
                to={leader.percent}
                decimals={1}
                duration={1.2}
                suffix="%"
                className="font-display text-7xl leading-none tracking-tight md:text-8xl lg:text-9xl"
                style={{ color: leader.color }}
              />
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {leader.votes.toLocaleString("tr-TR")} oy
              </p>
            </div>
            <div className="text-right">
              <span className="eyebrow">Fark</span>
              <p className="font-display text-4xl text-accent md:text-5xl">
                +{gap.toFixed(1)}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                puan üstünlük
              </p>
            </div>
          </div>

          {/* Bar with 50% threshold */}
          <div className="relative mt-5 h-3 overflow-hidden bg-surface-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${leader.percent}%` }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
              style={{ backgroundColor: leader.color }}
            />
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-foreground/40" />
            <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/60">
              %50
            </span>
          </div>
        </div>

        {/* Trailing candidates stacked */}
        <div className="divide-y divide-border">
          <ChallengerRow candidate={second} place={2} />
          <ChallengerRow candidate={third} place={3} />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: other.color }} />
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Diğer Adaylar
              </span>
            </div>
            <span className="font-display text-2xl text-muted-foreground">
              %{other.percent.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengerRow({ candidate, place }: { candidate: typeof CANDIDATES[number]; place: number }) {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <span className="font-display text-3xl text-muted-foreground">
        {String(place).padStart(2, "0")}
      </span>
      <Portrait candidate={candidate} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-2xl tracking-tight text-foreground md:text-3xl">
          {candidate.name.toUpperCase()}
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: candidate.color }} />
          <p className="truncate font-mono text-[11px] text-muted-foreground">{candidate.party}</p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden bg-surface-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${candidate.percent}%` }}
            transition={{ duration: 0.9, delay: 0.2 + place * 0.1 }}
            className="h-full"
            style={{ backgroundColor: candidate.color }}
          />
        </div>
      </div>
      <CountUp
        to={candidate.percent}
        decimals={1}
        duration={1}
        suffix="%"
        className="tabular-nums font-display text-4xl md:text-5xl"
        style={{ color: candidate.color }}
      />
    </div>
  );
}

function Portrait({ candidate, size }: { candidate: typeof CANDIDATES[number]; size: "lg" | "sm" }) {
  const dim = size === "lg" ? "h-24 w-24 md:h-28 md:w-28" : "h-14 w-14";
  return (
    <div className="relative shrink-0">
      <div
        className={`overflow-hidden ring-2 ring-offset-2 ring-offset-card ${dim}`}
        style={{ ["--tw-ring-color" as never]: candidate.color, borderRadius: 2 }}
      >
        {candidate.photo ? (
          <img
            src={candidate.photo}
            alt={candidate.name}
            loading="eager"
            width={224}
            height={224}
            className="h-full w-full object-cover grayscale"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-display text-2xl text-foreground"
            style={{ backgroundColor: candidate.color }}
          >
            {candidate.name[0]}
          </div>
        )}
      </div>
    </div>
  );
}
