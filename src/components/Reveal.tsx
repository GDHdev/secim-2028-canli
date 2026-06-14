import type { ReactNode } from "react";

/**
 * Reveal — seçim gecesi hızlı tarama için animasyon kaldırıldı.
 * İçeriği olduğu gibi geçirir; tarihsel kullanımları kırmamak için
 * eski API korunur.
 */
export function Reveal({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  delay?: number;
}) {
  const Tag = As as "div";
  return <Tag className={className}>{children}</Tag>;
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
