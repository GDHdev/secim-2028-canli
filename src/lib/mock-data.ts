// Mock election data for Seçim 2028
// Presidential + Parliamentary, 81 provinces, live feed, polls, news

import yilmazPhoto from "@/assets/cand-yilmaz.jpg";
import kayaPhoto from "@/assets/cand-kaya.jpg";
import demirPhoto from "@/assets/cand-demir.jpg";

export type Candidate = {
  id: "yilmaz" | "kaya" | "demir" | "other";
  name: string;
  party: string;
  color: string;
  cssVar: string;
  percent: number;
  votes: number;
  photo?: string;
};

export const TOTAL_VOTERS = 64_100_000;
export const COUNTED_VOTES = 47_800_000;
export const COUNT_PERCENT = (COUNTED_VOTES / TOTAL_VOTERS) * 100; // ~74.6

export const CANDIDATES: Candidate[] = [
  { id: "yilmaz", name: "Mehmet Yılmaz", party: "Ulusal Birlik Partisi",   color: "#F4C20D", cssVar: "cand-yilmaz", percent: 38.2, votes: Math.round(COUNTED_VOTES * 0.382), photo: yilmazPhoto },
  { id: "kaya",   name: "Ayşe Kaya",     party: "Halkın Sesi Partisi",      color: "#E11D2B", cssVar: "cand-kaya",   percent: 31.7, votes: Math.round(COUNTED_VOTES * 0.317), photo: kayaPhoto },
  { id: "demir",  name: "Can Demir",     party: "Yeni Yol Hareketi",        color: "#0891B2", cssVar: "cand-demir",  percent: 22.4, votes: Math.round(COUNTED_VOTES * 0.224), photo: demirPhoto },
  { id: "other",  name: "Diğer",         party: "Bağımsız",                 color: "#6B7280", cssVar: "cand-other",  percent: 7.7,  votes: Math.round(COUNTED_VOTES * 0.077) },
];

export const SECOND_ROUND_PROBABILITY = 73; // %
export const SECOND_ROUND_TRIGGERED = true; // no candidate >50%

// 7 geographic regions of Turkey
export const REGIONS = [
  "Marmara", "İç Anadolu", "Ege", "Akdeniz",
  "Karadeniz", "Doğu Anadolu", "Güneydoğu Anadolu",
] as const;
export type Region = typeof REGIONS[number];

export type Province = {
  id: string; // url slug
  name: string;
  region: Region;
  population: number;
  results: { yilmaz: number; kaya: number; demir: number; other: number };
  counted: number; // % counted
  turnout: number; // % turnout
  turnout2023: number;
  leader: "yilmaz" | "kaya" | "demir";
};

// Helper to make a province with normalized results
const mk = (
  id: string, name: string, region: Region, pop: number,
  y: number, k: number, d: number, counted: number, turnout: number, turnout2023: number,
): Province => {
  const total = y + k + d;
  const remainder = Math.max(0, 100 - total);
  const results = { yilmaz: y, kaya: k, demir: d, other: remainder };
  const leader = (["yilmaz", "kaya", "demir"] as const).reduce((a, b) =>
    results[a] >= results[b] ? a : b
  );
  return { id, name, region, population: pop, results, counted, turnout, turnout2023, leader };
};

