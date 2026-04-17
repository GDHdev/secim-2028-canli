import { motion } from "framer-motion";
import { CANDIDATES, SECOND_ROUND_TRIGGERED } from "@/lib/mock-data";
import { CountUp } from "./CountUp";

export function CandidateRace() {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-wider text-foreground md:text-3xl">
          CUMHURBAŞKANLIĞI YARIŞI
        </h2>
        <span className="font-mono text-xs text-muted-foreground">1. TUR</span>
      </div>

      <div className="space-y-2.5">
        {CANDIDATES.map((c, i) => (
          <CandidateBar key={c.id} candidate={c} index={i} />
        ))}
      </div>

      {SECOND_ROUND_TRIGGERED && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="gold-pulse mt-4 flex items-center justify-between rounded-sm border border-accent/40 bg-accent/10 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl text-accent md:text-3xl">2. TUR KESİNLEŞTİ</span>
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
              Hiçbir aday %50 barajını geçemedi
            </span>
          </div>
          <span className="font-mono text-xs text-accent">14 NİSAN 2028</span>
        </motion.div>
      )}
    </div>
  );
}

function CandidateBar({ candidate, index }: { candidate: typeof CANDIDATES[number]; index: number }) {
  const isLeader = index === 0;
  return (
    <div className="rounded-sm border border-border bg-surface-1 p-3 transition-colors hover:border-muted-foreground/40">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-2">
          {isLeader && (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 font-display text-xs tracking-wider text-accent-foreground">
              ÖNDE
            </span>
          )}
          <span className="font-display text-xl tracking-wide text-foreground md:text-2xl">
            {candidate.name.toUpperCase()}
          </span>
          <span className="font-mono text-xs text-muted-foreground">· {candidate.party}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <CountUp
            to={candidate.percent}
            decimals={1}
            duration={0.9}
            suffix="%"
            className={`font-display text-3xl md:text-4xl ${isLeader ? "text-accent" : "text-foreground"}`}
          />
        </div>
      </div>

      <div className="relative h-3 overflow-hidden rounded-sm bg-surface-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${candidate.percent}%` }}
          transition={{ duration: 0.9, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ backgroundColor: candidate.color }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-foreground/30"
          title="50% barajı"
        />
      </div>

      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
        <span>{candidate.votes.toLocaleString("tr-TR")} oy</span>
        <span>50% barajı</span>
      </div>
    </div>
  );
}
