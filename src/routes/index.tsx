import { createFileRoute } from "@tanstack/react-router";
import { CandidateRace } from "@/components/CandidateRace";
import { SecondRoundGauge } from "@/components/SecondRoundGauge";
import { TurkeyMap } from "@/components/TurkeyMap";
import { LiveFeed } from "@/components/LiveFeed";
import { StatsGrid } from "@/components/StatsGrid";
import { MicroNews } from "@/components/MicroNews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seçim 2028 Sonuçları | Canlı Takip" },
      { name: "description", content: "Cumhurbaşkanlığı yarışı, 81 il sonuçları, 2. tur projeksiyonu ve canlı haberler." },
      { property: "og:title", content: "Seçim 2028 Sonuçları | Canlı Takip" },
      { property: "og:description", content: "Cumhurbaşkanlığı yarışı, 81 il sonuçları, 2. tur projeksiyonu ve canlı haberler." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-12">
      {/* HERO */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <CandidateRace />
        <SecondRoundGauge />
      </section>

      {/* MAP — edge-to-edge, ignores page padding */}
      <section className="-mx-4 mt-8 md:-mx-8 lg:-mx-12">
        <TurkeyMap className="h-[720px]" />
      </section>

      {/* LIVE FEED + STATS */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        <LiveFeed />
        <div>
          <h2 className="mb-3 font-display text-2xl tracking-wider text-foreground">İSTATİSTİKLER</h2>
          <StatsGrid />
        </div>
      </section>

      {/* NEWS */}
      <section className="mt-8 mb-4">
        <MicroNews />
      </section>
    </div>
  );
}