export const PROVINCES: Province[] = [
  // Marmara
  mk("istanbul", "İstanbul", "Marmara", 15840000, 44, 32, 17, 80, 84, 86),
  mk("bursa", "Bursa", "Marmara", 3194000, 41, 30, 22, 78, 86, 87),
  mk("kocaeli", "Kocaeli", "Marmara", 2079000, 39, 33, 21, 76, 85, 86),
  mk("tekirdag", "Tekirdağ", "Marmara", 1142000, 35, 38, 20, 72, 83, 85),
  mk("balikesir", "Balıkesir", "Marmara", 1257000, 40, 32, 21, 74, 84, 85),
  mk("canakkale", "Çanakkale", "Marmara", 565000, 30, 41, 22, 70, 85, 86),
  mk("edirne", "Edirne", "Marmara", 414000, 28, 44, 21, 75, 86, 87),
  mk("kirklareli", "Kırklareli", "Marmara", 369000, 30, 42, 21, 73, 85, 86),
  mk("yalova", "Yalova", "Marmara", 296000, 38, 35, 21, 71, 84, 85),
  mk("sakarya", "Sakarya", "Marmara", 1080000, 49, 25, 19, 77, 85, 86),
  mk("bilecik", "Bilecik", "Marmara", 228000, 42, 30, 20, 73, 84, 85),

  // İç Anadolu
  mk("ankara", "Ankara", "İç Anadolu", 5747000, 43, 30, 21, 100, 87, 88),
  mk("konya", "Konya", "İç Anadolu", 2310000, 56, 18, 19, 75, 84, 85),
  mk("kayseri", "Kayseri", "İç Anadolu", 1442000, 51, 22, 20, 76, 85, 86),
  mk("eskisehir", "Eskişehir", "İç Anadolu", 906000, 28, 44, 22, 78, 86, 87),
  mk("sivas", "Sivas", "İç Anadolu", 644000, 48, 24, 21, 72, 83, 84),
  mk("aksaray", "Aksaray", "İç Anadolu", 433000, 52, 21, 20, 70, 82, 83),
  mk("nigde", "Niğde", "İç Anadolu", 365000, 47, 25, 21, 71, 82, 84),
  mk("nevsehir", "Nevşehir", "İç Anadolu", 308000, 49, 24, 20, 73, 84, 85),
  mk("kirikkale", "Kırıkkale", "İç Anadolu", 277000, 45, 27, 21, 72, 83, 84),
  mk("yozgat", "Yozgat", "İç Anadolu", 421000, 50, 23, 20, 70, 82, 83),
  mk("kirsehir", "Kırşehir", "İç Anadolu", 242000, 41, 31, 21, 71, 83, 84),
  mk("karaman", "Karaman", "İç Anadolu", 257000, 50, 22, 21, 72, 84, 85),
  mk("cankiri", "Çankırı", "İç Anadolu", 196000, 47, 26, 20, 69, 82, 83),

  // Ege
  mk("izmir", "İzmir", "Ege", 4426000, 24, 50, 21, 73, 87, 88),
  mk("manisa", "Manisa", "Ege", 1468000, 38, 33, 22, 71, 84, 85),
  mk("aydin", "Aydın", "Ege", 1149000, 30, 41, 22, 70, 85, 86),
  mk("denizli", "Denizli", "Ege", 1056000, 39, 32, 22, 73, 85, 86),
  mk("mugla", "Muğla", "Ege", 1048000, 28, 43, 22, 72, 86, 87),
  mk("kutahya", "Kütahya", "Ege", 583000, 44, 28, 21, 71, 83, 84),
  mk("afyonkarahisar", "Afyonkarahisar", "Ege", 747000, 43, 29, 21, 70, 83, 84),
  mk("usak", "Uşak", "Ege", 374000, 41, 30, 22, 71, 84, 85),

  // Akdeniz
  mk("antalya", "Antalya", "Akdeniz", 2696000, 27, 45, 22, 72, 86, 87),
  mk("mersin", "Mersin", "Akdeniz", 1916000, 26, 44, 23, 71, 85, 86),
  mk("adana", "Adana", "Akdeniz", 2274000, 28, 43, 22, 70, 85, 86),
  mk("hatay", "Hatay", "Akdeniz", 1659000, 33, 39, 21, 69, 83, 85),
  mk("kahramanmaras", "Kahramanmaraş", "Akdeniz", 1177000, 53, 19, 21, 72, 84, 85),
  mk("osmaniye", "Osmaniye", "Akdeniz", 559000, 48, 24, 21, 70, 83, 84),
  mk("burdur", "Burdur", "Akdeniz", 273000, 38, 33, 22, 71, 84, 85),
  mk("isparta", "Isparta", "Akdeniz", 444000, 41, 30, 22, 72, 84, 85),

  // Karadeniz
  mk("samsun", "Samsun", "Karadeniz", 1368000, 44, 28, 21, 72, 84, 85),
  mk("trabzon", "Trabzon", "Karadeniz", 818000, 48, 24, 21, 73, 84, 85),
  mk("ordu", "Ordu", "Karadeniz", 763000, 46, 26, 21, 71, 83, 84),
  mk("giresun", "Giresun", "Karadeniz", 449000, 42, 30, 21, 71, 83, 84),
  mk("rize", "Rize", "Karadeniz", 348000, 51, 21, 21, 73, 84, 85),
  mk("artvin", "Artvin", "Karadeniz", 169000, 39, 33, 21, 71, 84, 85),
  mk("zonguldak", "Zonguldak", "Karadeniz", 591000, 35, 37, 21, 70, 83, 84),
  mk("bartin", "Bartın", "Karadeniz", 200000, 40, 31, 22, 70, 83, 84),
  mk("karabuk", "Karabük", "Karadeniz", 252000, 43, 29, 21, 71, 83, 84),
  mk("kastamonu", "Kastamonu", "Karadeniz", 380000, 46, 26, 21, 70, 82, 84),
  mk("sinop", "Sinop", "Karadeniz", 218000, 41, 31, 21, 70, 83, 84),
  mk("amasya", "Amasya", "Karadeniz", 339000, 43, 29, 21, 71, 83, 84),
  mk("tokat", "Tokat", "Karadeniz", 596000, 45, 27, 21, 70, 82, 84),
  mk("corum", "Çorum", "Karadeniz", 524000, 44, 28, 21, 70, 82, 84),
  mk("bayburt", "Bayburt", "Karadeniz", 81000, 50, 22, 21, 68, 81, 83),
  mk("gumushane", "Gümüşhane", "Karadeniz", 144000, 47, 25, 21, 69, 81, 83),

  // Doğu Anadolu
  mk("erzurum", "Erzurum", "Doğu Anadolu", 762000, 49, 23, 21, 70, 82, 84),
  mk("malatya", "Malatya", "Doğu Anadolu", 813000, 46, 26, 21, 70, 82, 83),
  mk("elazig", "Elazığ", "Doğu Anadolu", 591000, 47, 25, 21, 70, 82, 84),
  mk("van", "Van", "Doğu Anadolu", 1129000, 18, 22, 56, 68, 82, 84),
  mk("agri", "Ağrı", "Doğu Anadolu", 511000, 22, 24, 49, 67, 81, 83),
  mk("kars", "Kars", "Doğu Anadolu", 274000, 32, 38, 24, 68, 82, 83),
  mk("ardahan", "Ardahan", "Doğu Anadolu", 96000, 30, 41, 22, 68, 82, 83),
  mk("igdir", "Iğdır", "Doğu Anadolu", 203000, 27, 30, 38, 68, 82, 83),
  mk("mus", "Muş", "Doğu Anadolu", 405000, 20, 23, 52, 67, 81, 83),
  mk("bitlis", "Bitlis", "Doğu Anadolu", 354000, 22, 24, 49, 67, 81, 83),
  mk("hakkari", "Hakkari", "Doğu Anadolu", 281000, 16, 18, 60, 65, 80, 82),
  mk("erzincan", "Erzincan", "Doğu Anadolu", 233000, 41, 31, 22, 69, 82, 83),
  mk("bingol", "Bingöl", "Doğu Anadolu", 280000, 38, 26, 30, 68, 81, 83),
  mk("tunceli", "Tunceli", "Doğu Anadolu", 84000, 19, 36, 39, 70, 84, 85),

  // Güneydoğu Anadolu
  mk("gaziantep", "Gaziantep", "Güneydoğu Anadolu", 2154000, 42, 27, 26, 70, 84, 85),
  mk("sanliurfa", "Şanlıurfa", "Güneydoğu Anadolu", 2143000, 36, 22, 36, 68, 82, 84),
  mk("diyarbakir", "Diyarbakır", "Güneydoğu Anadolu", 1818000, 16, 19, 60, 67, 81, 83),
  mk("mardin", "Mardin", "Güneydoğu Anadolu", 870000, 21, 22, 52, 67, 81, 83),
  mk("batman", "Batman", "Güneydoğu Anadolu", 638000, 18, 20, 57, 66, 81, 83),
  mk("siirt", "Siirt", "Güneydoğu Anadolu", 333000, 24, 22, 49, 66, 80, 82),
  mk("sirnak", "Şırnak", "Güneydoğu Anadolu", 545000, 17, 19, 59, 65, 80, 82),
  mk("kilis", "Kilis", "Güneydoğu Anadolu", 147000, 44, 27, 24, 68, 82, 84),
  mk("adiyaman", "Adıyaman", "Güneydoğu Anadolu", 626000, 41, 28, 26, 70, 82, 84),

  // Bolu, Düzce
  mk("bolu", "Bolu", "Karadeniz", 322000, 42, 30, 22, 71, 84, 85),
  mk("duzce", "Düzce", "Karadeniz", 410000, 44, 28, 22, 70, 83, 84),
];

