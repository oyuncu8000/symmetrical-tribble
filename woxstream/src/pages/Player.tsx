import { useLocation } from "wouter";
import { VideoPlayer } from "@/components/VideoPlayer";
import { motion } from "framer-motion";

export default function Player() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const videoId = searchParams.get("videoId");
  const playlistId = searchParams.get("playlistId");

  if (!videoId || !playlistId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Invalid video parameters.</p>
        <button onClick={() => setLocation("/")} className="ml-4 text-primary underline">Go back</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <VideoPlayer 
        videoId={videoId} 
        playlistId={playlistId} 
        onClose={() => setLocation("/")} 
      />
    </motion.div>
  );
}
