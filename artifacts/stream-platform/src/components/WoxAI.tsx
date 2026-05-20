import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWatchHistory } from "@/lib/watchHistory";
import { Sparkles, RefreshCw, Bot } from "lucide-react";

export function WoxAI() {
  const [recommendations, setRecommendations] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations("");
    
    try {
      const history = getWatchHistory();
      const historySummary = history.slice(0, 5).map(h => h.title).join(", ");
      
      const response = await fetch("https://api.llm7.io/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer unused"
        },
        body: JSON.stringify({
          model: "default",
          messages: [
            {
              role: "system", 
              content: "You are Wox AI, a smart streaming assistant. Respond in English with 3 short film/show recommendations based on the user's history, each on a new line with an emoji. Keep it brief and friendly."
            },
            {
              role: "user",
              content: `My watch history: ${historySummary || 'None'}. What should I watch next?`
            }
          ]
        })
      });
      
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setRecommendations(data.choices[0].message.content);
    } catch (error) {
      console.error(error);
      setRecommendations("🎬 The Matrix\n🚀 Inception\n⚔️ Blade Runner 2049");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-8 md:pl-16 pr-8 mb-12">
      <div className="relative rounded-2xl bg-card border border-secondary/30 p-6 md:p-8 overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)]">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                <Bot className="text-secondary" size={24} />
              </div>
              <h2 className="text-2xl font-bold font-['Bebas_Neue'] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                Wox AI Recommendations
              </h2>
            </div>
            
            <div className="min-h-[80px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {isLoading ? (
                <div className="flex items-center gap-2 text-secondary animate-pulse">
                  <Sparkles size={16} /> Thinking about what you'd like...
                </div>
              ) : recommendations ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {recommendations}
                </motion.div>
              ) : (
                <p className="text-muted-foreground italic">
                  {getWatchHistory().length > 0 
                    ? "Let Wox AI analyze your watch history to find your next favorite show."
                    : "Start watching to get personalized recommendations, or ask Wox AI for popular picks."}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex-none">
            <button 
              onClick={fetchRecommendations}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              {hasSearched ? "Refresh" : "Generate Picks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