// Sanity: ensure 81
// console.log(PROVINCES.length);

// Live feed
export type FeedItem = { id: number; time: string; text: string; kind: "info" | "leader" | "decisive" | "breaking" };

export const LIVE_FEED: FeedItem[] = [
  { id: 1, time: "22:14", text: "İstanbul %80 sayıldı, Kaya önde (%42.1)", kind: "info" },
  { id: 2, time: "22:08", text: "Ankara kesinleşti: Kaya kazandı (%38.2)", kind: "decisive" },
  { id: 3, time: "22:05", text: "İzmir'de Kaya açık ara önde (%50.3)", kind: "leader" },
  { id: 4, time: "22:01", text: "🔴 Konya'da Yılmaz büyük farkla önde (%56.1)", kind: "breaking" },
  { id: 5, time: "21:58", text: "Bursa'da yarış kızıştı: Yılmaz %41, Kaya %30", kind: "info" },
  { id: 6, time: "21:54", text: "Diyarbakır'da Demir liderliği aldı (%60.2)", kind: "leader" },
  { id: 7, time: "21:50", text: "Antalya %70 sayıldı, Kaya önde", kind: "info" },
  { id: 8, time: "21:45", text: "🔴 2. tur ihtimali %73'e yükseldi", kind: "breaking" },
  { id: 9, time: "21:41", text: "Kayseri'de Yılmaz %51 ile lider", kind: "leader" },
  { id: 10, time: "21:37", text: "Eskişehir'de Kaya farkı açıyor (%44)", kind: "info" },
  { id: 11, time: "21:33", text: "Trabzon kesinleşti: Yılmaz (%48)", kind: "decisive" },
  { id: 12, time: "21:28", text: "Adana'da Kaya önde (%43)", kind: "info" },
  { id: 13, time: "21:24", text: "Mardin'de Demir liderliği koruyor", kind: "info" },
  { id: 14, time: "21:20", text: "🔴 YSK: Toplam katılım %86.2 — rekor seviye", kind: "breaking" },
  { id: 15, time: "21:15", text: "Gaziantep'te Yılmaz %42 ile önde", kind: "leader" },
  { id: 16, time: "21:10", text: "Mersin %65 sayıldı, Kaya önde", kind: "info" },
  { id: 17, time: "21:05", text: "Hakkari'de Demir %60 ile lider", kind: "leader" },
  { id: 18, time: "21:01", text: "Samsun'da Yılmaz farkı koruyor (%44)", kind: "info" },
  { id: 19, time: "20:58", text: "Manisa %50 sayıldı: Yılmaz %38, Kaya %33", kind: "info" },
  { id: 20, time: "20:54", text: "🔴 İlk tur sonuçları belirginleşiyor", kind: "breaking" },
  { id: 21, time: "20:50", text: "Sakarya kesinleşti: Yılmaz (%49)", kind: "decisive" },
  { id: 22, time: "20:45", text: "Denizli'de yarış başa baş", kind: "info" },
  { id: 23, time: "20:40", text: "Tekirdağ %60 sayıldı, Kaya önde", kind: "info" },
  { id: 24, time: "20:35", text: "Van'da Demir açık ara lider (%56)", kind: "leader" },
  { id: 25, time: "20:30", text: "Sandıklar tüm Türkiye'de kapandı", kind: "breaking" },
  { id: 26, time: "20:25", text: "Muğla'da ilk eğilim Kaya yönünde", kind: "info" },
  { id: 27, time: "20:20", text: "İlk sonuçlar geliyor: Yılmaz %39", kind: "info" },
  { id: 28, time: "20:15", text: "🔴 Doğuda sandıklar kapandı", kind: "breaking" },
  { id: 29, time: "20:10", text: "Şanlıurfa: ilk eğilim Yılmaz lehine", kind: "info" },
  { id: 30, time: "20:05", text: "Sayım başladı — ilk veriler bekleniyor", kind: "breaking" },
];

