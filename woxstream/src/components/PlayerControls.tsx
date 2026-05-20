import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlayerControlsProps {
  player: any;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PlayerControls({ player, onNext, onPrev }: PlayerControlsProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!player) return;

    intervalRef.current = setInterval(() => {
      try {
        if (typeof player.getCurrentTime === "function") setCurrentTime(player.getCurrentTime());
        if (typeof player.getDuration === "function") setDuration(player.getDuration());
        const state = player.getPlayerState?.();
        if (state === 1) setIsPlaying(true);
        if (state === 2) setIsPlaying(false);
      } catch (_) {}
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [player]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsVisible(false), 3500);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(volume);
    } else {
      player.mute();
    }
    setIsMuted(v => !v);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const v = Number(e.target.value);
    setVolume(v);
    player.setVolume(v);
    if (v === 0) {
      player.mute();
      setIsMuted(true);
    } else {
      player.unMute();
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const t = Number(e.target.value);
    player.seekTo(t, true);
    setCurrentTime(t);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full px-6 pb-6 pt-4"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)",
          }}
        >
          {/* Seek bar */}
          <div className="w-full flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-white/60 w-10 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 h-1 group">
              <div className="absolute inset-0 rounded-full bg-white/20" />
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(to right, hsl(38 90% 56%), hsl(45 100% 51%))",
                  boxShadow: "0 0 8px rgba(245,166,35,0.7)",
                }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                data-testid="seek-bar"
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                style={{ zIndex: 10 }}
              />
            </div>
            <span className="text-xs font-mono text-white/60 w-10 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Left: play controls + volume */}
            <div className="flex items-center gap-5">
              <button
                onClick={onPrev}
                data-testid="button-prev"
                className="text-white/70 hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] transition-all active:scale-90"
              >
                <SkipBack size={22} />
              </button>

              <button
                onClick={togglePlay}
                data-testid="button-play-pause"
                className="w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-90"
                style={{
                  background: "hsl(38 90% 56%)",
                  boxShadow: "0 0 20px rgba(245,166,35,0.6), 0 0 40px rgba(245,166,35,0.2)",
                }}
              >
                {isPlaying
                  ? <Pause size={20} fill="black" color="black" />
                  : <Play size={20} fill="black" color="black" className="ml-0.5" />
                }
              </button>

              <button
                onClick={onNext}
                data-testid="button-next"
                className="text-white/70 hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] transition-all active:scale-90"
              >
                <SkipForward size={22} />
              </button>

              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={toggleMute}
                  data-testid="button-mute"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div className="relative w-20 h-1 group hidden sm:block">
                  <div className="absolute inset-0 rounded-full bg-white/20" />
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-white/70"
                    style={{ width: `${isMuted ? 0 : volume}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    data-testid="volume-slider"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  />
                </div>
              </div>
            </div>

            {/* Right: fullscreen */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => document.documentElement.requestFullscreen?.()}
                data-testid="button-fullscreen"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
