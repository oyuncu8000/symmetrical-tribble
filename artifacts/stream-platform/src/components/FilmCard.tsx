import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FilmCardData } from "@/data/content";
import { Play } from "lucide-react";

interface FilmCardProps {
  card: FilmCardData;
  isSpecial?: boolean;
}

export function FilmCard({ card, isSpecial = false }: FilmCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/player?playlistId=${card.playlistId}&videoId=${card.videoId}`}>
      <motion.div
        className={`relative flex-none cursor-pointer rounded-lg overflow-hidden ${
          isSpecial ? "w-[340px] aspect-video border-2 border-primary/20" : "w-[280px] aspect-video"
        }`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.08, zIndex: 10, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Glow border and shadow on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 rounded-lg pointer-events-none ${
                isSpecial ? "ring-2 ring-accent shadow-[0_0_20px_rgba(255,215,0,0.4)]" : "ring-2 ring-primary shadow-[0_0_15px_rgba(245,166,35,0.4)]"
              }`}
            />
          )}
        </AnimatePresence>

        {isSpecial && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent/90 text-accent-foreground text-xs font-bold rounded shadow-lg backdrop-blur-sm tracking-widest font-['Bebas_Neue']">
            ORIGINAL
          </div>
        )}

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4 flex flex-col justify-end"
            >
              <h3 className="font-bold text-lg leading-tight mb-1 text-white">{card.title}</h3>
              <div className="flex items-center gap-2 text-xs text-foreground/80 mb-3">
                <span className="text-green-400 font-semibold">{card.rating}</span>
                <span>•</span>
                <span>{card.year}</span>
                <span>•</span>
                <span>{card.genre}</span>
              </div>
              <button className="flex items-center justify-center gap-2 bg-white text-black font-semibold py-1.5 px-4 rounded-md hover:bg-white/90 transition-colors w-full">
                <Play size={16} fill="currentColor" /> Play Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
