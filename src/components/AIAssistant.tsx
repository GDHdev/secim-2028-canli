import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles, X, Send, Bot, User as UserIcon, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "Kim önde, fark ne kadar?",
  "İstanbul'da kim kazandı?",
  "2. tur olasılığı nedir?",
  "Katılım 2023'e göre nasıl?",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const submit = async (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    setInput("");
    await sendMessage({ text: t });
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[80] inline-flex items-center gap-2.5 rounded-full bg-violet-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-xl transition-all hover:bg-violet-700 hover:shadow-2xl"
        style={{ background: "var(--color-violet-600)" }}
        aria-label="Seçim asistanını aç"
      >
        <Sparkles size={18} />
        <span className="hidden sm:inline">Seçim Asistanı</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-end p-0 sm:p-6" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"
          />
          <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[640px] sm:max-h-[85vh] sm:w-[440px] sm:rounded-2xl sm:border sm:border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
              <span className="uui-feat-icon uui-feat-icon-violet" style={{ width: 40, height: 40, borderRadius: 10 }}>
                <Sparkles size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-gray-900">Seçim 2028 Asistanı</p>
                <p className="text-[12.5px] text-gray-500">Canlı verilerle yanıt verir · Lovable AI</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-[14.5px] leading-relaxed text-gray-800">
                    <p className="font-semibold text-violet-700">Merhaba 👋</p>
                    <p className="mt-1.5">
                      Aday yüzdeleri, il sonuçları, katılım ve 2. tur olasılığı hakkında soru sorabilirsin.
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-gray-500">Örnek sorular</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => submit(s)}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((m) => {
                  const text = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isUser ? "bg-gray-900 text-white" : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {isUser ? <UserIcon size={14} /> : <Bot size={14} />}
                      </span>
                      <div
                        className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-relaxed ${
                          isUser
                            ? "rounded-tr-sm bg-gray-900 text-white"
                            : "rounded-tl-sm border border-gray-200 bg-white text-gray-800"
                        }`}
                      >
                        {text || (isLoading ? "…" : "")}
                      </div>
                    </div>
                  );
                })}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <Bot size={14} />
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3.5 py-2.5 text-[14px] text-gray-500">
                      <Loader2 size={14} className="animate-spin" /> Düşünüyor…
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="border-t border-gray-200 bg-white p-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Bir soru sor…"
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400"
                  style={{ background: input.trim() && !isLoading ? "var(--color-violet-600)" : undefined }}
                  aria-label="Gönder"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <p className="mt-2 text-center text-[11.5px] text-gray-400">
                Yanıtlar yapay zekâ ile üretilir, doğruluk için canlı verileri inceleyin.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