// Polls (18 months, monthly snapshots)
export type Poll = { date: string; yilmaz: number; kaya: number; demir: number; undecided: number };

const pollMonths = [
  "2026-10", "2026-11", "2026-12",
  "2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06",
  "2027-07", "2027-08", "2027-09", "2027-10", "2027-11", "2027-12",
  "2028-01", "2028-02", "2028-03",
];

export const POLLS: Poll[] = pollMonths.map((m, i) => {
  const t = i / (pollMonths.length - 1);
  const yilmaz = 32 + t * 7 + Math.sin(i * 0.7) * 1.5;
  const kaya = 36 - t * 5 + Math.cos(i * 0.6) * 1.8;
  const demir = 18 + t * 5 + Math.sin(i * 0.9) * 1.2;
  const undecided = 100 - yilmaz - kaya - demir;
  return {
    date: m,
    yilmaz: +yilmaz.toFixed(1),
    kaya: +kaya.toFixed(1),
    demir: +demir.toFixed(1),
    undecided: +undecided.toFixed(1),
  };
});

export type PollFirm = { firm: string; date: string; yilmaz: number; kaya: number; demir: number; undecided: number };

export const POLL_FIRMS: PollFirm[] = [
  { firm: "Konda",       date: "2028-03-14", yilmaz: 38.1, kaya: 32.4, demir: 22.0, undecided: 7.5 },
  { firm: "Metropoll",   date: "2028-03-12", yilmaz: 37.8, kaya: 31.9, demir: 22.6, undecided: 7.7 },
  { firm: "ORC",         date: "2028-03-10", yilmaz: 39.2, kaya: 30.8, demir: 21.8, undecided: 8.2 },
  { firm: "Optimar",     date: "2028-03-08", yilmaz: 38.6, kaya: 31.2, demir: 22.1, undecided: 8.1 },
  { firm: "MAK",         date: "2028-03-05", yilmaz: 39.0, kaya: 30.5, demir: 22.4, undecided: 8.1 },
  { firm: "Areda",       date: "2028-03-03", yilmaz: 38.4, kaya: 31.6, demir: 22.0, undecided: 8.0 },
  { firm: "PIAR",        date: "2028-03-01", yilmaz: 37.5, kaya: 32.8, demir: 21.9, undecided: 7.8 },
  { firm: "Konsensus",   date: "2028-02-26", yilmaz: 37.9, kaya: 32.2, demir: 22.1, undecided: 7.8 },
  { firm: "Avrasya",     date: "2028-02-22", yilmaz: 38.7, kaya: 31.1, demir: 22.3, undecided: 7.9 },
  { firm: "Saros",       date: "2028-02-20", yilmaz: 38.2, kaya: 31.7, demir: 22.4, undecided: 7.7 },
];

