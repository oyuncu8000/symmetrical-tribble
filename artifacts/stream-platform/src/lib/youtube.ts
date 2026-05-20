// ▼ Buraya kendi YouTube Data API v3 anahtarını yaz
export const YOUTUBE_API_KEY = "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY";

export interface PlaylistItem {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
}

export async function fetchPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
    );
    if (!response.ok) throw new Error("Failed to fetch playlist");
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      thumbnail:
        item.snippet.thumbnails?.maxres?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url,
    }));
  } catch {
    return [
      { id: "1", title: "Video 1", videoId: "dQw4w9WgXcQ", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
      { id: "2", title: "Video 2", videoId: "M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
      { id: "3", title: "Video 3", videoId: "jNQXAC9IVRw", thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg" },
      { id: "4", title: "Video 4", videoId: "9bZkp7q19f0", thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg" },
      { id: "5", title: "Video 5", videoId: "kJQP7kiw5Fk", thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg" },
    ];
  }
}
