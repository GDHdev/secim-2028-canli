import { REGION_SNAPSHOT, CANDIDATES } from "@/lib/mock-data";
import { motion } from "framer-motion";

const candColor = (id: "yilmaz" | "kaya" | "demir") =>
  CANDIDATES.find((c) => c.id === id)!.color;
const candName = (id: "yilmaz" | "kaya" | "demir") =>
  CANDIDATES.find((c) => c.id === id)!.name.split(" ")[1].toUpperCase();

export function RegionStrip() {
  return (
    <section className="border-y border-border bg-surface-1">
      <div className="site-container flex items-center justify-between border-b border-border py-3">
        <span className="eyebrow-accent">7 Bölge · Anlık Liderler</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Bölge ortalaması · 1. Tur
        </span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border md:grid-cols-4 md:divide-y-0 lg:grid-cols-7">
        {REGION_SNAPSHOT.map((r, i) => (
          <motion.div
            key={r.region}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="site-container relative py-5"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {r.region}
            </span>
            <p className="mt-2 font-display text-3xl leading-none" style={{ color: candColor(r.leader) }}>
              {candName(r.leader)}
            </p>
            <div className="mt-3 flex h-1.5 overflow-hidden bg-surface-3">
              <div className="h-full" style={{ width: `${r.yilmaz}%`, backgroundColor: candColor("yilmaz") }} />
              <div className="h-full" style={{ width: `${r.kaya}%`, backgroundColor: candColor("kaya") }} />
              <div className="h-full" style={{ width: `${r.demir}%`, backgroundColor: candColor("demir") }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span style={{ color: candColor("yilmaz") }}>%{r.yilmaz}</span>
              <span style={{ color: candColor("kaya") }}>%{r.kaya}</span>
              <span style={{ color: candColor("demir") }}>%{r.demir}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
