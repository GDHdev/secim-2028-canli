import { useEffect, useRef, useState } from "react";

/** Animated counter (odometer style) */
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
  const [val, setVal] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = ref.current;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      setVal(v);
      if (t < 1) raf = requestAnimationFrame(tick);
      else ref.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  const formatted = decimals > 0
    ? val.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(val).toLocaleString("tr-TR");

  return <span className={className} style={style}>{prefix}{formatted}{suffix}</span>;
}
