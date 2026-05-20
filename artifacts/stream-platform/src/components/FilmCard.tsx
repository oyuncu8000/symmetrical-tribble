import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FilmCardData } from "@/data/content";
import { Play, Plus, Check } from "lucide-react";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";

interface FilmCardProps {
  card: FilmCardData;
  isSpecial?: boolean;
}

const GENRE_GRADIENTS: Record<string, string> = {
  "Sci-Fi": "from-indigo-900 via-violet-900 to-purple-900",
  "Action": "from-red-900 via-orange-900 to-amber-900",
  "Drama": "from-slate-800 via-zinc-800 to-stone-800",
  "Thriller": "from-gray-900 via-neutral-800 to-zinc-900",
  "Romance": "from-rose-900 via-pink-900 to-fuchsia-900",
  "Fantasy": "from-emerald-900 via-teal-900 to-cyan-900",
  "Horror": "from-red-950 via-gray-900 to-black",
  "Adventure": "from-sky-900 via-blue-900 to-indigo-900",
  "Crime": "from-zinc-900 via-slate-800 to-gray-900",
  "Monster": "from-green-900 via-emerald-900 to-teal-900",
};
function getGradient(genre: string) {
  const key = Object.keys(GENRE_GRADIENTS).find(g => genre.includes(g));
  return key ? GENRE_GRADIENTS[key] : "from-zinc-900 via-slate-800 to-gray-900";
}

export function FilmCard({ card, isSpecial = false }: FilmCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [inList, setInList] = useState(isInWatchlist(card.videoId));

  const gradient = getGradient(card.genre);
  const cardWidth = isSpecial ? "w-[380px]" : "w-[300px]";

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(card.videoId);
      setInList(false);
    } else {
      addToWatchlist({
        videoId: card.videoId, playlistId: card.playlistId, title: card.title,
        image: card.image, genre: card.genre, rating: card.rating, year: card.year, description: card.description,
      });
      setInList(true);
    }
  };

  return (
    <Link href={`/detail?videoId=${card.videoId}`}>
      <motion.div
        data-testid={`card-film-${card.videoId}`}
        className={`relative flex-none cursor-pointer rounded-xl overflow-hidden ${cardWidth} aspect-video ${
          isSpecial ? "border border-primary/25" : ""
        }`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.06, zIndex: 20, y: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Thumbnail */}
        {!imgError ? (
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}

        {/* Shimmer effect for special cards */}
        {isSpecial && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            />
          </div>
        )}

        {/* Persistent gradient + info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <p className="text-white text-sm font-bold leading-tight line-clamp-1 drop-shadow-lg">{card.title}</p>
          <p className="text-white/50 text-xs mt-0.5">{card.year} · {card.genre.split("/")[0].trim()}</p>
        </div>

        {/* Watchlist quick-add button (top-right) */}
        <button
          onClick={handleWatchlist}
          data-testid={`card-watchlist-${card.videoId}`}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
            inList ? "bg-primary text-black shadow-[0_0_10px_rgba(245,166,35,0.6)]" : "bg-black/50 text-white/70 hover:bg-primary/80 hover:text-black"
          } ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{ pointerEvents: "auto" }}
        >
          {inList ? <Check size={13} strokeWidth={3} /> : <Plus size={13} strokeWidth={3} />}
        </button>

        {/* Special badge */}
        {isSpecial && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent/90 text-accent-foreground text-xs font-bold rounded shadow-lg backdrop-blur-sm tracking-widest font-['Bebas_Neue']">
            ORIGINAL
          </div>
        )}

        {/* Hover glow ring */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={isSpecial
                ? { boxShadow: "inset 0 0 0 2px hsl(45 100% 51%)", filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))" }
                : { boxShadow: "inset 0 0 0 2px hsl(38 90% 56%)", filter: "drop-shadow(0 0 16px rgba(245,166,35,0.45))" }
              }
            />
          )}
        </AnimatePresence>

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-gradient-to-t from-black/96 via-black/65 to-black/20 p-4 flex flex-col justify-end"
            >
              <h3 className="font-bold text-base leading-tight mb-1 text-white line-clamp-1">{card.title}</h3>
              <div className="flex items-center gap-2 text-xs text-white/65 mb-3">
                <span className="text-green-400 font-semibold">{card.rating}</span>
                <span>·</span>
                <span>{card.year}</span>
                <span>·</span>
                <span>{card.genre.split("/")[0].trim()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold text-black text-xs shadow-[0_0_12px_rgba(245,166,35,0.4)] transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, hsl(38 90% 56%), hsl(45 100% 51%))" }}
                >
                  <Play size={13} fill="currentColor" /> Detay
                </button>
                <button
                  onClick={handleWatchlist}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all hover:scale-105 ${
                    inList ? "bg-primary/20 border-primary text-primary" : "bg-white/8 border-white/20 text-white/80"
                  }`}
                  style={{ pointerEvents: "auto" }}
                >
                  {inList ? <Check size={13} strokeWidth={3} /> : <Plus size={13} strokeWidth={3} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
