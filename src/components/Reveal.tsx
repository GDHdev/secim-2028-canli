import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal — opacity-only scroll fade. Seçim gecesi hızlı tarama için
 * transform / parallax YOK.
 */
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

export function Reveal({
  children,
  className,
  as: As = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = As as "div";
    return <Tag className={className}>{children}</Tag>;
  }
  const MotionTag = As === "section" ? motion.section : motion.div;
  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      transition={{ delayChildren: delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemV} className={className}>
      {children}
    </motion.div>
  );
}
