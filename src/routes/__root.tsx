import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-9xl tracking-wider text-primary">404</h1>
        <h2 className="mt-2 font-display text-2xl tracking-wider text-foreground">SAYFA BULUNAMADI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 font-display text-sm tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          ANA SAYFAYA DÖN
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
      { title: "Seçim 2028 Sonuçları | Canlı Takip" },
      { name: "description", content: "2028 Türkiye Cumhurbaşkanlığı ve Milletvekili Seçimleri canlı sonuçları, harita, anketler ve analizler." },
      { name: "author", content: "Seçim2028" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Seçim 2028" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0D1117" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: "Seçim 2028",
              url: "https://secim2028.example",
              inLanguage: "tr-TR",
            },
            {
              "@type": "NewsMediaOrganization",
              name: "Seçim 2028",
              url: "https://secim2028.example",
              logo: "https://secim2028.example/logo.png",
            },
          ],
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
    <html lang="tr" className="dark">
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
    </div>
  );
}
