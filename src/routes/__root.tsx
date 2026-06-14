import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl tracking-tight text-brand-600">404</h1>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900">Sayfa bulunamadı</h2>
        <p className="mt-2 text-base text-gray-500">
          Aradığınız sayfa mevcut değil veya taşınmış.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Seçim 2028 — Canlı Sonuçlar" },
      { name: "description", content: "Türkiye 2028 Cumhurbaşkanlığı ve Milletvekili seçimleri canlı sonuçları, harita, meclis dağılımı ve haberler." },
      { name: "author", content: "Seçim 2028" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Seçim 2028" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#FFFFFF" },
      { property: "og:title", content: "Seçim 2028 — Canlı Sonuçlar" },
      { name: "twitter:title", content: "Seçim 2028 — Canlı Sonuçlar" },
      { property: "og:description", content: "Cumhurbaşkanlığı yarışı, 600 sandalye, 81 il sonuçları." },
      { name: "twitter:description", content: "Cumhurbaşkanlığı yarışı, 600 sandalye, 81 il sonuçları." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Seçim 2028",
          url: "https://secim2028.example",
          inLanguage: "tr-TR",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}
