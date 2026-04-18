import { useEffect, useRef, useState } from "react";

/**
 * Animated counter (odometer style).
 * `to` değişince mevcut değerden tween yapar — sıfırdan başlamaz.
 */
export function CountUp({
  to,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  style,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [val, setVal] = useState(to);
  const currentRef = useRef<number>(to);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const from = currentRef.current; // her zaman SON görüntülenen değer
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      currentRef.current = v;
      setVal(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentRef.current = to;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration]);

  const formatted = decimals > 0
    ? val.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(val).toLocaleString("tr-TR");

  return <span className={className} style={style}>{prefix}{formatted}{suffix}</span>;
}
