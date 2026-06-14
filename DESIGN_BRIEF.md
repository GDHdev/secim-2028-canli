# GDH Seçim 2028 — Tasarım Brief

Bu doküman, projenin görsel dilini, tasarım kararlarını ve "niş dokunuş"larını özetler. Amaç: başka bir tasarım aracına (Claude Design vb.) verildiğinde sıradan bir SaaS dashboard üretmek yerine, **yayın stüdyosu karakterli, haber/seçim bağlamına özgü** bir dil yakalanması.

- **Canlı önizleme:** https://secim-2028-canli.lovable.app
- **Repo:** https://github.com/GDHdev/secim-2028-canli
- **Stack:** TanStack Start v1 + React 19 + Tailwind v4 (CSS-first theme) + Framer Motion + Recharts

---

## 1. Konsept — "Broadcast Midnight"

Sıradan bir analitik dashboard değil; **canlı yayın komuta merkezi** havası. Derin lacivert-siyah zemin, cam (glass) paneller, GDH kırmızısı + parti renkleri vivid accent. Veri, "ekranda yayınlanıyor" hissi vermeli — sayılar canlı tick'liyor, ilerleme barları akıyor, ambient glow'lar nefes alıyor.

**Referans atmosfer:** Bloomberg Terminal × NYT election night × Linear settings paneli.

**Kaçınılacaklar:**
- Generic AI estetiği: Inter/Poppins + mor-indigo gradient + beyaz zemin
- Düz "SaaS card grid"
- Düşük opacity ile okunamayan ikincil metinler
- Küçük tipografi (17px taban altı yasak)

---

## 2. Tasarım Tokenları

Tüm renkler `src/styles.css` içinde OKLCH ile tanımlı. Hiçbir component'te hex/rgb hardcode YOK — sadece `bg-card`, `text-gray-900`, `border-brand-600` gibi semantic class'lar.

