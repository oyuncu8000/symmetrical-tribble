import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlayerControlsProps {
  player: any;
  title: string;
  progress: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PlayerControls({ player, title, progress, onClose, onNext, onPrev }: PlayerControlsProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      try {
        if (player.getCurrentTime) setCurrentTime(player.getCurrentTime());
        if (player.getDuration) setDuration(player.getDuration());
      } catch (e) {}
    }, 1000);

    const handleMouseMove = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsVisible(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [player]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(volume);
    } else {
      player.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const time = Number(e.target.value);
    player.seekTo(time);
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-0 left-0 right-0 px-8 py-6 bg-black/85 backdrop-blur-xl border-t border-white/10"
        >
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-4 mb-4">
            <span className="text-xs font-mono text-white/70 w-12 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 appearance-none bg-white/20 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,166,35,0.8)] cursor-pointer"
            />
            <span className="text-xs font-mono text-white/70 w-12">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={onPrev} className="text-white/80 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
                <SkipBack size={24} />
              </button>
              
              <button 
                onClick={togglePlay} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>

              <button onClick={onNext} className="text-white/80 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
                <SkipForward size={24} />
              </button>

              <div className="flex items-center gap-2 ml-4">
                <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="font-bold text-lg text-white font-['Bebas_Neue'] tracking-wider">{title}</h3>
              <span className="text-xs text-primary font-mono">{progress}</span>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => document.documentElement.requestFullscreen()} 
                className="text-white/80 hover:text-white transition-colors"
              >
                <Maximize size={20} />
              </button>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-destructive hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.5)] transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
