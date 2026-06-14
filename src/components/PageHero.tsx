import type { LucideIcon } from "lucide-react";

export function PageHero({
  icon: Icon,
  kicker,
  title,
  description,
  tone = "brand",
  actions,
}: {
  icon: LucideIcon;
  kicker: string;
  title: React.ReactNode;
  description?: string;
  tone?: "brand" | "indigo" | "violet" | "warning" | "success" | "gray";
  actions?: React.ReactNode;
}) {
  const toneClass = {
    brand: "",
    indigo: "uui-feat-icon-indigo",
    violet: "uui-feat-icon-violet",
    warning: "uui-feat-icon-warning",
    success: "uui-feat-icon-success",
    gray: "uui-feat-icon-gray",
  }[tone];

  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="site-container py-8 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-3">
            <span className={`uui-feat-icon uui-feat-icon-lg ${toneClass}`}>
              <Icon size={22} />
            </span>
            <div className="min-w-0">
              <p className="uui-sec-eyebrow">{kicker}</p>
              <h1 className="mt-1 uui-sec-title">{title}</h1>
              {description && (
                <p className="mt-2 uui-sec-desc max-w-2xl">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

export function SubSectionHeader({
  icon: Icon,
  kicker,
  title,
  meta,
  tone = "brand",
}: {
  icon: LucideIcon;
  kicker?: string;
  title: string;
  meta?: string;
  tone?: "brand" | "indigo" | "violet" | "warning" | "success" | "gray";
}) {
  const toneClass = {
    brand: "",
    indigo: "uui-feat-icon-indigo",
    violet: "uui-feat-icon-violet",
    warning: "uui-feat-icon-warning",
    success: "uui-feat-icon-success",
    gray: "uui-feat-icon-gray",
  }[tone];

  return (
    <div className="mb-5 flex items-start gap-3">
      <span className={`uui-feat-icon ${toneClass}`}>
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        {kicker && <p className="uui-sec-eyebrow">{kicker}</p>}
        <h2 className="mt-0.5 font-display text-[1.375rem] font-bold tracking-tight text-gray-900 md:text-[1.5rem]">
          {title}
        </h2>
        {meta && <p className="mt-1 text-[14px] text-gray-500">{meta}</p>}
      </div>
    </div>
  );
}
