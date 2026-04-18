import { motion } from "framer-motion";
import { CANDIDATES } from "@/lib/mock-data";
import { CountUp } from "./CountUp";

export function CandidateRace() {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl tracking-wider text-foreground md:text-4xl">
          CUMHURBAŞKANLIĞI YARIŞI
        </h2>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          1. Tur · Canlı
        </span>
      </div>

      <div className="space-y-3">
        {CANDIDATES.filter((c) => c.id !== "other").map((c, i) => (
          <CandidateBar key={c.id} candidate={c} index={i} />
        ))}
        <OtherBar />
      </div>

    </div>
  );
}

function CandidateBar({
  candidate,
  index,
}: {
  candidate: typeof CANDIDATES[number];
  index: number;
}) {
  const isLeader = index === 0;
  return (
    <div
      className={`shadow-card flex items-center gap-4 rounded-lg border bg-card transition-all hover:shadow-card-lg ${
        isLeader
          ? "border-accent/50 p-5 ring-1 ring-accent/30 md:p-6"
          : "border-border p-4"
      }`}
    >
      {/* Portrait */}
      <div className="relative shrink-0">
        <div
          className={`overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-card ${
            isLeader ? "h-24 w-24 md:h-28 md:w-28" : "h-16 w-16 md:h-20 md:w-20"
          }`}
          style={{ ["--tw-ring-color" as never]: candidate.color }}
        >
          {candidate.photo ? (
            <img
              src={candidate.photo}
              alt={candidate.name}
              loading="eager"
              width={224}
              height={224}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center font-display text-2xl text-white"
              style={{ backgroundColor: candidate.color }}
            >
              {candidate.name[0]}
            </div>
          )}
        </div>
        {isLeader && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
            Önde
          </span>
        )}
      </div>

      {/* Bar + meta */}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <div
              className={`truncate font-display tracking-wide text-foreground ${
                isLeader ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
              }`}
            >
              {candidate.name.toUpperCase()}
            </div>
            <div
              className={`mt-1 flex items-center gap-2 text-muted-foreground ${
                isLeader ? "text-sm md:text-base" : "text-xs"
              }`}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: candidate.color }}
              />
              <span className="font-semibold">{candidate.party}</span>
              <span>·</span>
              <span className="tabular-nums font-mono">
                {candidate.votes.toLocaleString("tr-TR")} oy
              </span>
            </div>
          </div>
          <CountUp
            to={candidate.percent}
            decimals={1}
            duration={0.9}
            suffix="%"
            className={`tabular-nums font-display ${
              isLeader
                ? "text-5xl text-accent md:text-7xl"
                : "text-4xl text-foreground md:text-5xl"
            }`}
          />
        </div>

        <div
          className={`relative overflow-hidden rounded-full bg-surface-2 ${
            isLeader ? "h-4" : "h-3"
          }`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${candidate.percent}%` }}
            transition={{ duration: 0.9, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ backgroundColor: candidate.color }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-foreground/40"
            title="50% barajı"
          />
        </div>
      </div>
    </div>
  );
}

function OtherBar() {
  const other = CANDIDATES.find((c) => c.id === "other")!;
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface-1 px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: other.color }}
        />
        <span className="font-display text-lg tracking-wide text-muted-foreground">
          DİĞER ADAYLAR
        </span>
      </div>
      <span className="tabular-nums font-display text-2xl text-muted-foreground">
        {other.percent.toFixed(1)}%
      </span>
    </div>
  );
}
