import { useEffect, useRef, useState } from "react";
import { PlayerControls } from "./PlayerControls";
import { fetchPlaylistItems, PlaylistItem } from "@/lib/youtube";
import { addToWatchHistory } from "@/lib/watchHistory";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  playlistId: string;
  onClose: () => void;
}

export function VideoPlayer({ videoId: initialVideoId, playlistId, onClose }: VideoPlayerProps) {
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPlaylistItems(playlistId).then(items => {
      setPlaylist(items);
      const idx = items.findIndex(i => i.videoId === currentVideoId);
      if (idx !== -1) setCurrentIndex(idx);
    });
  }, [playlistId]);

  useEffect(() => {
    if (playlist[currentIndex]) {
      addToWatchHistory({
        videoId: currentVideoId,
        title: playlist[currentIndex].title,
        genre: "Unknown",
        playlistId
      });
    }
  }, [currentVideoId, currentIndex, playlist, playlistId]);

  useEffect(() => {
    const initPlayer = () => {
      if (!iframeContainerRef.current) return;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        videoId: currentVideoId,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          autoplay: 1,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            setPlayer(e.target);
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              handleNext();
            }
          }
        }
      });
    };

    const loadApi = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        const existing = document.getElementById("yt-iframe-api");
        if (!existing) {
          const tag = document.createElement("script");
          tag.id = "yt-iframe-api";
          tag.src = "https://www.youtube.com/iframe_api";
          document.head.appendChild(tag);
        }
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    };

    loadApi();

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
      setPlayer(null);
    };
  }, []);

  useEffect(() => {
    if (player && player.loadVideoById) {
      player.loadVideoById(currentVideoId);
    }
  }, [currentVideoId]);

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setCurrentVideoId(playlist[next].videoId);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setCurrentVideoId(playlist[prev].videoId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex">
      {/* Video area */}
      <div className="relative flex-1 flex flex-col">
        {/* YouTube iframe fills the entire video area */}
        <div
          ref={iframeContainerRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />

        {/* Overlay sits ABOVE the iframe for controls */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{ zIndex: 2, pointerEvents: "none" }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
              pointerEvents: "auto",
            }}
          >
            <button
              onClick={onClose}
              data-testid="button-close-player"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-semibold tracking-wide hover:drop-shadow-[0_0_8px_rgba(245,166,35,0.8)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Ana Sayfa
            </button>
            <div className="text-center">
              <p className="text-white font-bold font-['Bebas_Neue'] text-xl tracking-widest">
                {playlist[currentIndex]?.title || "Yükleniyor..."}
              </p>
              <p className="text-primary text-xs font-mono mt-0.5">
                {currentIndex + 1} / {playlist.length || 1}
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(o => !o)}
              data-testid="button-toggle-sidebar"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-semibold tracking-wide"
              style={{ pointerEvents: "auto" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Playlist
            </button>
          </div>

          {/* Middle transparent — click-through to iframe */}
          <div className="flex-1" />

          {/* Custom control bar */}
          <div style={{ pointerEvents: "auto" }}>
            <PlayerControls
              player={player}
              onClose={onClose}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </div>
      </div>

      {/* Playlist sidebar */}
      {sidebarOpen && (
        <div
          className="w-80 bg-black/95 border-l border-white/10 flex flex-col overflow-hidden"
          style={{ zIndex: 3 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-white font-bold font-['Bebas_Neue'] tracking-widest text-lg">Playlist</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {playlist.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { setCurrentIndex(idx); setCurrentVideoId(item.videoId); }}
                data-testid={`playlist-item-${idx}`}
                className={`w-full text-left flex items-center gap-3 p-2 rounded-lg transition-all ${
                  idx === currentIndex
                    ? "bg-primary/20 border border-primary/50 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`text-xs font-mono w-5 text-center ${idx === currentIndex ? "text-primary" : "text-white/30"}`}>
                  {idx + 1}
                </span>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-10 object-cover rounded flex-shrink-0 bg-white/5"
                />
                <span className="text-xs leading-tight line-clamp-2">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
