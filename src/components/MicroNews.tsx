import { Link } from "@tanstack/react-router";
import { NEWS } from "@/lib/mock-data";

export function MicroNews({ limit = 4 }: { limit?: number }) {
  const items = NEWS.slice(0, limit);
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-wider text-foreground">SON HABERLER</h2>
        <Link to="/haberler" className="font-mono text-xs text-accent hover:underline">
          Tüm haberler →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {items.map((n) => (
          <Link
            key={n.id}
            to="/haberler/$id"
            params={{ id: n.id }}
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-accent/50"
          >
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 uppercase tracking-wider text-primary">
                {n.category}
              </span>
              <span className="font-mono">{n.time}</span>
            </div>
            <h3 className="text-balance text-base font-semibold leading-snug text-foreground group-hover:text-primary">
              {n.title}
            </h3>
            <p className="mt-3 text-xs font-medium text-muted-foreground">— {n.source}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
