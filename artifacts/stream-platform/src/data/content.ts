export interface FilmCardData {
  title: string;
  image: string;
  playlistId: string;
  videoId: string;
  genre: string;
  rating: string;
  year: number;
  description: string;
}

export interface SliderData {
  id: string;
  title: string;
  type: "regular" | "special";
  cards: FilmCardData[];
}

const regularThumbnails = [
  "dQw4w9WgXcQ", "M7lc1UVf-VE", "jNQXAC9IVRw", "9bZkp7q19f0", "kJQP7kiw5Fk", "OPf0YbXqDm0"
];

const regularThumbnails2 = [
  "YQHsXMglC9A", "ZZ5LpwO-An4", "PT2_F-1esPk", "9bZkp7q19f0", "JGwWNGJdvx8", "fJ9rUzIMcZQ"
];

const specialThumbnails = [
  "Lp7e9GNgfM0", "7wtfhZwyrcc", "vx2u5uUu3DE", "2vjPBrBU-TM", "2Vv-BfVoq4g", "RgKAFK5djSk"
];

const createCard = (videoId: string, title: string, genre: string, description: string): FilmCardData => ({
  title,
  image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  playlistId: "PLJuI8TslmruDEkt4JMw9oZ3ZeDB0j932T",
  videoId,
  genre,
  rating: (Math.random() * 2 + 7.5).toFixed(1) + "/10",
  year: 2020 + Math.floor(Math.random() * 4),
  description,
});

export const sliders: SliderData[] = [
  {
    id: "trending",
    title: "🔥 Trending Now",
    type: "regular",
    cards: regularThumbnails.map((id, i) => createCard(id, `Trending Movie ${i+1}`, "Action", "A spectacular journey through space and time."))
  },
  {
    id: "action",
    title: "🎬 Action & Adventure",
    type: "regular",
    cards: regularThumbnails2.map((id, i) => createCard(id, `Adventures of ${i+1}`, "Adventure", "A spectacular journey through space and time."))
  },
  {
    id: "originals",
    title: "⭐ WoxStream Originals",
    type: "special",
    cards: specialThumbnails.map((id, i) => createCard(id, `Wox Original ${i+1}`, "Sci-Fi", "A spectacular journey through space and time."))
  },
  {
    id: "scifi",
    title: "🌙 Sci-Fi Collection",
    type: "regular",
    cards: regularThumbnails.reverse().map((id, i) => createCard(id, `Sci-Fi Epic ${i+1}`, "Sci-Fi", "A spectacular journey through space and time."))
  },
  {
    id: "picks",
    title: "🏆 Top Picks For You",
    type: "special",
    cards: specialThumbnails.reverse().map((id, i) => createCard(id, `Recommended ${i+1}`, "Drama", "A spectacular journey through space and time."))
  }
];

export const featuredHero: FilmCardData = {
  title: "The Neon Protocol",
  image: "https://img.youtube.com/vi/Lp7e9GNgfM0/maxresdefault.jpg",
  playlistId: "PLJuI8TslmruDEkt4JMw9oZ3ZeDB0j932T",
  videoId: "Lp7e9GNgfM0",
  genre: "Cyberpunk Action",
  rating: "9.5/10",
  year: 2024,
  description: "In a world illuminated by neon and run by rogue AI, one hacker must infiltrate the darkest corners of the network to uncover a truth that could shatter reality itself."
};
