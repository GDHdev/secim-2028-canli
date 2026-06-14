import type { PollOption } from "@/components/SitePoll";

export type SitePollDef = {
  id: string;
  question: string;
  kicker: string;
  options: PollOption[];
};

const C = {
  yilmaz: "#F4C20D",
  kaya: "#E11D2B",
  demir: "#0891B2",
  other: "#6B7280",
  brand: "var(--color-brand-600)",
  violet: "var(--color-violet-600)",
  warning: "var(--color-warning-600)",
  success: "var(--color-success-600)",
};

export const SITE_POLLS: SitePollDef[] = [
  {
    id: "2tur-kim",
    kicker: "Cumhurbaşkanlığı · 2. Tur",
    question: "2. turda hangi aday kazanır?",
    options: [
      { id: "yilmaz", label: "Mehmet Yılmaz (UBP)", base: 12_840, color: C.yilmaz },
      { id: "kaya", label: "Ayşe Kaya (HSP)", base: 11_220, color: C.kaya },
      { id: "kararsiz", label: "Henüz kararsızım", base: 2_140, color: C.other },
    ],
  },
  {
    id: "en-onemli-gundem",
    kicker: "Seçmen gündemi",
    question: "Oy verirken sizin için en belirleyici konu hangisi?",
    options: [
      { id: "ekonomi", label: "Ekonomi ve geçim", base: 18_400, color: C.warning },
      { id: "egitim", label: "Eğitim", base: 5_800, color: C.violet },
      { id: "adalet", label: "Adalet ve hukuk", base: 7_900, color: C.brand },
      { id: "dis", label: "Dış politika", base: 3_100, color: C.demir },
    ],
  },
  {
    id: "koalisyon",
    kicker: "Meclis · 600 sandalye",
    question: "Hangi koalisyon ülke için daha iyi olur?",
    options: [
      { id: "ubp-yyh", label: "UBP + Yeni Yol Hareketi", base: 9_300, color: C.yilmaz },
      { id: "hsp-yyh", label: "HSP + Yeni Yol Hareketi", base: 8_700, color: C.kaya },
      { id: "buyuk", label: "Geniş tabanlı uzlaşı hükümeti", base: 6_200, color: C.success },
      { id: "azinlik", label: "Azınlık hükümeti / erken seçim", base: 2_400, color: C.other },
    ],
  },
  {
    id: "katilim",
    kicker: "Katılım",
    question: "Oy kullanacak mısınız?",
    options: [
      { id: "evet", label: "Evet, kesinlikle", base: 21_300, color: C.success },
      { id: "muhtemel", label: "Muhtemelen evet", base: 4_900, color: C.warning },
      { id: "kararsiz", label: "Kararsızım", base: 1_800, color: C.other },
      { id: "hayir", label: "Hayır", base: 900, color: C.kaya },
    ],
  },
];

export const FEATURED_POLL_ID = "2tur-kim";

export function getPoll(id: string) {
  return SITE_POLLS.find((p) => p.id === id);
}
