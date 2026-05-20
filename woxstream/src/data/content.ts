import { tmdbPoster, tmdbBackdrop } from "@/lib/tmdb";

export interface FilmCardData {
  title: string;
  image: string;
  backdrop: string;
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

const PLAYLIST = "PLJuI8TslmruDEkt4JMw9oZ3ZeDB0j932T";

export const sliders: SliderData[] = [
  {
    id: "trending",
    title: "🔥 Trending Now",
    type: "regular",
    cards: [
      {
        title: "Inception",
        image: tmdbPoster("/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"),
        backdrop: tmdbBackdrop("/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"),
        playlistId: PLAYLIST, videoId: "dQw4w9WgXcQ",
        genre: "Sci-Fi / Thriller", rating: "8.8/10", year: 2010,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO."
      },
      {
        title: "The Dark Knight",
        image: tmdbPoster("/qJ2tW6WMUDux911r6m7haRef0WH.jpg"),
        backdrop: tmdbBackdrop("/nMKdUFyrkirBBii53MXfung2Qes.jpg"),
        playlistId: PLAYLIST, videoId: "M7lc1UVf-VE",
        genre: "Action / Crime", rating: "9.0/10", year: 2008,
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests."
      },
      {
        title: "Interstellar",
        image: tmdbPoster("/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"),
        backdrop: tmdbBackdrop("/pbrkL804KoFoZAGbHMoZyD1qOkw.jpg"),
        playlistId: PLAYLIST, videoId: "jNQXAC9IVRw",
        genre: "Sci-Fi / Drama", rating: "8.7/10", year: 2014,
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
      },
      {
        title: "Oppenheimer",
        image: tmdbPoster("/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"),
        backdrop: tmdbBackdrop("/fm6KqXpkh7wKqtt2QdYq9VNGOe6.jpg"),
        playlistId: PLAYLIST, videoId: "9bZkp7q19f0",
        genre: "History / Drama", rating: "8.3/10", year: 2023,
        description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II."
      },
      {
        title: "Dune: Part Two",
        image: tmdbPoster("/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"),
        backdrop: tmdbBackdrop("/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"),
        playlistId: PLAYLIST, videoId: "kJQP7kiw5Fk",
        genre: "Sci-Fi / Adventure", rating: "8.5/10", year: 2024,
        description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
      },
      {
        title: "The Matrix",
        image: tmdbPoster("/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"),
        backdrop: tmdbBackdrop("/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg"),
        playlistId: PLAYLIST, videoId: "OPf0YbXqDm0",
        genre: "Sci-Fi / Action", rating: "8.7/10", year: 1999,
        description: "A computer hacker learns the true nature of his reality and his role in the war against its controllers."
      },
    ]
  },
  {
    id: "action",
    title: "🎬 Action & Adventure",
    type: "regular",
    cards: [
      {
        title: "John Wick",
        image: tmdbPoster("/wXqWR7dHncNReLmrlCtgxnBoJng.jpg"),
        backdrop: tmdbBackdrop("/umC04Cozevu8nn3ZTIWX0FrQBGY.jpg"),
        playlistId: PLAYLIST, videoId: "YQHsXMglC9A",
        genre: "Action / Thriller", rating: "7.4/10", year: 2014,
        description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him."
      },
      {
        title: "Mad Max: Fury Road",
        image: tmdbPoster("/kqjL17yufvn9OVLyXYpvtyrFfak.jpg"),
        backdrop: tmdbBackdrop("/phszHPFbhOoRDNBQRBCcBBBOQnbr.jpg"),
        playlistId: PLAYLIST, videoId: "ZZ5LpwO-An4",
        genre: "Action / Adventure", rating: "8.1/10", year: 2015,
        description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners."
      },
      {
        title: "Top Gun: Maverick",
        image: tmdbPoster("/62HCnUTHjWTObPniPix7iiEXVye.jpg"),
        backdrop: tmdbBackdrop("/AkB0HoGPzCCABwrBxXlv37OfkWe.jpg"),
        playlistId: PLAYLIST, videoId: "PT2_F-1esPk",
        genre: "Action / Drama", rating: "8.3/10", year: 2022,
        description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past."
      },
      {
        title: "Mission: Impossible",
        image: tmdbPoster("/NNxYkU70HPurnNCSiCjXKBKNTh.jpg"),
        backdrop: tmdbBackdrop("/1UhCMBjSNLByCRbHnG7liqkPguV.jpg"),
        playlistId: PLAYLIST, videoId: "9bZkp7q19f0",
        genre: "Action / Adventure", rating: "7.9/10", year: 2023,
        description: "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands."
      },
      {
        title: "Spider-Man: No Way Home",
        image: tmdbPoster("/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"),
        backdrop: tmdbBackdrop("/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg"),
        playlistId: PLAYLIST, videoId: "JGwWNGJdvx8",
        genre: "Action / Sci-Fi", rating: "8.2/10", year: 2021,
        description: "Peter Parker seeks the help of Doctor Strange to make the world forget he is Spider-Man, unleashing multiverse chaos."
      },
      {
        title: "Avengers: Endgame",
        image: tmdbPoster("/or06FN3Dka5tukK1e9sl16pB3iy.jpg"),
        backdrop: tmdbBackdrop("/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"),
        playlistId: PLAYLIST, videoId: "fJ9rUzIMcZQ",
        genre: "Action / Sci-Fi", rating: "8.4/10", year: 2019,
        description: "The Avengers assemble once more in order to reverse Thanos's actions and restore balance to the universe."
      },
    ]
  },
  {
    id: "scifi",
    title: "🌙 Sci-Fi Collection",
    type: "regular",
    cards: [
      {
        title: "Blade Runner 2049",
        image: tmdbPoster("/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"),
        backdrop: tmdbBackdrop("/ilRyazdMjoTuHEBXBLRZkAHe5wz.jpg"),
        playlistId: PLAYLIST, videoId: "Lp7e9GNgfM0",
        genre: "Sci-Fi / Neo-Noir", rating: "8.0/10", year: 2017,
        description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard."
      },
      {
        title: "Tenet",
        image: tmdbPoster("/k68nPLbIST6NP96JmTxmZijROop.jpg"),
        backdrop: tmdbBackdrop("/wzJRB4MKi3yK138bpKyyfwUyldX.jpg"),
        playlistId: PLAYLIST, videoId: "7wtfhZwyrcc",
        genre: "Sci-Fi / Action", rating: "7.3/10", year: 2020,
        description: "A secret agent embarks on a dangerous, time-bending mission to prevent the start of World War III."
      },
      {
        title: "Arrival",
        image: tmdbPoster("/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg"),
        backdrop: tmdbBackdrop("/h5vOFzirq4p13ZJX0HT3Y3MdSJX.jpg"),
        playlistId: PLAYLIST, videoId: "vx2u5uUu3DE",
        genre: "Sci-Fi / Drama", rating: "7.9/10", year: 2016,
        description: "A linguist is recruited by the military to communicate with alien lifeforms after 12 mysterious spacecraft land around the world."
      },
      {
        title: "The Martian",
        image: tmdbPoster("/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg"),
        backdrop: tmdbBackdrop("/sy3e2e4JwdAtd2oZGA2uIFZCGJm.jpg"),
        playlistId: PLAYLIST, videoId: "2vjPBrBU-TM",
        genre: "Sci-Fi / Adventure", rating: "8.0/10", year: 2015,
        description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal that he is alive."
      },
      {
        title: "Gravity",
        image: tmdbPoster("/6nMHQGMFRSOPxJjjjqLMXS3VZ5t.jpg"),
        backdrop: tmdbBackdrop("/3gaOjBEgMCEX4uLT0MgqRqmKRkb.jpg"),
        playlistId: PLAYLIST, videoId: "2Vv-BfVoq4g",
        genre: "Sci-Fi / Thriller", rating: "7.7/10", year: 2013,
        description: "Two astronauts work together to survive after an accident leaves them stranded in space."
      },
      {
        title: "Ex Machina",
        image: tmdbPoster("/btMLD4gVTsWRDf6mkRJVxRmx9Up.jpg"),
        backdrop: tmdbBackdrop("/kSCHJHBHLYEZNfgbNYaEm7GXPJA.jpg"),
        playlistId: PLAYLIST, videoId: "RgKAFK5djSk",
        genre: "Sci-Fi / Thriller", rating: "7.7/10", year: 2014,
        description: "A programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid AI."
      },
    ]
  },
  {
    id: "originals",
    title: "⭐ WoxStream Originals",
    type: "special",
    cards: [
      {
        title: "Killers of the Flower Moon",
        image: tmdbPoster("/dB6jeFEFYFSPbQnRVwsNHLijLPr.jpg"),
        backdrop: tmdbBackdrop("/1X7vow16X7CnCoexXh4H5uBej8P.jpg"),
        playlistId: PLAYLIST, videoId: "dQw4w9WgXcQ",
        genre: "Crime / Drama", rating: "7.6/10", year: 2023,
        description: "Members of the Osage tribe are murdered under mysterious circumstances in the 1920s, sparking a major FBI investigation."
      },
      {
        title: "Poor Things",
        image: tmdbPoster("/kCGlIMHnOm8JPXNbiljKjBANjHF.jpg"),
        backdrop: tmdbBackdrop("/uOEEeErTMLBWiz81y3xVJHnQSTr.jpg"),
        playlistId: PLAYLIST, videoId: "M7lc1UVf-VE",
        genre: "Fantasy / Drama", rating: "8.0/10", year: 2023,
        description: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter."
      },
      {
        title: "Godzilla Minus One",
        image: tmdbPoster("/hT5mEd0u2dJsO17FZiCjiVXeRMV.jpg"),
        backdrop: tmdbBackdrop("/mSXSXPfJDEb9OLt6EMEbSdtZgnN.jpg"),
        playlistId: PLAYLIST, videoId: "jNQXAC9IVRw",
        genre: "Action / Monster", rating: "7.9/10", year: 2023,
        description: "Postwar Japan is at its lowest point when a new crisis emerges in the form of a giant monster, baptized in the fires of the atomic age."
      },
      {
        title: "Civil War",
        image: tmdbPoster("/sh7Rg8Er3tFcN9BpKIPU9Mpo0qm.jpg"),
        backdrop: tmdbBackdrop("/ugmmgHFCQPaPaHClliMEFBRiUqn.jpg"),
        playlistId: PLAYLIST, videoId: "9bZkp7q19f0",
        genre: "Action / Thriller", rating: "7.3/10", year: 2024,
        description: "A journey across a dystopian future America, following a team of military-embedded journalists as they race against time to reach DC before White House falls."
      },
      {
        title: "Alien: Romulus",
        image: tmdbPoster("/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg"),
        backdrop: tmdbBackdrop("/9SSEUrSqhljBMzRe4aBTh17LNPQ.jpg"),
        playlistId: PLAYLIST, videoId: "kJQP7kiw5Fk",
        genre: "Sci-Fi / Horror", rating: "7.3/10", year: 2024,
        description: "A group of young colonists traveling to a distant star system find themselves in a confrontation with the most terrifying life form in the universe."
      },
      {
        title: "Past Lives",
        image: tmdbPoster("/k3waqVXsnFFMg7pFU7DdoOQqBsb.jpg"),
        backdrop: tmdbBackdrop("/1yu9s6M7gP2YzxinMg1v89VrIVN.jpg"),
        playlistId: PLAYLIST, videoId: "OPf0YbXqDm0",
        genre: "Romance / Drama", rating: "8.0/10", year: 2023,
        description: "Nora and Hae Sung, two deeply connected childhood friends, are separated after Nora's family emigrates from South Korea."
      },
    ]
  },
  {
    id: "picks",
    title: "🏆 Top Picks For You",
    type: "special",
    cards: [
      {
        title: "No Time to Die",
        image: tmdbPoster("/iUgygt3fscRoKWCV1d0C7FbM9WT.jpg"),
        backdrop: tmdbBackdrop("/bQURlGBc8EXrQjxyEBnhDkSEj6x.jpg"),
        playlistId: PLAYLIST, videoId: "YQHsXMglC9A",
        genre: "Action / Adventure", rating: "7.3/10", year: 2021,
        description: "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help."
      },
      {
        title: "Dune: Part One",
        image: tmdbPoster("/d5NXSklpcvwN3Y1Dr00JxAMvMIL.jpg"),
        backdrop: tmdbBackdrop("/iopYFB1b6Bh7FWZh3onQhph1sih.jpg"),
        playlistId: PLAYLIST, videoId: "ZZ5LpwO-An4",
        genre: "Sci-Fi / Adventure", rating: "8.0/10", year: 2021,
        description: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy."
      },
      {
        title: "Twisters",
        image: tmdbPoster("/qTkJ6kbTeSjqfHCFHVy9HlwAJfA.jpg"),
        backdrop: tmdbBackdrop("/nR9oJTJfXnvGwuTHGLUUgkGJG55.jpg"),
        playlistId: PLAYLIST, videoId: "PT2_F-1esPk",
        genre: "Action / Disaster", rating: "7.2/10", year: 2024,
        description: "Kate Cooper and Tyler Owens join forces to track storms across the Oklahoma plains, including one supercell that threatens to tear everything in its path."
      },
      {
        title: "Guardians of the Galaxy Vol. 3",
        image: tmdbPoster("/r2J02Z6HecaEd7HLNGEjVgILvhz.jpg"),
        backdrop: tmdbBackdrop("/5YZbUmjbMa3ClvSW1Wj3D6XGkVA.jpg"),
        playlistId: PLAYLIST, videoId: "9bZkp7q19f0",
        genre: "Action / Sci-Fi", rating: "7.9/10", year: 2023,
        description: "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and protect one of their own."
      },
      {
        title: "Doctor Strange",
        image: tmdbPoster("/uGBVAWjjkSnWXbkNss2HMrqRLqV.jpg"),
        backdrop: tmdbBackdrop("/2Xz9j3fqMLoVBEOJWyAaaxPHrJz.jpg"),
        playlistId: PLAYLIST, videoId: "JGwWNGJdvx8",
        genre: "Action / Fantasy", rating: "7.5/10", year: 2016,
        description: "A former neurosurgeon embarks on a journey of healing only to be drawn into the world of the mystic arts."
      },
      {
        title: "Black Panther: Wakanda Forever",
        image: tmdbPoster("/sv1xJUazXoQuIDfAkAnJ8nr3ADP.jpg"),
        backdrop: tmdbBackdrop("/6AnLyI0QjkXqp0fLpjI9lNtO3vz.jpg"),
        playlistId: PLAYLIST, videoId: "fJ9rUzIMcZQ",
        genre: "Action / Sci-Fi", rating: "7.3/10", year: 2022,
        description: "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa."
      },
    ]
  }
];

export const featuredHero: FilmCardData = {
  title: "Inception",
  image: tmdbPoster("/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"),
  backdrop: tmdbBackdrop("/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"),
  playlistId: PLAYLIST,
  videoId: "Lp7e9GNgfM0",
  genre: "Sci-Fi / Thriller",
  rating: "8.8/10",
  year: 2010,
  description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO — a single thought that could unravel reality itself."
};
