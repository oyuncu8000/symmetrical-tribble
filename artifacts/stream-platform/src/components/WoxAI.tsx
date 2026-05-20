import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWatchHistory } from "@/lib/watchHistory";
import { getLikes } from "@/lib/likes";
import { getWatchlist } from "@/lib/watchlist";
import { Bot, Send, Sparkles, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function WoxAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const buildSystemPrompt = () => {
    const history = getWatchHistory().slice(0, 10).map(h => h.title).join(", ");
    const likes = getLikes().slice(0, 10).map(l => `${l.title} (${l.genre})`).join(", ");
    const watchlist = getWatchlist().slice(0, 5).map(w => w.title).join(", ");
    return `Sen WoxStream'in akıllı yapay zeka asistanı Wox AI'sın. Türkçe yanıt ver.
İzleme geçmişi: ${history || "yok"}
Beğenilen içerikler: ${likes || "yok"}
İzleme listesi: ${watchlist || "boş"}
Kullanıcının zevklerine göre kişiselleştirilmiş, samimi ve kısa önerilerde bulun. Her öneri için emoji kullan. Maksimum 4-5 cümle.`;
  };

  const sendMessage = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);
    setExpanded(true);

    try {
      const res = await fetch("https://api.llm7.io/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer unused" },
        body: JSON.stringify({
          model: "default",
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const aiText = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: "assistant", content: aiText }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "🎬 Bağlantı hatası. Şunları deneyebilirsin: Inception, Interstellar, The Dark Knight — izleme geçmişine göre harika seçimler!",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    "Aksiyon filmi öner",
    "Bilim kurgu listesi",
    "Beğenilerime göre öner",
    "Bu haftanın önerileri",
  ];

  return (
    <div className="w-full px-8 md:px-16 mb-12">
      <div
        className="relative rounded-2xl overflow-hidden border transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(10,10,15,0.95) 40%, rgba(245,166,35,0.05) 100%)",
          borderColor: "rgba(139,92,246,0.25)",
          boxShadow: "0 0 40px rgba(139,92,246,0.12), 0 0 80px rgba(245,166,35,0.05)",
        }}
      >
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b cursor-pointer"
            style={{ borderColor: "rgba(139,92,246,0.15)" }}
            onClick={() => setExpanded(e => !e)}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border"
                style={{
                  background: "rgba(139,92,246,0.15)",
                  borderColor: "rgba(139,92,246,0.4)",
                  boxShadow: "0 0 15px rgba(139,92,246,0.4)",
                }}
              >
                <Bot size={18} className="text-secondary" />
              </div>
              <div>
                <h2 className="text-lg font-['Bebas_Neue'] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary leading-none">
                  WOX AI
                </h2>
                <p className="text-xs text-muted-foreground leading-none mt-0.5">Kişisel içerik asistanın</p>
              </div>
              <div
                className="w-1.5 h-1.5 rounded-full bg-secondary ml-1 animate-pulse"
                style={{ boxShadow: "0 0 8px rgba(139,92,246,0.9)" }}
              />
            </div>
            <button
              className="text-white/40 hover:text-white/70 transition-colors"
              onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="chat-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                {/* Messages */}
                <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-3 scrollbar-hide">
                  {messages.length === 0 && (
                    <div className="text-center py-6">
                      <Sparkles size={24} className="text-secondary/60 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">
                        {getLikes().length > 0 || getWatchHistory().length > 0
                          ? "Zevklerinize göre öneri almak için yazın veya aşağıdaki kısa yolları kullanın."
                          : "Merhaba! Film ve dizi önermemi ister misin? Bir şeyler sor."}
                      </p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center mr-2 flex-none mt-0.5">
                          <Bot size={12} className="text-secondary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "rounded-tr-sm text-white"
                            : "rounded-tl-sm text-foreground/90"
                        }`}
                        style={msg.role === "user"
                          ? { background: "linear-gradient(135deg, hsl(38 90% 56% / 0.25), hsl(258 70% 60% / 0.2))", border: "1px solid rgba(245,166,35,0.25)" }
                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                        }
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center mr-2 flex-none mt-0.5">
                        <Bot size={12} className="text-secondary" />
                      </div>
                      <div
                        className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick prompts */}
                {messages.length === 0 && (
                  <div className="px-6 pb-3 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        data-testid={`quick-prompt-${p}`}
                        className="text-xs px-3 py-1.5 rounded-full border border-secondary/30 text-secondary/80 hover:bg-secondary/10 hover:border-secondary/50 transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row — always visible */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-t"
            style={{ borderColor: "rgba(139,92,246,0.12)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              onFocus={() => setExpanded(true)}
              placeholder="Film veya dizi sor... (örn: aksiyon öner)"
              data-testid="woxai-input"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              data-testid="woxai-send"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{
                background: input.trim() ? "linear-gradient(135deg, hsl(258 70% 60%), hsl(38 90% 56% / 0.6))" : "rgba(255,255,255,0.05)",
                boxShadow: input.trim() ? "0 0 12px rgba(139,92,246,0.5)" : "none",
              }}
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