### Renk paleti (dark, inverted gri skala)
| Token | Değer (OKLCH) | Kullanım |
|---|---|---|
| `gray-25` | 0.135 0.018 264 | Sayfa zemini (#07080f civarı) |
| `gray-50` | 0.175 0.020 264 | surface-1 |
| `gray-100` | 0.215 0.022 264 | surface-2 / soft hover |
| `gray-200` | 0.275 0.024 264 | hairline border |
| `gray-500` | 0.640 0.018 254 | secondary text |
| `gray-700` | 0.860 0.012 250 | strong text |
| `gray-900` | 0.985 0.005 250 | primary text (≈white) |
| `surface-elevated` | 0.205 0.022 264 | Cam panel zemini, `bg-card` |

### Brand
| Token | Değer | Not |
|---|---|---|
| `brand-600` | 0.620 0.255 25 | **GDH RED** — primary action |
| `brand-500` | 0.680 0.250 25 | Hover/glow |
| `brand-50/100/200` | dark tinted reds | Accent yüzeyler |

### Aday renkleri (parti kimliği)
- **Yılmaz** — altın/sarı `oklch(0.820 0.180 92)` (lider)
- **Kaya** — GDH kırmızı `var(--brand-600)`
- **Demir** — mavi `oklch(0.700 0.160 220)`
- **Other** — `gray-400`

### Tipografi
- **Font:** Inter (400–900) + JetBrains Mono (sayılar, ticker)
- **Base:** 17px / 1.6
- **Heading scale:** 28–34px
- **Hero stat:** 80–96px, font-weight 800–900, JetBrains Mono tabular-nums

### Radius / Shadow
- Radius: 4/6/10/14/18px
- Shadow'lar derin gölge + ince üst highlight (dark mode için optimize)

---

## 3. Sayfa Anatomisi (anasayfa sırası)

```
┌──────────────────────────────────────────────┐
│ TopBar (2 satır: Ticker + Masthead/Nav)      │ ← canlı veri akışı + brand + nav
├──────────────────────────────────────────────┤
│ AISummary (haber editörü AI özeti)           │
├──────────────────────────────────────────────┤
│ CommandHero                                  │ ← LEADER panel + 4 sinyal kartı
│  ├ Büyük lider kartı (ambient glow)          │
│  ├ Canlı sayım progress bar                  │
│  └ Projection / Turnout / Confirmed / Countdown │
├──────────────────────────────────────────────┤
│ PresidentRace + Gauge (yarış detayı)         │
├──────────────────────────────────────────────┤
│ RegionStrip (bölge bölge mini sonuç)         │
├──────────────────────────────────────────────┤
│ TurkeyMap (interaktif il haritası)           │
├──────────────────────────────────────────────┤
│ Parliament + LiveFeed (yan yana)             │
├──────────────────────────────────────────────┤
│ SwingProvinces + Stats                       │
├──────────────────────────────────────────────┤
│ News + Footer (broadcast-style 3 sütun)      │
└──────────────────────────────────────────────┘
```

### Header (TopBar)
- **1. satır — Ticker:** sürekli soldan sağa kayan canlı veri şeridi (sandık açıldı, son güncelleme, katılım vb.)
- **2. satır — Masthead:** sol GDH logo (kırmızı), orta nav, sağ canlı saat + "CANLI" rozeti (pulse animation)
- Tek glass surface, hafif backdrop-blur

### Footer (broadcast-style)
3 sütun: **Publication** | **Analysis** | **Transparency** + alt satır: live status indicators + veri zaman damgaları + yasal disclaimer.

---

## 4. Niş Dokunuşlar (sıradanlıktan çıkaran detaylar)

1. **JetBrains Mono tabular-nums** tüm sayılarda — gerçek terminal/yayın hissi
2. **Ambient glow** büyük panellerde (lider kartı, hero stat): radial-gradient brand-500 → transparent, blur-3xl
3. **Canlı tick animasyonu:** sayılar değiştiğinde Framer Motion ile bir önceki değerden yenisine sayıyor (rolling counter)
4. **"CANLI" rozeti:** kırmızı dot + pulse + dakika cinsinden son güncelleme
5. **Hairline border-top brand-600** öncelikli kartlarda — gazete manşeti hissi
6. **Sandık ilerleme barı:** üst kenar boyunca ince, segmentli (her % 10'da hafif tick)
7. **Veri zaman damgaları** her bileşenin altında küçük mono font ile
8. **Map hover:** il üzerinde dururken küçük floating card — lider parti rengi border

---

## 5. Animasyon Prensipleri

**Doz: 3/5** (yüksek ama agresif değil)

- **Framer Motion** scroll-reveal: `Reveal.tsx` utility — stagger 60ms, y:20→0, opacity:0→1, easeOut
- **Sayı animasyonları:** spring(stiffness:120, damping:20)
- **Hover:** scale 1.02 + shadow-lg geçişi 200ms
- **Live pulse:** 2s infinite ease-in-out
- **Map fill renk geçişleri:** 400ms

`prefers-reduced-motion` mutlaka respect edilmeli.

---

## 6. Mevcut Komponent Envanteri

`src/components/`:
- `TopBar.tsx` — Header (ticker + masthead)
- `CommandHero.tsx` — Lider paneli + 4 sinyal kartı
- `AISummary.tsx` — AI haber özeti
- `PresidentRace.tsx`, `Parliament.tsx`, `TurkeyMap.tsx`
- `LiveFeed.tsx`, `News.tsx`, `RegionStrip.tsx`
- `SwingProvinces.tsx`, `Stats.tsx`, `Gauge.tsx`
- `Footer.tsx`, `Reveal.tsx`

Sayfalar: `/` (anasayfa), `/milletvekili`, `/harita`

---

## 7. Claude Design İçin Talimat (kopyala-yapıştır prompt)

```
Bu projeyi incele:
- GitHub: https://github.com/GDHdev/secim-2028-canli
- Canlı: https://secim-2028-canli.lovable.app
- Tasarım brief: repo kökündeki DESIGN_BRIEF.md

Görev: Bu seçim "command center" dashboard'unu KENDİ bakış açınla yeniden
tasarla. Aşağıdaki kuralları koru:

ZORUNLU:
- Dark theme — "Broadcast Midnight" karakteri (derin lacivert-siyah zemin,
  cam paneller, GDH kırmızı + parti renkleri vivid accent)
- Tipografi büyük ve okunaklı (base 17px+, hero stat 80px+)
- Tüm sayılar JetBrains Mono tabular-nums
- Yüksek doz ama RAHATSIZ ETMEYEN animasyon (Framer Motion)
- Hardcode renk YOK — sadece design token'lar
- prefers-reduced-motion respect

KAÇINILACAK:
- Generic SaaS card grid
- Mor/indigo gradient + beyaz zemin estetik
- Düşük opacity ile okunmaz ikincil metin
- Inter dışında popüler "AI dragon" fontlar (Poppins, Plus Jakarta vs.)

İSTEDİĞİM ÇIKTI:
1. Anasayfa için yenilenmiş layout önerisi (wireframe + reasoning)
2. 2-3 farklı görsel yön (her biri için hero + 1 bölüm mock-up)
3. Mevcut komponentlerden hangilerini koruyacağını, hangilerini yeniden
   tasarlayacağını listele
4. Niş dokunuş önerilerin (gazete manşeti, terminal yayın hissi vs. dışında)
```

---

*Son güncelleme: tasarım iterasyonu — Broadcast Midnight v1*
