import { Link } from "@tanstack/react-router";
import { NEWS } from "@/lib/mock-data";
import { ArrowUpRight } from "lucide-react";

export function MicroNews({ limit = 6 }: { limit?: number }) {
  const [lead, ...rest] = NEWS.slice(0, limit);
  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Son Haberler</h2>
        <Link
          to="/haberler"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
        >
          Tümü <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Lead story */}
        {lead && (
          <Link
            to="/haberler/$id"
            params={{ id: lead.id }}
            className="panel uui-card-hover group block p-6 md:p-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="uui-badge uui-badge-brand">{lead.category}</span>
              <span className="text-sm text-gray-500">{lead.source}</span>
              <span className="text-gray-400">·</span>
              <span className="text-sm text-gray-500">{lead.time}</span>
            </div>
            <h3 className="mt-4 text-balance text-2xl font-semibold leading-tight text-gray-900 transition-colors group-hover:text-brand-700 md:text-3xl lg:text-4xl">
              {lead.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-gray-600">
              {lead.body}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
              Devamını oku <ArrowUpRight size={14} />
            </span>
          </Link>
        )}

        {/* Right rail */}
        <div className="panel divide-y divide-gray-100 overflow-hidden">
          {rest.map((n) => (
            <Link
              key={n.id}
              to="/haberler/$id"
              params={{ id: n.id }}
              className="group block px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="uui-badge uui-badge-gray">{n.category}</span>
                <span className="text-xs tabular-nums text-gray-500">{n.time}</span>
              </div>
              <h4 className="mt-2 text-balance text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-brand-700">
                {n.title}
              </h4>
              <p className="mt-1 text-xs text-gray-500">— {n.source}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
