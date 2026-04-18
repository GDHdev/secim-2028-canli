import { Link } from "@tanstack/react-router";
import { NEWS } from "@/lib/mock-data";

export function MicroNews({ limit = 6 }: { limit?: number }) {
  const [lead, ...rest] = NEWS.slice(0, limit);
  return (
    <section>
      <div className="mb-6 flex items-end justify-between border-b-2 border-foreground pb-2">
        <h2 className="display-lg text-foreground">SON HABERLER</h2>
        <Link to="/haberler" className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent hover:underline">
          Tümü →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.4fr_1fr]">
        {/* Lead story */}
        {lead && (
          <Link
            to="/haberler/$id"
            params={{ id: lead.id }}
            className="group border border-border bg-card p-6 transition-colors hover:border-accent md:p-8"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
              <span className="bg-primary px-2 py-0.5 font-bold text-primary-foreground">{lead.category}</span>
              <span className="text-muted-foreground">{lead.source}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{lead.time}</span>
            </div>
            <h3 className="font-serif mt-4 text-balance text-3xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent md:text-4xl lg:text-5xl">
              {lead.title}
            </h3>
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-muted-foreground">
              {lead.body}
            </p>
            <span className="mt-6 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Devamını oku →
            </span>
          </Link>
        )}

        {/* Right rail */}
        <div className="divide-y divide-border border border-l-0 border-border">
          {rest.map((n) => (
            <Link
              key={n.id}
              to="/haberler/$id"
              params={{ id: n.id }}
              className="group block px-5 py-4 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <span className="text-primary">{n.category}</span>
                <span>·</span>
                <span>{n.time}</span>
              </div>
              <h4 className="font-serif mt-1.5 text-balance text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                {n.title}
              </h4>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">— {n.source}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
