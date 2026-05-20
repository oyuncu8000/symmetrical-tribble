import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Check, Bell, BellOff, Heart, ArrowLeft, Star } from "lucide-react";
import { Layout } from "@/components/Layout";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { isLiked, toggleLike } from "@/lib/likes";
import { hasNotification, toggleNotification } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

export default function SearchDetail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);

  const videoId = params.get("videoId") || "dQw4w9WgXcQ";
  const playlistId = params.get("playlistId") || "PLJuI8TslmruDEkt4JMw9oZ3ZeDB0j932T";
  const title = params.get("title") || "Bilinmeyen";
  const image = params.get("image") || "";
  const backdrop = params.get("backdrop") || image;
  const genre = params.get("genre") || "Drama";
  const rating = params.get("rating") || "N/A";
  const year = params.get("year") || "";
  const description = params.get("description") || "";

  const [inWatchlist, setInWatchlist] = useState(isInWatchlist(videoId));
  const [liked, setLiked] = useState(isLiked(videoId));
  const [notified, setNotified] = useState(hasNotification(videoId));
  const [imgError, setImgError] = useState(false);

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(videoId);
      setInWatchlist(false);
      toast({ title: "Listeden çıkarıldı", description: `${title} watchlist'ten kaldırıldı.` });
    } else {
      addToWatchlist({ videoId, playlistId, title, image, genre, rating, year: Number(year), description });
      setInWatchlist(true);
      toast({ title: "Listeye eklendi!", description: `${title} watchlist'e eklendi.` });
    }
  };

  const handleLike = () => {
    const nowLiked = toggleLike({ videoId, title, genre });
    setLiked(nowLiked);
    toast({ title: nowLiked ? "Beğenildi!" : "Beğeni kaldırıldı", description: nowLiked ? "Wox AI bu tercihi öğrenecek." : undefined });
  };

  const handleNotification = () => {
    const on = toggleNotification({ videoId, title, genre });
    setNotified(on);
    toast({ title: on ? "Bildirim açıldı!" : "Bildirim kapatıldı", description: on ? `${title} için yeni bölüm bildirimi alacaksınız.` : undefined });
  };

  const displayBackdrop = !imgError && (backdrop || image);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
          {displayBackdrop ? (
            <motion.img
              src={displayBackdrop}
              alt={title}
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
          <button
            onClick={() => setLocation("/")}
            className="absolute top-24 left-6 md:left-16 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> Geri
          </button>
        </div>

        <div className="relative -mt-40 z-10 px-6 md:px-16 pb-20">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-none hidden md:block"
            >
              {image && (
                <div className="w-48 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10">
                  <img src={image} alt={title} className="w-full aspect-[2/3] object-cover" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-2 py-0.5 rounded">
                  {genre.split("/")[0].trim()}
                </span>
                {year && <span className="text-xs text-muted-foreground">{year}</span>}
                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">TMDB</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-['Bebas_Neue'] tracking-wide text-white mb-3">{title}</h1>

              {rating !== "N/A" && (
                <div className="flex items-center gap-1.5 text-yellow-400 mb-4">
                  <Star size={16} fill="currentColor" />
                  <span className="font-bold text-sm">{rating}</span>
                  <span className="text-muted-foreground text-sm ml-1">· {genre}</span>
                </div>
              )}

              {description && (
                <p className="text-foreground/70 text-base leading-relaxed max-w-2xl mb-8">{description}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link href={`/player?playlistId=${playlistId}&videoId=${videoId}`}>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-black text-base shadow-[0_0_20px_rgba(245,166,35,0.4)]"
                    style={{ background: "linear-gradient(135deg, hsl(38 90% 56%), hsl(45 100% 51%))" }}
                  >
                    <Play size={20} fill="currentColor" /> İzle
                  </motion.button>
                </Link>

                <motion.button
                  onClick={handleWatchlist}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    inWatchlist ? "bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(245,166,35,0.3)]" : "bg-white/5 border-white/20 text-white/80 hover:border-white/40"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {inWatchlist
                      ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={18} /></motion.span>
                      : <motion.span key="p" initial={{ scale: 0 }} animate={{ scale: 1 }}><Plus size={18} /></motion.span>}
                  </AnimatePresence>
                  {inWatchlist ? "Listede" : "Listeye Ekle"}
                </motion.button>

                <motion.button
                  onClick={handleNotification}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    notified ? "bg-secondary/20 border-secondary text-secondary" : "bg-white/5 border-white/20 text-white/70 hover:border-secondary/50"
                  }`}
                >
                  {notified ? <><Bell size={18} fill="currentColor" /> Bildirim Açık</> : <><BellOff size={18} /> Bildirim Al</>}
                </motion.button>

                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    liked ? "bg-rose-500/20 border-rose-500 text-rose-400" : "bg-white/5 border-white/20 text-white/70 hover:border-rose-500/50"
                  }`}
                >
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                  {liked ? "Beğenildi" : "Beğen"}
                </motion.button>
              </div>

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
        </div>
      </div>
    </Layout>
  );
}
