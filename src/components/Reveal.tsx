import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal — küçük bir scroll-triggered fade-up + stagger wrapper.
 * Dashboard sayfasında her section'a sarılarak sıralı görünüm sağlar.
 * Animasyon dozu 3: balanced (subtle entrance, no parallax).
 */

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

const itemV: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
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
  const MotionTag = (As === "section" ? motion.section : motion.div);
  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0, margin: "0px 0px -10% 0px" }}
      transition={{ delayChildren: delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemV} className={className}>
      {children}
    </motion.div>
  );
}
