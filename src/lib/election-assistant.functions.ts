import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import {
  CANDIDATES,
  COUNT_PERCENT,
  COUNTED_VOTES,
  TOTAL_VOTERS,
  SECOND_ROUND_PROBABILITY,
  TOP_CITIES,
  TURNOUT_BY_REGION,
  HISTORICAL,
} from "@/lib/mock-data";

const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});
const Input = z.object({
  messages: z.array(Message).min(1).max(20),
});

function buildContext() {
  const lines: string[] = [];
  lines.push("SEÇİM 2028 — CANLI VERİ ÖZETİ");
  lines.push(`Sayım: %${COUNT_PERCENT.toFixed(1)} (${COUNTED_VOTES.toLocaleString("tr-TR")} / ${TOTAL_VOTERS.toLocaleString("tr-TR")} oy)`);
  lines.push(`2. Tur olasılığı: %${SECOND_ROUND_PROBABILITY}`);
  lines.push("");
  lines.push("Adaylar (oran · oy · parti):");
  for (const c of CANDIDATES) {
    lines.push(`- ${c.name} · %${c.percent.toFixed(1)} · ${c.votes.toLocaleString("tr-TR")} · ${c.party}`);
  }
  lines.push("");
  lines.push("Büyük şehir liderleri:");
  for (const p of TOP_CITIES) {
    const lead = p.leader;
    const pct = p.results[lead];
    lines.push(`- ${p.name}: ${lead.toUpperCase()} %${pct} (sayım %${p.counted}, katılım %${p.turnout})`);
  }
  lines.push("");
  lines.push("Bölge katılımı (2028 vs 2023):");
  for (const r of TURNOUT_BY_REGION) {
    lines.push(`- ${r.region}: %${r.turnout} (2023: %${r.turnout2023})`);
  }
  lines.push("");
  lines.push("2023 → 2028 değişim:");
  for (const h of HISTORICAL) {
    lines.push(`- ${h.name}: %${h.y2023} → %${h.y2028}`);
  }
  return lines.join("\n");
}

const SYSTEM = (ctx: string) => `Sen "Seçim 2028 Asistanı"sın. Türkiye Cumhurbaşkanlığı ve Milletvekili seçim sonuçlarını sade, tarafsız ve net biçimde açıklarsın.
- Yanıtların kısa, somut ve veriye dayalı olur. Spekülasyon yapma.
- Yalnızca aşağıdaki bağlam verisini kullan. Bilmediğin şeyi "elimdeki veride yok" diye söyle.
- Sayılar TR usulü: önce %, sonra rakam (örn. %38.2).
- Kısa paragraflar ve gerektiğinde madde işareti.
- Türkçe yanıt ver.

# CANLI BAĞLAM
${ctx}`;

export const askElectionAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY tanımlı değil.");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM(buildContext()),
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });
    return { text };
  });
