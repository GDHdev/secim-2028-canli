import { MEGA_STATS } from "@/lib/mock-data";

const toneClass: Record<string, string> = {
  default: "text-foreground",
  primary: "text-primary",
  accent: "text-accent",
  cyan: "text-cyan",
};

export function MegaNumbers() {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-border border-y border-border md:grid-cols-3 md:divide-y-0 lg:grid-cols-6">
      {MEGA_STATS.map((s, i) => (
        <div key={i} className="flex flex-col gap-2 px-5 py-5 md:px-6 md:py-6">
          <span className="eyebrow">{s.label}</span>
          <span className={`font-display text-4xl tracking-tight md:text-5xl ${toneClass[s.tone ?? "default"]}`}>
            {s.value}
          </span>
          {s.sub && (
            <span className="font-mono text-[11px] text-muted-foreground">{s.sub}</span>
          )}
        </div>
      ))}
    </div>
  );
}
