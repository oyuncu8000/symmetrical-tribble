export const TMDB_API_KEY = "YOUR_TMDB_API_KEY_HERE";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function tmdbPoster(path: string, size: "w342" | "w500" | "w780" | "original" = "w780") {
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function tmdbBackdrop(path: string, size: "w780" | "w1280" | "original" = "w1280") {
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
