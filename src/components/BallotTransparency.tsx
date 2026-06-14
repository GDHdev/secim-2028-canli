import { motion } from "framer-motion";
import { BALLOT_TRANSPARENCY, fmtTR } from "@/lib/mock-data";
import { ShieldCheck, FileCheck2, Gavel, Eye, AlertOctagon } from "lucide-react";

/**
 * SANDIK ŞEFFAFLIK — açılan sandık, yüklenen tutanak, geçersiz oy, itiraz.
 * Türkiye'de "sandık güvenliği" çok hassas — bu yüzden öne çıkarıyoruz.
 */
export function BallotTransparency() {
  const b = BALLOT_TRANSPARENCY;
  const openedPct = (b.openedBoxes / b.totalBoxes) * 100;
  const uploadedPct = (b.uploadedRecords / b.totalBoxes) * 100;
  const resolvedPct = (b.resolvedObjections / b.objections) * 100;

  const tiles = [
    {
      icon: ShieldCheck,
      label: "Açılan sandık",
      value: `${fmtTR(b.openedBoxes)}`,
      sub: `/ ${fmtTR(b.totalBoxes)} · %${openedPct.toFixed(1)}`,
      bar: openedPct,
      tone: "success" as const,
    },
    {
      icon: FileCheck2,
      label: "Yüklenen tutanak",
      value: `${fmtTR(b.uploadedRecords)}`,
      sub: `%${uploadedPct.toFixed(1)} dijitalleşti`,
      bar: uploadedPct,
      tone: "indigo" as const,
    },
    {
      icon: AlertOctagon,
      label: "Geçersiz oy",
      value: `%${b.invalidRatio.toFixed(2)}`,
      sub: `${fmtTR(b.invalidVotes)} oy`,
      bar: b.invalidRatio * 10,
      tone: "warning" as const,
    },
    {
      icon: Gavel,
      label: "İtirazlar",
      value: `${fmtTR(b.objections)}`,
      sub: `%${resolvedPct.toFixed(0)} sonuçlandı`,
      bar: resolvedPct,
      tone: "gray" as const,
    },
    {
      icon: Eye,
      label: "Sandık gözlemcisi",
      value: `${fmtTR(b.observers)}`,
      sub: "siyasi parti + bağımsız",
      bar: 100,
      tone: "brand" as const,
    },
  ];

  const toneClass: Record<string, { icon: string; bar: string }> = {
    success: { icon: "bg-success-500/10 text-success-600", bar: "bg-success-500" },
    indigo:  { icon: "bg-indigo-50 text-indigo-700",       bar: "bg-indigo-500" },
    warning: { icon: "bg-warning-500/10 text-warning-600", bar: "bg-warning-500" },
    gray:    { icon: "bg-gray-100 text-gray-700",          bar: "bg-gray-500" },
    brand:   { icon: "bg-brand-50 text-brand-700",         bar: "bg-brand-600" },
  };

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-start gap-3 border-b border-gray-200 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Sandık şeffaflığı</h3>
          <p className="text-xs text-gray-500">
            YSK verisi · {fmtTR(b.totalBoxes)} sandık · gerçek zamanlı tutanak akışı.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-px bg-gray-200 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t) => {
          const Icon = t.icon;
          const cls = toneClass[t.tone];
          return (
            <li key={t.label} className="flex flex-col gap-2 bg-white px-4 py-4">
              <div className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-md ${cls.icon}`}>
                  <Icon size={14} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {t.label}
                </span>
              </div>
              <p className="font-display text-2xl font-semibold tabular-nums text-gray-900">
                {t.value}
              </p>
              <p className="text-[11.5px] text-gray-500">{t.sub}</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, t.bar)}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className={`h-full rounded-full ${cls.bar}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
