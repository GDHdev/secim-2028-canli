import type { LucideIcon } from "lucide-react";
import {
  Vote,
  IdCard,
  Accessibility,
  Plane,
  ShieldCheck,
  Scale,
  CalendarClock,
  HelpCircle,
} from "lucide-react";

export type GuideSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  tone: "brand" | "indigo" | "violet" | "warning" | "success" | "gray";
  readMinutes: number;
  sections: GuideSection[];
};

export const GUIDES: Guide[] = [
  {
    slug: "oy-nasil-kullanilir",
    title: "Oy nasıl kullanılır?",
    summary:
      "Sandığa girdiğiniz andan zarfı atana kadar adım adım: kimlik kontrolünden mühüre, gizlilik kabininden zarfa.",
    icon: Vote,
    tone: "brand",
    readMinutes: 4,
    sections: [
      {
        heading: "Sandığa girmeden önce",
        body: "Seçmen kartınızı getirmeniz şart değildir; nüfus cüzdanı, T.C. kimlik kartı veya pasaport yeterlidir. Sandık yerinizi e-Devlet üzerinden 'Seçmen Bilgisi Sorgulama' bölümünden teyit edin.",
        bullets: [
          "Resimli ve T.C. kimlik numaralı bir belge yanınızda olsun.",
          "Sürücü belgesi 2017 sonrası geçerli değildir.",
          "Sandık başkanına önce kimliğinizi gösterirsiniz.",
        ],
      },
      {
        heading: "Oy verme adımları",
        body: "Sandık kurulundan oy pusulasını ve mühürlü zarfı alın. Kabine geçin, tercih ettiğiniz adayın/partinin kutusuna 'TERCİH' veya 'EVET' mührünü basın.",
        bullets: [
          "Mühür yalnızca kutunun içine basılmalıdır.",
          "Birden fazla seçeneğe mühür basmak oyu geçersiz kılar.",
          "Pusulayı katlayın, zarfa koyun ve zarfı kapatın.",
        ],
      },
      {
        heading: "Geçerli sayılma şartları",
        body: "Pusula arkasında 'TÜRKİYE CUMHURİYETİ YÜKSEK SEÇİM KURULU' filigranı ve sandık kurulu mührü bulunmalıdır. Yırtık, ek imza veya yazı oy geçersiz olur.",
      },
    ],
  },
  {
    slug: "kimlik-ve-belgeler",
    title: "Hangi kimliklerle oy kullanılır?",
    summary:
      "Geçerli kimlik belgeleri, kayıp/zayi durumunda yapılması gerekenler ve seçmen kayıt sorgulama.",
    icon: IdCard,
    tone: "indigo",
    readMinutes: 3,
    sections: [
      {
        heading: "Geçerli belgeler",
        body: "Resmi mühür/soğuk damga taşıyan, T.C. kimlik numaralı resimli belgeler kabul edilir.",
        bullets: [
          "T.C. Kimlik Kartı (çipli)",
          "Eski Nüfus Cüzdanı (resimli)",
          "Geçerli Pasaport",
          "Evlilik cüzdanı resimli ise (istisnai)",
        ],
      },
      {
        heading: "Kabul edilmeyenler",
        body: "Sürücü belgesi, öğrenci kartı, askeri kimlik, basın kartı tek başına yeterli değildir.",
      },
      {
        heading: "Kimliğim yoksa",
        body: "Seçim günü nüfus müdürlükleri açıktır; 'Geçici Kimlik Belgesi' alabilirsiniz. Sandık başında bu belge ile oy kullanabilirsiniz.",
      },
    ],
  },
  {
    slug: "engelli-secmen",
    title: "Engelli ve yaşlı seçmen hakları",
    summary:
      "Refakatçi hakkı, taşınabilir sandık, işitme/görme engelliler için sandık düzenlemeleri.",
    icon: Accessibility,
    tone: "success",
    readMinutes: 3,
    sections: [
      {
        heading: "Refakatçi ile oy kullanma",
        body: "Görme engelli, felçli veya elleri eksik seçmenler, yakınlarından bir kişinin yardımıyla oy kullanabilir. Refakatçi de aynı sandıkta seçmen olmak zorunda değildir.",
      },
      {
        heading: "Erişilebilir sandık",
        body: "YSK, engelli seçmenlere zemin kat ve rampa erişimli sandık tahsis eder. Talebinizi seçimden önce e-Devlet üzerinden iletebilirsiniz.",
      },
      {
        heading: "Cezaevi ve hastane",
        body: "Tutuklular (hükümlü olmayanlar) ve hastane yatan hastaları için kurulan seyyar sandıklarda oy kullanılır.",
      },
    ],
  },
  {
    slug: "yurt-disi-secmen",
    title: "Yurt dışında oy kullanma",
    summary:
      "Temsilcilikler, gümrük kapıları, kayıt tarihleri ve oyların Türkiye'ye taşınma süreci.",
    icon: Plane,
    tone: "violet",
    readMinutes: 4,
    sections: [
      {
        heading: "Nerede oy kullanılır?",
        body: "73 ülkedeki büyükelçilik, başkonsolosluk ve YSK'nın belirlediği özel sandık merkezlerinde oy kullanabilirsiniz. Gümrük kapılarında (sınır kapıları) ise seçim günü dahil belirlenen tarihlerde sandık açık olur.",
      },
      {
        heading: "Randevu sistemi",
        body: "Bazı temsilcilikler kalabalığı yönetmek için randevu zorunluluğu getirir. YSK seçim takvimi açıklandığında randevu portalı aktif olur.",
      },
      {
        heading: "Oyların sayımı",
        body: "Yurt dışı zarfları diplomatik kuryeyle Ankara'ya getirilir, sandık genel sayımıyla birlikte açılır ve sonuçlar toplam oy içine işlenir.",
      },
    ],
  },
  {
    slug: "sandik-gozlemcisi",
    title: "Sandık görevlisi ve müşahit",
    summary:
      "Sandık kurulu üyeleri, parti müşahitleri ve bağımsız gözlemci olmanın yol haritası.",
    icon: ShieldCheck,
    tone: "warning",
    readMinutes: 4,
    sections: [
      {
        heading: "Sandık kurulu kimlerden oluşur?",
        body: "Bir başkan, bir başkan yardımcısı (kamu görevlisi) ve siyasi partilerden 5 üye ile kurulur. Görev seçim öncesi ilan edilir.",
      },
      {
        heading: "Müşahit olma şartları",
        body: "Bir siyasi partinin veya bağımsız adayın temsilcisi olarak sandık başında bulunabilirsiniz. Partinizin il başkanlığından yazılı müşahit belgesi almanız gerekir.",
      },
      {
        heading: "Sayım sırasında yetkileriniz",
        body: "Geçersiz/şüpheli oylara itiraz hakkınız vardır. Sonuç tutanağının imzalı bir kopyasını talep edebilirsiniz; bu tutanak resmi belgedir.",
      },
    ],
  },
  {
    slug: "itiraz-ve-haklar",
    title: "Sandıkta itiraz hakkınız",
    summary:
      "Oy kullanma engellenirse, mühür eksikse veya sayımda hata varsa ne yapılır?",
    icon: Scale,
    tone: "brand",
    readMinutes: 3,
    sections: [
      {
        heading: "Anında itiraz",
        body: "Oy kullanmanız engellenirse veya sayım sırasında bir usulsüzlük gördüyseniz sandık başkanına derhal sözlü ve yazılı itirazda bulunabilirsiniz. Tutanağa geçirilmesi zorunludur.",
      },
      {
        heading: "İlçe ve il seçim kuruluna başvuru",
        body: "Sandık tutanağı imzalandıktan sonra 2 gün içinde ilçe seçim kuruluna, kararı yeterli görmezseniz il seçim kuruluna itiraz edebilirsiniz.",
      },
      {
        heading: "YSK'ya başvuru",
        body: "Nihai mercii Yüksek Seçim Kurulu'dur. Karar tarihinden itibaren 3 gün içinde başvuru hakkınız vardır.",
      },
    ],
  },
  {
    slug: "secim-takvimi",
    title: "Seçim takvimi 2028",
    summary:
      "Seçmen listesi askısı, aday başvuruları, propaganda yasağı ve seçim günü saatleri.",
    icon: CalendarClock,
    tone: "gray",
    readMinutes: 2,
    sections: [
      {
        heading: "Önemli tarihler",
        body: "YSK'nın açıkladığı resmi takvime göre kritik durakları aşağıda derledik.",
        bullets: [
          "10 Ocak 2028 — Seçim takvimi ilanı",
          "20 Şubat 2028 — Seçmen listesi askıya çıkar",
          "1 Mart 2028 — Aday listelerinin kesinleşmesi",
          "13 Mart 2028 — Propaganda yasağı (saat 18:00)",
          "14 Mart 2028 — Sandık günü (08:00 — 17:00)",
          "28 Mart 2028 — 2. tur (gerekirse)",
        ],
      },
      {
        heading: "Sandık günü kuralları",
        body: "08:00 — 11:00 arası 65 yaş üstü, gebe ve engelli seçmenler önceliklidir. 17:00'de kapanan sandıkta sıraya girmiş seçmenlerin oy kullanma hakkı saklıdır.",
      },
    ],
  },
  {
    slug: "sss",
    title: "Sıkça sorulan sorular",
    summary:
      "Telefon, kamera, alkol, kıyafet, oy gizliliği ve sayım sürecine dair en çok merak edilenler.",
    icon: HelpCircle,
    tone: "violet",
    readMinutes: 5,
    sections: [
      {
        heading: "Sandıkta telefon çekebilir miyim?",
        body: "Oy verme kabininde fotoğraf veya video çekmek yasaktır ve geçerli oy iptali ile cezai yaptırım doğurur. Sandığın bulunduğu salonda kurul izniyle fotoğraf çekilebilir.",
      },
      {
        heading: "Parti amblemli kıyafetle gidebilir miyim?",
        body: "Sandık alanında propaganda yasaktır. Parti amblemi, aday rozeti veya pankart taşımak yasaktır.",
      },
      {
        heading: "Sayım nasıl yapılır?",
        body: "Saat 17:00'de oy verme sona erer. Zarflar açılır, pusulalar tek tek okunur. Sayım kamuya açıktır; vatandaşlar ve müşahitler izleyebilir.",
      },
      {
        heading: "Sonuçları nereden takip ederim?",
        body: "Yüksek Seçim Kurulu'nun resmi portali (sonuc.ysk.gov.tr) tek resmi kaynaktır. Seçim 2028 sitesi YSK verilerini özetleyerek görsel olarak sunar.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
