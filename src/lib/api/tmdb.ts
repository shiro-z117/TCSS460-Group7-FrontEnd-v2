import { TMDBMovie, TMDBTVShow, TMDBResponse, TrendingItem, Genre } from '@/types/media';

// TMDB API Configuration
// Fallback API key if environment variable is not set
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'c7568553c770a72bae4439feb7bfd5f0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Helper function to build image URLs
export function getImageUrl(path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Helper function to make TMDB API requests
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json();
}

// Get trending movies or TV shows
export async function getTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'week'
): Promise<TrendingItem[]> {
  const data = await tmdbFetch<TMDBResponse<TrendingItem>>(
    `/trending/${mediaType}/${timeWindow}`
  );
  return data.results;
}

// Get popular movies
export async function getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/popular', { page: String(page) });
}

// Get top rated movies
export async function getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/top_rated', { page: String(page) });
}

// Get now playing movies
export async function getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/now_playing', { page: String(page) });
}

// Get upcoming movies
export async function getUpcomingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/upcoming', { page: String(page) });
}

// Search movies
export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return tmdbFetch<TMDBResponse<TMDBMovie>>('/search/movie', {
    query,
    page: String(page)
  });
}

// Get movie details
export async function getMovieDetails(movieId: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/movie/${movieId}`);
}

// Get popular TV shows
export async function getPopularTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular', { page: String(page) });
}

// Get top rated TV shows
export async function getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/top_rated', { page: String(page) });
}

// Get airing today TV shows
export async function getAiringTodayTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/airing_today', { page: String(page) });
}

// Get on the air TV shows
export async function getOnTheAirTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/on_the_air', { page: String(page) });
}

// Search TV shows
export async function searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
  return tmdbFetch<TMDBResponse<TMDBTVShow>>('/search/tv', {
    query,
    page: String(page)
  });
}

// Get TV show details
export async function getTVShowDetails(tvId: number): Promise<TMDBTVShow> {
  return tmdbFetch<TMDBTVShow>(`/tv/${tvId}`);
}

// Get movie genres
export async function getMovieGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}

// Get TV genres
export async function getTVGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/tv/list');
  return data.genres;
}

// Discover movies with filters
export async function discoverMovies(params: {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  year?: number;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
} = {}): Promise<TMDBResponse<TMDBMovie>> {
  const stringParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      stringParams[key] = String(value);
    }
  });
  return tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', stringParams);
}

// Discover TV shows with filters
export async function discoverTVShows(params: {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  first_air_date_year?: number;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
} = {}): Promise<TMDBResponse<TMDBTVShow>> {
  const stringParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      stringParams[key] = String(value);
    }
  });
  return tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', stringParams);
}