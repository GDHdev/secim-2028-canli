import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET = new Date("2028-04-14T17:00:00+03:00").getTime();

function diff(target: number) {
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s };
}

export function Countdown() {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    setT(diff(TARGET));
    const id = setInterval(() => setT(diff(TARGET)), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: { label: string; value: number }[] = t
    ? [
        { label: "GÜN", value: t.d },
        { label: "SAAT", value: t.h },
        { label: "DAKİKA", value: t.m },
        { label: "SANİYE", value: t.s },
      ]
    : [
        { label: "GÜN", value: 0 },
        { label: "SAAT", value: 0 },
        { label: "DAKİKA", value: 0 },
        { label: "SANİYE", value: 0 },
      ];

  return (
    <div className="panel-flat p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="eyebrow-accent">2. Tur Geri Sayımı</span>
          <p className="mt-1 text-sm font-semibold text-foreground">
            14 Nisan 2028 · Pazar
          </p>
        </div>
        <span className="live-pulse h-2.5 w-2.5 rounded-full bg-primary" />
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="relative overflow-hidden border border-border bg-background px-2 py-3 text-center md:py-4"
          >
            <div className="relative h-12 overflow-hidden md:h-14">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={c.value}
                  initial={{ y: -28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 28, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center font-display text-3xl tabular-nums tracking-tight text-foreground md:text-5xl"
                >
                  {String(c.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-1 font-mono text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
              {c.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