// Turnout by region
export const TURNOUT_BY_REGION = REGIONS.map((r) => {
  const ps = PROVINCES.filter((p) => p.region === r);
  const avg = ps.reduce((s, p) => s + p.turnout, 0) / ps.length;
  const avg23 = ps.reduce((s, p) => s + p.turnout2023, 0) / ps.length;
  return { region: r, turnout: +avg.toFixed(1), turnout2023: +avg23.toFixed(1) };
});

// Historical comparison 2023 vs 2028 (mock)
export const HISTORICAL = [
  { name: "Yılmaz",  y2023: 35.2, y2028: 38.2 },
  { name: "Kaya",    y2023: 33.1, y2028: 31.7 },
  { name: "Demir",   y2023: 18.5, y2028: 22.4 },
  { name: "Diğer",   y2023: 13.2, y2028: 7.7 },
];

// Top 5 cities
export const TOP_CITIES = ["istanbul", "ankara", "izmir", "bursa", "antalya"]
  .map((id) => PROVINCES.find((p) => p.id === id)!)
  .filter(Boolean);

// News
export type NewsCategory = "Seçim" | "Sonuçlar" | "Analiz";
export type NewsItem = {
  id: string;
  title: string;
  source: string;
  category: NewsCategory;
  time: string;
  body: string;
};

