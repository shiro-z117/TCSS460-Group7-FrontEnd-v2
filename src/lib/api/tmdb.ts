// src/lib/api/tmdb.ts
// TMDB API utility functions - Shared with Bao for movies & TV shows

import { Movie, TVShow, TrendingItem, TMDBResponse } from '@/types/media';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to build image URLs
export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg'; // Fallback image
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Get trending movies and TV shows (for promotional carousel)
export async function getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<TrendingItem[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch trending content');
    }

    const data: TMDBResponse<TrendingItem> = await response.json();
    return data.results.slice(0, 10); // Return top 10
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
}

// Get popular movies (for Linda's dashboard and Bao's movies page)
export async function getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

// Get popular TV shows (for Linda's TV shows page)
export async function getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch popular TV shows');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

// Search movies (for Bao's search feature)
export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}

// Search TV shows (for Linda's search feature)
export async function searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TVShow>> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to search TV shows');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}