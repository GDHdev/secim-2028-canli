import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LIVE_FEED, type FeedItem } from "@/lib/mock-data";
import { Zap, CheckCircle2, ArrowUpRight, Info } from "lucide-react";

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
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="uui-badge uui-badge-error uui-badge-live">Canlı Akış</span>
        </div>
        <span className="text-xs tabular-nums text-gray-500">{items.length} olay</span>
      </div>
      <div className="max-h-[640px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = iconFor(item.kind);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group flex items-start gap-3 border-b border-gray-100 px-5 py-3 transition-colors last:border-b-0 hover:bg-gray-50"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${kindIconBg(item.kind)}`}
                >
                  <Icon size={14} className={kindIconColor(item.kind)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium tabular-nums text-gray-500">
                      {item.time}
                    </span>
                    {item.kind !== "info" && (
                      <span className={`uui-badge text-[11px] ${kindBadge(item.kind)}`}>
                        {labelFor(item.kind)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-snug text-gray-900">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function labelFor(k: FeedItem["kind"]) {
  return { breaking: "Son Dakika", decisive: "Kesinleşti", leader: "Lider Değişti", info: "" }[k];
}
function iconFor(k: FeedItem["kind"]) {
  return k === "breaking" ? Zap : k === "decisive" ? CheckCircle2 : k === "leader" ? ArrowUpRight : Info;
}
function kindIconBg(k: FeedItem["kind"]) {
  return k === "breaking"
    ? "bg-brand-50"
    : k === "decisive"
    ? "bg-success-500/10"
    : k === "leader"
    ? "bg-indigo-50"
    : "bg-gray-100";
}
function kindIconColor(k: FeedItem["kind"]) {
  return k === "breaking"
    ? "text-brand-700"
    : k === "decisive"
    ? "text-success-600"
    : k === "leader"
    ? "text-indigo-700"
    : "text-gray-500";
}
function kindBadge(k: FeedItem["kind"]) {
  return k === "breaking"
    ? "uui-badge-brand"
    : k === "decisive"
    ? "uui-badge-success"
    : k === "leader"
    ? "uui-badge-indigo"
    : "uui-badge-gray";
}