export const NEWS: NewsItem[] = [
  { id: "n1",  title: "Sandıklar kapandı: Türkiye sonucu bekliyor", source: "Anadolu Ajansı", category: "Seçim", time: "20:30", body: "Türkiye genelinde sandıklar saat 17:00 itibarıyla doğuda, 20:00'de batıda kapandı. YSK Başkanı, sayım sürecinin sorunsuz başladığını açıkladı. İlk eğilimler önümüzdeki saatlerde netleşmesi bekleniyor. 64 milyondan fazla seçmenin oy kullandığı seçimde, ilk verilere göre katılım oranı %86 seviyelerinde." },
  { id: "n2",  title: "Yılmaz ilk turda %38 seviyesinde", source: "Reuters", category: "Sonuçlar", time: "21:45", body: "Sayılan oyların yarısından fazlasına göre Mehmet Yılmaz %38.2 ile lider konumda. Ayşe Kaya %31.7 ile ikinci sırada yer alıyor. Can Demir %22.4 ile üçüncü. Sonuçlar ikinci turun kaçınılmaz olduğunu gösteriyor." },
  { id: "n3",  title: "2. tur ihtimali %73'e yükseldi", source: "BBC Türkçe", category: "Analiz", time: "21:50", body: "Mevcut sayım hızı ve coğrafi dağılım dikkate alındığında, hiçbir adayın ilk turda %50 barajını aşamayacağı projeksiyonu güçleniyor. Anketçi şirketler, 2. tur ihtimalini %73 olarak hesaplıyor." },
  { id: "n4",  title: "İstanbul'da Kaya önde", source: "Hürriyet", category: "Sonuçlar", time: "22:14", body: "İstanbul'da sayılan oyların %80'ine göre Ayşe Kaya %42.1 ile önde. Mehmet Yılmaz %32, Can Demir %19 oy aldı. İstanbul sonucu seçimin geneli için kritik öneme sahip." },
  { id: "n5",  title: "Doğuda Demir farkı açıyor", source: "DW Türkçe", category: "Sonuçlar", time: "22:00", body: "Güneydoğu ve Doğu Anadolu'da Can Demir, beklendiği gibi açık farkla önde. Diyarbakır, Hakkari ve Van'da %55 üzerinde oy aldı." },
  { id: "n6",  title: "Konya'da Yılmaz domine ediyor", source: "Sabah", category: "Sonuçlar", time: "22:01", body: "İç Anadolu'nun kalbi Konya'da Mehmet Yılmaz %56 oy oranıyla mutlak üstünlük sağlıyor. Kayseri, Aksaray ve Yozgat'ta da benzer tablo görülüyor." },
  { id: "n7",  title: "Katılım %86 ile rekor", source: "Anadolu Ajansı", category: "Seçim", time: "21:20", body: "YSK verilerine göre 2028 seçimlerinde katılım oranı %86.2 seviyesinde. Bu rakam Cumhuriyet tarihinin en yüksek katılım oranlarından biri." },
  { id: "n8",  title: "Demir: 'Mücadeleye devam'", source: "Cumhuriyet", category: "Seçim", time: "22:30", body: "Üçüncü sırada görünen Can Demir, sosyal medya hesabından yaptığı paylaşımda destekçilerine teşekkür etti ve mücadelenin süreceğini belirtti." },
  { id: "n9",  title: "Borsa İstanbul vadeli işlemleri yükselişte", source: "Bloomberg HT", category: "Analiz", time: "22:35", body: "Sonuçların belirginleşmesiyle birlikte BIST vadeli işlem kontratları gece seansında yükseliş gösterdi. Yatırımcılar, ikinci tur ihtimaline rağmen siyasi belirsizliğin azaldığını değerlendiriyor." },
  { id: "n10", title: "İzmir'de Kaya açık ara önde", source: "Cumhuriyet", category: "Sonuçlar", time: "22:05", body: "Ege'nin merkezi İzmir'de Ayşe Kaya %50.3 ile birinci. Mehmet Yılmaz %24, Can Demir %21." },
  { id: "n11", title: "Genç seçmenler Demir'e yöneldi", source: "T24", category: "Analiz", time: "22:40", body: "Sandık sonrası anketler, 18-25 yaş arası seçmenlerin %38'inin Can Demir'e oy verdiğini gösteriyor. Yılmaz bu segmentte %29, Kaya %25 aldı." },
  { id: "n12", title: "Avrupa basını seçimi yakından izliyor", source: "AFP", category: "Analiz", time: "22:20", body: "Le Monde, The Guardian ve FAZ gibi büyük Avrupa gazeteleri seçimi canlı takip ediyor. AB'nin Türkiye ile ilişkilerinin yeni dönemde nasıl şekilleneceği merak konusu." },
  { id: "n13", title: "Ankara kesinleşti: Yılmaz", source: "Anadolu Ajansı", category: "Sonuçlar", time: "22:08", body: "Başkent Ankara'da %100 sayım tamamlandı. Mehmet Yılmaz %38.2 ile birinci, Ayşe Kaya %38.1 ile çok yakın takipte." },
  { id: "n14", title: "Diaspora oyları sayıldı", source: "Hürriyet", category: "Seçim", time: "19:00", body: "Yurt dışında 3.4 milyon seçmenin oy kullandığı sandıklar Türkiye'den önce sayıldı. Almanya'da Kaya, Hollanda'da Yılmaz önde çıktı." },
  { id: "n15", title: "Meclis aritmetiği değişiyor", source: "Karar", category: "Analiz", time: "22:50", body: "Milletvekili sonuçlarına göre yeni mecliste hiçbir parti tek başına çoğunluğu sağlayamayacak. Koalisyon görüşmelerinin önümüzdeki haftalarda başlaması bekleniyor." },
  { id: "n16", title: "Kaya: 'İkinci tura hazırız'", source: "Sözcü", category: "Seçim", time: "23:00", body: "Ayşe Kaya, parti merkezinde yaptığı konuşmada ikinci tura hazır olduklarını açıkladı. Demir seçmenine 'birlikte değişimi getirelim' çağrısı yaptı." },
  { id: "n17", title: "Yılmaz balkon konuşmasını erteledi", source: "Sabah", category: "Seçim", time: "23:10", body: "Mevcut Cumhurbaşkanı Mehmet Yılmaz'ın yapması beklenen balkon konuşması, sonuçların kesinleşmesi beklenerek ertelendi." },
  { id: "n18", title: "Sosyal medyada #Seçim2028 zirvede", source: "T24", category: "Analiz", time: "22:15", body: "Twitter Türkiye trend listesinde #Seçim2028 etiketi 4 milyondan fazla paylaşımla zirvede. Etiketler arasında #2Tur ve #SandıkBaşına da yer alıyor." },
  { id: "n19", title: "TÜSİAD'dan istikrar mesajı", source: "Dünya", category: "Analiz", time: "22:55", body: "Türkiye Sanayicileri ve İş Adamları Derneği, sonuçlardan bağımsız olarak ekonomik istikrarın korunmasının önemini vurgulayan bir açıklama yaptı." },
  { id: "n20", title: "Sayım %75'i geçti", source: "Anadolu Ajansı", category: "Sonuçlar", time: "23:15", body: "YSK son verilerine göre toplam sayım oranı %74.6'ya ulaştı. Tüm illerde sayım sürüyor, en yüksek tamamlanma Ankara'da %100." },
];

