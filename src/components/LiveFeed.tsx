import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LIVE_FEED, type FeedItem } from "@/lib/mock-data";

const newMessages: Omit<FeedItem, "id">[] = [
  { time: "22:18", text: "İzmir kesinleşti: Kaya (%50.3)", kind: "decisive" },
  { time: "22:21", text: "Bursa %85 sayıldı, Yılmaz farkı koruyor", kind: "info" },
  { time: "22:24", text: "Toplam sayım %75'i geçti", kind: "breaking" },
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
    <div className="panel flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="live-pulse inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="eyebrow-accent">Canlı Akış</span>
        </div>
        <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.16em] text-muted-foreground">
          {items.length} olay
        </span>
      </div>
      <div className="max-h-[640px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex items-start gap-3 border-b border-border/60 px-5 py-3 text-sm transition-colors hover:bg-surface-2 ${kindBg(item.kind)}`}
            >
              <div className={`mt-1 h-full w-[3px] shrink-0 self-stretch ${kindBar(item.kind)}`} />
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="tabular-nums font-mono text-[10px] font-semibold text-muted-foreground">
                    {item.time}
                  </span>
                  {item.kind !== "info" && (
                    <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.18em] ${kindLabel(item.kind)}`}>
                      {labelFor(item.kind)}
                    </span>
                  )}
                </div>
                <p className="leading-snug text-foreground">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function labelFor(k: FeedItem["kind"]) {
  return { breaking: "Son Dakika", decisive: "Kesinleşti", leader: "Lider Değişti", info: "" }[k];
}
function kindBg(k: FeedItem["kind"]) {
  return k === "breaking" ? "bg-primary/[0.04]" : k === "decisive" ? "bg-accent/[0.04]" : "";
}
function kindBar(k: FeedItem["kind"]) {
  return k === "breaking" ? "bg-primary" : k === "decisive" ? "bg-accent" : k === "leader" ? "bg-cyan" : "bg-border";
}
function kindLabel(k: FeedItem["kind"]) {
  return k === "breaking" ? "text-primary" : k === "decisive" ? "text-accent" : k === "leader" ? "text-cyan" : "text-muted-foreground";
}
