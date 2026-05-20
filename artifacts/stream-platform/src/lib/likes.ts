export interface LikeEntry {
  videoId: string;
  title: string;
  genre: string;
  likedAt: string;
}

const KEY = "woxstream_likes";

export function getLikes(): LikeEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function toggleLike(entry: Omit<LikeEntry, "likedAt">): boolean {
  const likes = getLikes();
  const existing = likes.findIndex(l => l.videoId === entry.videoId);
  if (existing >= 0) {
    likes.splice(existing, 1);
    localStorage.setItem(KEY, JSON.stringify(likes));
    return false;
  } else {
    likes.unshift({ ...entry, likedAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(likes.slice(0, 200)));
    return true;
  }
}

export function isLiked(videoId: string): boolean {
  return getLikes().some(l => l.videoId === videoId);
}
