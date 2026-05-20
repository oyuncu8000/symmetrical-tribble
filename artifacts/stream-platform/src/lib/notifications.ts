export interface NotificationEntry {
  videoId: string;
  title: string;
  genre: string;
  enabledAt: string;
}

const KEY = "woxstream_notifications";

export function getNotifications(): NotificationEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function toggleNotification(entry: Omit<NotificationEntry, "enabledAt">): boolean {
  const list = getNotifications();
  const idx = list.findIndex(n => n.videoId === entry.videoId);
  if (idx >= 0) {
    list.splice(idx, 1);
    localStorage.setItem(KEY, JSON.stringify(list));
    return false;
  } else {
    list.unshift({ ...entry, enabledAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  }
}

export function hasNotification(videoId: string): boolean {
  return getNotifications().some(n => n.videoId === videoId);
}