// Helper: get province by id
export const getProvince = (id: string) => PROVINCES.find((p) => p.id === id);

// Helper: format Turkish numbers
export const fmtTR = (n: number) => n.toLocaleString("tr-TR");

// ============================================================
// MİLLETVEKİLİ / PARLAMENTO
// ============================================================

export type Party = {
  id: string;
  abbr: string;
  name: string;
  color: string;
  bloc: "ittifak-a" | "ittifak-b" | "ittifak-c" | "bagimsiz";
  percent: number;
  seats: number;
  delta: number; // change vs 2023
};

export const TOTAL_SEATS = 600;
export const ELECTION_THRESHOLD = 7; // %

// Six fictional parties + independents — total seats = 600
export const PARTIES: Party[] = [
  { id: "ubp", abbr: "UBP", name: "Ulusal Birlik Partisi",  color: "#F4B81C", bloc: "ittifak-a", percent: 32.4, seats: 198, delta:  -14 },
  { id: "hsp", abbr: "HSP", name: "Halkın Sesi Partisi",     color: "#EE2C3A", bloc: "ittifak-b", percent: 27.8, seats: 174, delta:   +9 },
  { id: "yyh", abbr: "YYH", name: "Yeni Yol Hareketi",       color: "#5BC0DE", bloc: "ittifak-c", percent: 14.6, seats:  92, delta:  +18 },
  { id: "agp", abbr: "AGP", name: "Aydınlık Gelecek Partisi",color: "#22C55E", bloc: "ittifak-a", percent:  9.2, seats:  58, delta:   -3 },
  { id: "tdp", abbr: "TDP", name: "Toplumsal Demokrat Partisi", color: "#A855F7", bloc: "ittifak-b", percent:  7.4, seats:  46, delta:   +5 },
  { id: "msp", abbr: "MSP", name: "Milli Selamet Partisi",   color: "#FB923C", bloc: "ittifak-a", percent:  4.8, seats:  22, delta:   -8 },
  { id: "bgz", abbr: "BĞZ", name: "Bağımsızlar",             color: "#94A3B8", bloc: "bagimsiz",  percent:  3.8, seats:  10, delta:   -7 },
];

