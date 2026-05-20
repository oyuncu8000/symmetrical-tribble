import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { featuredHero } from "@/data/content";
import { Play, Info } from "lucide-react";

export function HeroBanner() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] flex items-end pb-20 md:pb-32 overflow-hidden bg-background">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <img
          src={featuredHero.backdrop}
          alt={featuredHero.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </motion.div>

      <div className="relative z-10 pl-8 md:pl-16 pr-8 max-w-3xl">
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-accent font-bold tracking-widest text-sm uppercase">Wox Original</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 font-['Bebas_Neue'] tracking-wide text-white drop-shadow-lg">
                {featuredHero.title}
              </h1>
              <div className="flex items-center gap-3 text-sm md:text-base text-foreground/80 mb-6 font-medium">
                <span className="text-green-400">{featuredHero.rating}</span>
                <span>{featuredHero.year}</span>
                <span>{featuredHero.genre}</span>
              </div>
              <p className="text-foreground/70 mb-8 max-w-2xl line-clamp-3 text-lg leading-relaxed">
                {featuredHero.description}
              </p>
              
              <div className="flex items-center gap-4">
                <Link href={`/player?playlistId=${featuredHero.playlistId}&videoId=${featuredHero.videoId}`}>
                  <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    <Play fill="currentColor" size={20} />
                    Watch Now
                  </button>
                </Link>
                <button className="flex items-center gap-2 bg-secondary/30 backdrop-blur-md border border-secondary/50 text-white px-6 py-3 rounded-lg font-bold hover:bg-secondary/50 transition-all hover:scale-105">
                  <Info size={20} />
                  More Info
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
