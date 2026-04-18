import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LIVE_FEED, type FeedItem } from "@/lib/mock-data";

const newMessages: Omit<FeedItem, "id">[] = [
  { time: "22:18", text: "İzmir kesinleşti: Kaya (%50.3)", kind: "decisive" },
  { time: "22:21", text: "Bursa %85 sayıldı, Yılmaz farkı koruyor", kind: "info" },
  { time: "22:24", text: "🔴 Toplam sayım %75'i geçti", kind: "breaking" },
  { time: "22:27", text: "Antalya'da Kaya %45 ile öne geçti", kind: "leader" },
  { time: "22:30", text: "Adana kesinleşti: Kaya (%43)", kind: "decisive" },
];

export function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>(LIVE_FEED);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i >= newMessages.length) return;
      const next: FeedItem = { ...newMessages[i], id: 1000 + i };
      setItems((prev) => [next, ...prev]);
      i += 1;
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="live-pulse inline-block h-2.5 w-2.5 rounded-full bg-primary" />
          <h2 className="font-display text-xl tracking-wider text-foreground md:text-2xl">CANLI AKIŞ</h2>
        </div>
        <span className="tabular-nums font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {items.length} güncelleme
        </span>
      </div>
      <div className="max-h-[600px] overflow-y-auto p-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`mb-1 flex items-start gap-3 rounded-md border-l-[3px] px-3 py-2.5 text-sm transition-colors hover:bg-surface-1 ${kindStyle(item.kind)}`}
            >
              <span className="tabular-nums mt-0.5 font-mono text-xs font-semibold text-muted-foreground">
                {item.time}
              </span>
              <span className="flex-1 leading-relaxed text-foreground">{item.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function kindStyle(kind: FeedItem["kind"]) {
  switch (kind) {
    case "breaking": return "border-primary bg-primary/5";
    case "decisive": return "border-accent bg-accent/5";
    case "leader": return "border-cand-kaya/60";
    default: return "border-border";
  }
}
