export interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url?: string;
  release_date: string;
  rating: number;
  genres: string[];
}

export interface TVShow {
  id: number;
  name: string;
  description: string;
  poster_url?: string;
  first_air_date: string;
  rating: number;
  genres: string[];
}

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
    poster_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    release_date: "1999-03-31",
    rating: 8.7,
    genres: ["Action", "Sci-Fi"],
  },
  {
    id: 2,
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology.",
    poster_url: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    release_date: "2010-07-16",
    rating: 8.8,
    genres: ["Action", "Sci-Fi", "Thriller"],
  },
  {
    id: 3,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc on Gotham.",
    poster_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-18",
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"],
  },
  {
    id: 4,
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, and a gangster intertwine.",
    poster_url: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    release_date: "1994-10-14",
    rating: 8.9,
    genres: ["Crime", "Drama"],
  },
];

export const mockTVShows: TVShow[] = [
  {
    id: 1,
    name: "Breaking Bad",
    description: "A high school chemistry teacher turned methamphetamine producer.",
    poster_url: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    first_air_date: "2008-01-20",
    rating: 9.5,
    genres: ["Crime", "Drama", "Thriller"],
  },
  {
    id: 2,
    name: "Stranger Things",
    description: "When a young boy vanishes, a small town uncovers a mystery.",
    poster_url: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    first_air_date: "2016-07-15",
    rating: 8.7,
    genres: ["Drama", "Fantasy", "Horror"],
  },
  {
    id: 3,
    name: "Game of Thrones",
    description: "Nine noble families fight for control over Westeros.",
    poster_url: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    first_air_date: "2011-04-17",
    rating: 9.3,
    genres: ["Action", "Adventure", "Drama"],
  },
  {
    id: 4,
    name: "The Office",
    description: "A mockumentary on a group of typical office workers.",
    poster_url: "https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
    first_air_date: "2005-03-24",
    rating: 9.0,
    genres: ["Comedy"],
  },
];
