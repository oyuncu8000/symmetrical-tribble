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
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentTime] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId);

  useEffect(() => {
    fetchPlaylistItems(playlistId).then(items => {
      setPlaylist(items);
      const idx = items.findIndex(i => i.videoId === currentVideoId);
      if (idx !== -1) setCurrentTime(idx);
    });
  }, [playlistId, currentVideoId]);

  useEffect(() => {
    if (playlist[currentIndex]) {
      addToWatchHistory({
        videoId: currentVideoId,
        title: playlist[currentIndex].title,
        genre: "Unknown", // Can be enhanced
        playlistId
      });
    }
  }, [currentVideoId, currentIndex, playlist, playlistId]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.document.body.appendChild(tag);
    }

    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: currentVideoId,
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          autoplay: 1,
          disablekb: 1,
          iv_load_policy: 3
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

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (player && player.loadVideoById) {
      player.loadVideoById(currentVideoId);
    }
  }, [currentVideoId]);

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentTime(currentIndex + 1);
      setCurrentVideoId(playlist[currentIndex + 1].videoId);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentTime(currentIndex - 1);
      setCurrentVideoId(playlist[currentIndex - 1].videoId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex-1 relative overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 z-0 scale-150 blur-3xl opacity-20 bg-primary/20 pointer-events-none" />
        {/* We need the iframe to be clickable for the video, so pointer-events-auto */}
        <div className="w-[85vw] h-[85vh] relative z-10 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto ring-1 ring-white/10">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
      
      <PlayerControls 
        player={player}
        title={playlist[currentIndex]?.title || "Loading..."}
        progress={`${currentIndex + 1} / ${playlist.length || 1}`}
        onClose={onClose}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
