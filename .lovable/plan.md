## Hedef
Siteyi koyu "broadcast" temasından **okunaklı, yüksek kontrastlı light tema**ya çevirmek; gradient kullanmamak; header/menüyü havalandırmak; seçmenin sayfaya girer girmez ne göreceğini netleştirmek; arama deneyimini güçlendirmek; tekrar eden bölümleri tek bir yere indirmek.

---

## 1) Tema — Light, gradient-free, yüksek kontrast
`src/styles.css` baştan yazılır:
- Zemin: `#FFFFFF` ana, `#F5F6F8` ikincil panel, `#ECEEF2` hairline.
- Metin: başlık `#0A0E14` (gerçek siyah-yakını), gövde `#1F2937`, ikincil `#4B5563`, üçüncü `#6B7280`. WCAG AA+ (4.5:1) garantisi.
- Aksanlar **düz renk** (gradient yok, blur glow yok):
  - GDH kırmızı `#D7263D` (CTA, "CANLI", lider vurgusu).
  - Parti renkleri düz: sarı `#F2B705`, kırmızı `#D7263D`, mavi `#2563EB`, yeşil `#16A34A`, diğer `#6B7280`.
- Kart: `bg-white` + `border #E5E7EB` + minik `shadow-sm`. **Glassmorphism, blur, ambient-glow, gradient kalkar.**
- Tipografi: başlıklarda **Fraunces** (editorial serif) + gövdede **Inter**. Sayılarda **JetBrains Mono tabular-nums**. Inter+JetBrains tek-font klişesinden çıkar.
- Ölçek: gövde 16px, H1 40/44, H2 28, H3 20. Satır boşluğu 1.55.

## 2) Header & navigasyon — havalı, seçmen-odaklı
`TopBar.tsx` tek satırlık, 72px:
- Sol: GDH logosu + "Seçim 2028" wordmark.
- Orta: **5 net link** — Anasayfa · Cumhurbaşkanı · Milletvekili · Harita · Haberler. (Anketler ve 2. Tur "Cumhurbaşkanı" altında dropdown'a iner — duplicate temizliği.)
- Sağ: **belirgin arama kutusu** (il/aday/parti) + "CANLI" rozet (kırmızı nokta + saat).
- Ticker üst satırı **kalkar** — header sıkışıklığının ana sebebi.
- Mobilde hamburger + tam ekran sheet menü.

## 3) Arama — gerçek anlamda işlevsel
Yeni `GlobalSearch.tsx` (cmdk tabanlı, ⌘K):
- Tek input → 3 grup: **İller (81)**, **Adaylar**, **Partiler**.
- Fuzzy match, Türkçe karakter normalizasyonu (İ/ı/ş/ğ/ü/ö/ç).
- Enter → ilgili sayfaya yönlendirir (il → /harita?il=…, aday → /sonuclar#aday-…, parti → /milletvekili#parti-…).
- Header'daki kutuya tıklayınca / "⌘K" / "/" ile açılır.
- Son aramalar localStorage'da.

## 4) Anasayfa bilgi mimarisi — "seçmen ilk neye bakar?"
Sıralama bir seçmenin doğal okuma akışına göre yeniden kurulur:

1. **Durum şeridi** (eski AISummary yerine): _"Sandıkların %72'si açıldı · Katılım %84,3 · Son güncelleme 21:47"_ — tek satır, ikon + sayı, gradient yok.
2. **Cumhurbaşkanlığı yarışı** (CommandHero + PresidentRace **birleşir** — şu an ikisi de lider gösteriyor, duplicate). Tek büyük kart: lider yüzü + oy yüzdesi + 4 aday yan yana bar.
3. **2. Tur projeksiyonu** — sadece 1. tur sonuçlanmadıysa görünür.
4. **Türkiye haritası** — tam genişlik, lejant net (her parti için düz renk swatch).
5. **Meclis dağılımı (600 sandalye)** — yarım daire + parti tablosu.
6. **Canlı akış** — sağda dar kolon, sadece son 6 olay.
7. **Son haberler** — 3 kart, daha az.
8. **Footer** — sade 3 sütun.

**Kaldırılan duplicate bölümler:**
- `RegionStrip` (harita zaten bölgesel bilgiyi veriyor).
- `SwingProvinces` ana sayfadan çıkar → `/sonuclar` içine taşınır.
- `StatsGrid` durum şeridine entegre edilir, ayrı bölüm gitmez.
- `CommandHero` `PresidentRace`'e absorbe edilir.

Sonuç: **8 bölüm → 6 bölüm**, her bölümün tek bir işi var.

## 5) Bileşen güncellemeleri
- Tüm `text-white`, `bg-black`, `glass-panel`, `ambient-glow`, `live-pulse` glow gölgeleri **semantik token**lara çevrilir.
- `Reveal` animasyonu daha kısa (60ms → opacity-only, transform yok) — seçim gecesi hızlı tarama önemli.
- `live-pulse` sade kırmızı nokta + opacity pulse (box-shadow glow yok).
- Parlament bar / progress bar köşeleri 2px, segmentli görünüm net.

## 6) Erişilebilirlik & SEO
- Her interaktif öğede `focus-visible` 2px solid `#D7263D` ring.
- Harita SVG'leri `<title>` + `aria-label`.
- Sayfa başlıkları kısaltılır, meta description her route'ta tekrar yazılır.

---

## Teknik dokunulacak dosyalar
- `src/styles.css` — tam yeniden yazım (light tokenlar, gradient/blur temizliği).
- `src/components/TopBar.tsx` — yeniden yazım.
- `src/components/GlobalSearch.tsx` — yeni.
- `src/components/AISummary.tsx` → `StatusStrip.tsx` olarak sadeleşir.
- `src/components/CommandHero.tsx` — silinir, içerik `PresidentRace`'e iner.
- `src/components/PresidentRace.tsx` — büyütülmüş "leader + adaylar" tek kart.
- `src/components/{RegionStrip,SwingProvinces,StatsGrid}.tsx` — anasayfadan kaldırılır (dosya korunur, `/sonuclar`'a taşınır).
- `src/components/Parliament.tsx`, `TurkeyMap.tsx`, `LiveFeed.tsx`, `MicroNews.tsx`, `Footer.tsx` — light tema + gradient temizliği.
- `src/routes/index.tsx` — yeni 6-bölümlü akış.
- `src/routes/__root.tsx` — Fraunces + Inter `<link>` ekle.

## Kapsam dışı (sormak isterim)
- İçerik / mock data **aynen** kalır, sadece görsel + IA değişir. ✅
- `/anketler`, `/tur2`, `/haberler`, `/harita`, `/milletvekili`, `/sonuclar` route'larının iç düzeni bu turda **dokunulmaz** (sadece light tema otomatik geçer, hardcoded renkler düzeltilir). İstersen ikinci turda onları da yeniden tasarlayabilirim.

Onaylarsan başlıyorum.