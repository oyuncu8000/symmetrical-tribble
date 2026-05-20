export interface WatchHistoryEntry {
  videoId: string;
  title: string;
  genre: string;
  playlistId: string;
  watchedAt: string;
}

const STORAGE_KEY = "woxstream_watch_history";

export function getWatchHistory(): WatchHistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToWatchHistory(entry: Omit<WatchHistoryEntry, "watchedAt">) {
  try {
    const history = getWatchHistory();
    const newEntry: WatchHistoryEntry = {
      ...entry,
      watchedAt: new Date().toISOString(),
    };
    
    // Remove duplicates
    const filtered = history.filter(h => h.videoId !== entry.videoId);
    filtered.unshift(newEntry);
    
    // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (error) {
    console.error("Failed to save watch history", error);
  }
}
