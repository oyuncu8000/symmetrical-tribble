import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Check, Bell, BellOff, Heart, ArrowLeft, Star } from "lucide-react";
import { Layout } from "@/components/Layout";
import { FilmCard } from "@/components/FilmCard";
import { sliders } from "@/data/content";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { isLiked, toggleLike } from "@/lib/likes";
import { hasNotification, toggleNotification } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

export default function Detail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("videoId") || "";

  const allCards = sliders.flatMap(s => s.cards);
  const card = allCards.find(c => c.videoId === videoId) || allCards[0];

  const [inWatchlist, setInWatchlist] = useState(isInWatchlist(card.videoId));
  const [liked, setLiked] = useState(isLiked(card.videoId));
  const [notified, setNotified] = useState(hasNotification(card.videoId));
  const [imgError, setImgError] = useState(false);

  const related = sliders
    .flatMap(s => s.cards)
    .filter(c => c.videoId !== card.videoId && c.genre.split("/")[0].trim() === card.genre.split("/")[0].trim())
    .slice(0, 6);

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(card.videoId);
      setInWatchlist(false);
      toast({ title: "Listeden çıkarıldı", description: `${card.title} watchlist'ten kaldırıldı.` });
    } else {
      addToWatchlist({
        videoId: card.videoId,
        playlistId: card.playlistId,
        title: card.title,
        image: card.image,
        genre: card.genre,
        rating: card.rating,
        year: card.year,
        description: card.description,
      });
      setInWatchlist(true);
      toast({ title: "Listeye eklendi!", description: `${card.title} watchlist'e eklendi.` });
    }
  };

  const handleLike = () => {
    const nowLiked = toggleLike({ videoId: card.videoId, title: card.title, genre: card.genre });
    setLiked(nowLiked);
    toast({
      title: nowLiked ? "Beğenildi!" : "Beğeni kaldırıldı",
      description: nowLiked ? "Wox AI bu tercihi öğrenecek." : undefined,
    });
  };

  const handleNotification = () => {
    const on = toggleNotification({ videoId: card.videoId, title: card.title, genre: card.genre });
    setNotified(on);
    toast({
      title: on ? "Bildirim açıldı!" : "Bildirim kapatıldı",
      description: on ? `${card.title} için yeni bölüm bildirimi alacaksınız.` : undefined,
    });
  };

  const backdropUrl = !imgError ? (card.backdrop || card.image) : "";

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero backdrop */}
        <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
          {backdropUrl ? (
            <motion.img
              key={backdropUrl}
              src={backdropUrl}
              alt={card.title}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-slate-800 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => setLocation("/")}
            data-testid="button-back"
            className="absolute top-24 left-6 md:left-16 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Geri
          </button>
        </div>

        {/* Content */}
        <div className="relative -mt-40 z-10 px-6 md:px-16 pb-20">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-none hidden md:block"
            >
              <div className="w-48 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full aspect-[2/3] object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-2 py-0.5 rounded">
                  {card.genre.split("/")[0].trim()}
                </span>
                <span className="text-xs text-muted-foreground">{card.year}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-['Bebas_Neue'] tracking-wide text-white mb-3">
                {card.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold text-sm">{card.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">{card.genre}</span>
              </div>

              <p className="text-foreground/70 text-base leading-relaxed max-w-2xl mb-8">
                {card.description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href={`/player?playlistId=${card.playlistId}&videoId=${card.videoId}`}>
                  <motion.button
                    data-testid="button-watch"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-black text-base shadow-[0_0_20px_rgba(245,166,35,0.4)]"
                    style={{ background: "linear-gradient(135deg, hsl(38 90% 56%), hsl(45 100% 51%))" }}
                  >
                    <Play size={20} fill="currentColor" />
                    İzle
                  </motion.button>
                </Link>

                <motion.button
                  data-testid="button-watchlist"
                  onClick={handleWatchlist}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    inWatchlist
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(245,166,35,0.3)]"
                      : "bg-white/5 border-white/20 text-white/80 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {inWatchlist
                      ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={18} /></motion.span>
                      : <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Plus size={18} /></motion.span>
                    }
                  </AnimatePresence>
                  {inWatchlist ? "Listede" : "Listeye Ekle"}
                </motion.button>

                <motion.button
                  data-testid="button-notification"
                  onClick={handleNotification}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    notified
                      ? "bg-secondary/20 border-secondary text-secondary shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "bg-white/5 border-white/20 text-white/70 hover:border-secondary/50 hover:bg-secondary/10"
                  }`}
                >
                  {notified
                    ? <><Bell size={18} fill="currentColor" /> Bildirim Açık</>
                    : <><BellOff size={18} /> Bildirim Al</>
                  }
                </motion.button>

                <motion.button
                  data-testid="button-like"
                  onClick={handleLike}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    liked
                      ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                      : "bg-white/5 border-white/20 text-white/70 hover:border-rose-500/50 hover:bg-rose-500/10"
                  }`}
                >
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                  {liked ? "Beğenildi" : "Beğen"}
                </motion.button>
              </div>

              {/* Status row */}
              {(inWatchlist || liked || notified) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center flex-wrap gap-3 mt-5 text-xs text-muted-foreground"
                >
                  {inWatchlist && <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10"><Check size={11} className="text-primary" /> Listenizde</span>}
                  {notified && <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-secondary/20"><Bell size={11} className="text-secondary" /> Bildirim aktif</span>}
                  {liked && <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-rose-500/20"><Heart size={11} className="text-rose-400" fill="currentColor" /> Beğendiniz — Wox AI bunu öğrendi</span>}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Related content */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider text-white mb-5 flex items-center gap-2">
                <span className="text-primary">|</span> Benzer İçerikler
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {related.map((c, i) => (
                  <div key={i} className="flex-none">
                    <FilmCard card={c} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