export const PARTY_BY_ID = (id: string) => PARTIES.find((p) => p.id === id);

// İttifak / coalition aggregation
export type Coalition = {
  id: "ittifak-a" | "ittifak-b" | "ittifak-c";
  name: string;
  color: string;
  partyIds: string[];
  seats: number;
  percent: number;
};

const sumBy = <T,>(arr: T[], f: (t: T) => number) => arr.reduce((s, x) => s + f(x), 0);

export const COALITIONS: Coalition[] = [
  { id: "ittifak-a", name: "Cumhur İttifakı (kurgu)",   color: "#F4B81C", partyIds: ["ubp", "agp", "msp"],
    seats: sumBy(PARTIES.filter((p) => ["ubp","agp","msp"].includes(p.id)), (p) => p.seats),
    percent: +sumBy(PARTIES.filter((p) => ["ubp","agp","msp"].includes(p.id)), (p) => p.percent).toFixed(1),
  },
  { id: "ittifak-b", name: "Millet İttifakı (kurgu)",   color: "#EE2C3A", partyIds: ["hsp", "tdp"],
    seats: sumBy(PARTIES.filter((p) => ["hsp","tdp"].includes(p.id)), (p) => p.seats),
    percent: +sumBy(PARTIES.filter((p) => ["hsp","tdp"].includes(p.id)), (p) => p.percent).toFixed(1),
  },
  { id: "ittifak-c", name: "Emek ve Özgürlük (kurgu)",  color: "#5BC0DE", partyIds: ["yyh"],
    seats: sumBy(PARTIES.filter((p) => p.id === "yyh"), (p) => p.seats),
    percent: +sumBy(PARTIES.filter((p) => p.id === "yyh"), (p) => p.percent).toFixed(1),
  },
];

export const MAJORITY_THRESHOLD = 301;

// Key insights / mega numbers strip
export type MegaStatTrend = "up" | "down" | "neutral";
export type MegaStatIcon =
  | "vote" | "leader" | "runoff" | "turnout" | "checked" | "parliament";

export type MegaStat = {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "primary" | "accent" | "cyan";
  icon?: MegaStatIcon;
  delta?: string;
  trend?: MegaStatTrend;
};

export const MEGA_STATS: MegaStat[] = [
  { label: "Sayım",            value: "%74.6",   sub: "47.8M / 64.1M oy", tone: "accent",  icon: "vote",       delta: "+2.1 pt",   trend: "up" },
  { label: "Önde",             value: "Yılmaz",  sub: "%38.2 · 18.3M oy", tone: "default", icon: "leader",     delta: "+6.5 pt",   trend: "up" },
  { label: "2. Tur ihtimali",  value: "%73",     sub: "14 Nisan 2028",    tone: "primary", icon: "runoff",     delta: "+4.0 pt",   trend: "up" },
  { label: "Katılım",          value: "%86.2",   sub: "vs 2023 %85.4",    tone: "cyan",    icon: "turnout",    delta: "+0.8 pt",   trend: "up" },
  { label: "Kesinleşen il",    value: "12 / 81", sub: "%100 sayım",       tone: "default", icon: "checked",    delta: "+3 il",     trend: "up" },
  { label: "Meclis lideri",    value: "UBP",     sub: "198 sandalye",     tone: "accent",  icon: "parliament", delta: "−4 vs 2023", trend: "down" },
];

// Region snapshot — leader per region
export const REGION_SNAPSHOT = REGIONS.map((r) => {
  const ps = PROVINCES.filter((p) => p.region === r);
  const totals = ps.reduce(
    (acc, p) => {
      acc.yilmaz += p.results.yilmaz;
      acc.kaya += p.results.kaya;
      acc.demir += p.results.demir;
      return acc;
    },
    { yilmaz: 0, kaya: 0, demir: 0 },
  );
  const sum = totals.yilmaz + totals.kaya + totals.demir;
  const y = (totals.yilmaz / sum) * 100;
  const k = (totals.kaya / sum) * 100;
  const d = (totals.demir / sum) * 100;
  const leader = y >= k && y >= d ? "yilmaz" : k >= d ? "kaya" : "demir";
  const provincesCount = ps.length;
  return {
    region: r,
    leader: leader as "yilmaz" | "kaya" | "demir",
    yilmaz: +y.toFixed(1),
    kaya: +k.toFixed(1),
    demir: +d.toFixed(1),
    provinces: provincesCount,
  };
});

