import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FilmCardData } from "@/data/content";
import { Play } from "lucide-react";

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

  const gradient = getGradient(card.genre);

  return (
    <Link href={`/player?playlistId=${card.playlistId}&videoId=${card.videoId}`}>
      <motion.div
        data-testid={`card-film-${card.videoId}`}
        className={`relative flex-none cursor-pointer rounded-xl overflow-hidden ${
          isSpecial
            ? "w-[320px] aspect-video border border-primary/30"
            : "w-[260px] aspect-video"
        }`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.07, zIndex: 10, y: -6 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Image or fallback gradient */}
        {!imgError ? (
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-end p-3`}>
            <span className="text-white/30 text-xs font-mono uppercase tracking-widest">{card.genre}</span>
          </div>
        )}

        {/* Always-visible bottom gradient + title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <p className="text-white text-sm font-bold leading-tight line-clamp-1 drop-shadow-md">{card.title}</p>
          <p className="text-white/50 text-xs mt-0.5">{card.year} · {card.genre.split("/")[0].trim()}</p>
        </div>

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
              className={`absolute inset-0 rounded-xl pointer-events-none ${
                isSpecial
                  ? "ring-2 ring-accent shadow-[0_0_24px_rgba(255,215,0,0.5)]"
                  : "ring-2 ring-primary shadow-[0_0_20px_rgba(245,166,35,0.45)]"
              }`}
            />
          )}
        </AnimatePresence>

        {/* Hover overlay info */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20 p-4 flex flex-col justify-end"
            >
              <h3 className="font-bold text-base leading-tight mb-1 text-white">{card.title}</h3>
              <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
                <span className="text-green-400 font-semibold">{card.rating}</span>
                <span>·</span>
                <span>{card.year}</span>
                <span>·</span>
                <span>{card.genre.split("/")[0].trim()}</span>
              </div>
              <button className="flex items-center justify-center gap-2 bg-white text-black font-bold py-1.5 px-4 rounded-lg hover:bg-primary hover:text-black transition-colors w-full text-sm shadow-[0_0_12px_rgba(245,166,35,0.4)]">
                <Play size={14} fill="currentColor" /> İzle
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
