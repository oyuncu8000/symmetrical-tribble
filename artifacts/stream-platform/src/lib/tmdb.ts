export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const TMDB_KEY_STORAGE = "woxstream_tmdb_key";

export function getTmdbKey(): string {
  try { return localStorage.getItem(TMDB_KEY_STORAGE) || ""; } catch { return ""; }
}
export function setTmdbKey(key: string): void {
  try { localStorage.setItem(TMDB_KEY_STORAGE, key); } catch {}
}

export function tmdbPoster(path: string, size: "w342" | "w500" | "w780" | "original" = "w780") {
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
export function tmdbBackdrop(path: string, size: "w780" | "w1280" | "original" = "w1280") {
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export interface TmdbSearchResult {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  year: string;
  rating: string;
  mediaType: "movie" | "tv";
  genres: string;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure",
  10762: "Kids", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy",
  10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

export async function searchTmdb(query: string): Promise<TmdbSearchResult[]> {
  const key = getTmdbKey();
  if (!key) return [];
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${encodeURIComponent(query)}&language=tr-TR&page=1`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || [])
      .filter((r: any) => (r.media_type === "movie" || r.media_type === "tv") && (r.poster_path || r.backdrop_path))
      .slice(0, 8)
      .map((r: any) => ({
        id: r.id,
        title: r.title || r.name || "Unknown",
        poster: r.poster_path ? tmdbPoster(r.poster_path) : "",
        backdrop: r.backdrop_path ? tmdbBackdrop(r.backdrop_path) : "",
        overview: r.overview || "",
        year: (r.release_date || r.first_air_date || "").slice(0, 4),
        rating: r.vote_average ? (r.vote_average as number).toFixed(1) + "/10" : "N/A",
        mediaType: r.media_type,
        genres: (r.genre_ids || []).slice(0, 2).map((id: number) => GENRE_MAP[id] || "").filter(Boolean).join(" / "),
      }));
  } catch {
    return [];
  }
}
