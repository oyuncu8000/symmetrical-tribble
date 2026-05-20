export interface WatchlistEntry {
  videoId: string;
  playlistId: string;
  title: string;
  image: string;
  genre: string;
  rating: string;
  year: number;
  description: string;
  addedAt: string;
}

const KEY = "woxstream_watchlist";

export function getWatchlist(): WatchlistEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function addToWatchlist(entry: Omit<WatchlistEntry, "addedAt">): void {
  const list = getWatchlist().filter(e => e.videoId !== entry.videoId);
  list.unshift({ ...entry, addedAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
}

export function removeFromWatchlist(videoId: string): void {
  const list = getWatchlist().filter(e => e.videoId !== videoId);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isInWatchlist(videoId: string): boolean {
  return getWatchlist().some(e => e.videoId === videoId);
}
