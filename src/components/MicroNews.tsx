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
            className="group rounded-sm border border-border bg-surface-1 p-3 transition-colors hover:border-accent/50 hover:bg-surface-2"
          >
            <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
              <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-primary">{n.category.toUpperCase()}</span>
              <span>{n.time}</span>
            </div>
            <h3 className="text-balance text-sm font-medium text-foreground group-hover:text-accent">{n.title}</h3>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">— {n.source}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
