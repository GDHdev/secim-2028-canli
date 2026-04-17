import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface-1">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between md:px-6">
        <div>
          <div className="font-display text-2xl tracking-widest">
            SEÇİM<span className="text-primary">2028</span>
          </div>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Türkiye Cumhurbaşkanlığı ve Milletvekili Seçimleri canlı takip platformu. Tüm veriler örnek (mock) verilerdir.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm md:grid-cols-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Gösterge Paneli</Link>
          <Link to="/harita" className="text-muted-foreground hover:text-foreground">Harita</Link>
          <Link to="/sonuclar" className="text-muted-foreground hover:text-foreground">Sonuçlar</Link>
          <Link to="/tur2" className="text-muted-foreground hover:text-foreground">2. Tur</Link>
          <Link to="/anketler" className="text-muted-foreground hover:text-foreground">Anketler</Link>
          <Link to="/haberler" className="text-muted-foreground hover:text-foreground">Haberler</Link>
        </div>
      </div>
      <div className="border-t border-border px-4 py-3 text-center font-mono text-xs text-muted-foreground md:px-6">
        © 2028 Seçim2028 · Demo proje · Veriler gerçeği yansıtmaz
      </div>
    </footer>
  );
}
