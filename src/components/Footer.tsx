import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900">
      <div className="site-container grid grid-cols-1 gap-8 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="font-display text-4xl tracking-tight text-foreground">
            SEÇİM<span className="text-primary">2028</span>
          </div>
          <p className="mt-3 max-w-md font-serif text-base leading-relaxed text-muted-foreground">
            Türkiye'nin en kapsamlı seçim gecesi platformu. Cumhurbaşkanlığı ve Milletvekili
            sonuçlarını dakika dakika takip edin.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
            Tüm veriler kurgudur — Demo amaçlıdır
          </p>
        </div>

        <div>
          <span className="eyebrow-accent">Sayfalar</span>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground">Genel Görünüm</Link></li>
            <li><Link to="/harita" className="text-muted-foreground hover:text-foreground">Harita</Link></li>
            <li><Link to="/sonuclar" className="text-muted-foreground hover:text-foreground">Sonuçlar Tablosu</Link></li>
            <li><Link to="/tur2" className="text-muted-foreground hover:text-foreground">2. Tur Simülatörü</Link></li>
          </ul>
        </div>

        <div>
          <span className="eyebrow-accent">Veri & Analiz</span>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            <li><Link to="/anketler" className="text-muted-foreground hover:text-foreground">Anketler</Link></li>
            <li><Link to="/haberler" className="text-muted-foreground hover:text-foreground">Haberler</Link></li>
          </ul>
        </div>
      </div>
      <div className="site-container border-t border-border py-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          © 2028 Seçim2028 · Bütün haklar saklıdır · Demo proje
        </p>
      </div>
    </footer>
  );
}
