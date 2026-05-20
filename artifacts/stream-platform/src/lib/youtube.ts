export const YOUTUBE_API_KEY = "AIzaSyExample_REPLACE_ME_WITH_REAL_KEY";

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
    if (!response.ok) {
      throw new Error("Failed to fetch playlist");
    }
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    }));
  } catch (error) {
    console.error("YouTube API fallback used due to error or invalid key", error);
    // Fallback data
    return [
      { id: "1", title: "Fallback Video 1", videoId: "dQw4w9WgXcQ", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
      { id: "2", title: "Fallback Video 2", videoId: "M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
      { id: "3", title: "Fallback Video 3", videoId: "jNQXAC9IVRw", thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg" },
    ];
  }
}
