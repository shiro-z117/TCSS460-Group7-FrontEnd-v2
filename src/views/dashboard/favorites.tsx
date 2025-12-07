'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { userDbApi } from '@/services/userDbApi';
import { movieApi } from '@/services/movieApi';
import { showsApi } from '@/services/showsApi';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  description: string;
  poster_url?: string;
  release_date?: string;
  first_air_date?: string;
  rating: number;
  genres: string[];
  media_type: 'movie' | 'tvshow';
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function FavoritesView() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch favorites from user DB
        const response = await userDbApi.getFavorites(session.id);
        const favoritesData = Array.isArray(response.data) ? response.data : [];

        // Enrich each favorite with full details
        const enrichedFavorites = await Promise.all(
          favoritesData.map(async (item: any) => {
            try {
              const mediaIdNum = parseInt(item.media_id.replace(/\D/g, ''), 10);

              if (item.media_type === 'movie') {
                const movieResponse = await movieApi.getById(mediaIdNum);
                const movie = movieResponse.data.data || movieResponse.data;
                const movieId = movie.movie_id || movie.id;

                let genresList: string[] = [];
                if (movie.genres) {
                  if (Array.isArray(movie.genres)) {
                    genresList = movie.genres.map((g: any) =>
                      typeof g === 'string' ? g : (g.name || g)
                    );
                  } else if (typeof movie.genres === 'string') {
                    genresList = movie.genres.split(',').map((g: string) => g.trim());
                  }
                }

                let posterUrl = movie.poster_url;
                if (posterUrl && !posterUrl.startsWith('http')) {
                  posterUrl = `${IMAGE_BASE_URL}${posterUrl}`;
                }

                return {
                  id: movieId,
                  title: movie.title,
                  description: movie.overview || '',
                  poster_url: posterUrl,
                  release_date: movie.release_date,
                  rating: movie.tmdb_rating || 0,
                  genres: genresList,
                  media_type: 'movie' as const
                };
              } else if (item.media_type === 'tvshow') {
                const showResponse = await showsApi.getById(mediaIdNum);
                const show = showResponse.data.data || showResponse.data;
                const showId = show.show_id || show.id;

                let genresList: string[] = [];
                if (show.genres) {
                  if (Array.isArray(show.genres)) {
                    genresList = show.genres.map((g: any) =>
                      typeof g === 'string' ? g : (g.name || g)
                    );
                  } else if (typeof show.genres === 'string') {
                    genresList = show.genres.split(',').map((g: string) => g.trim());
                  }
                }

                let posterUrl = show.poster_url;
                if (posterUrl && !posterUrl.startsWith('http')) {
                  posterUrl = `${IMAGE_BASE_URL}${posterUrl}`;
                }

                return {
                  id: showId,
                  name: show.name,
                  description: show.overview || '',
                  poster_url: posterUrl,
                  first_air_date: show.first_air_date,
                  rating: show.tmdb_rating || 0,
                  genres: genresList,
                  media_type: 'tvshow' as const
                };
              }

              return null;
            } catch (err) {
              console.error(`Failed to enrich favorite ${item.media_id}:`, err);
              return null;
            }
          })
        );

        const validFavorites = enrichedFavorites.filter((item): item is MediaItem => item !== null);
        setFavorites(validFavorites);
      } catch (err: any) {
        console.error('Error fetching favorites:', err);
        setError(err?.message || 'Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.id]);

  // Filter favorites based on search query
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;

    const query = searchQuery.toLowerCase();
    return favorites.filter((item) => {
      const itemTitle = (item.title || item.name || '').toLowerCase();
      return itemTitle.includes(query);
    });
  }, [favorites, searchQuery]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/dashboard/profile"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </Link>
            <h1 className="text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-400 mb-6">
            {isLoading ? 'Loading...' : `${filteredFavorites.length} ${filteredFavorites.length === 1 ? 'favorite' : 'favorites'}`}
          </p>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search favorites..."
            className="w-full max-w-md px-6 py-4 bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading your favorites...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-400 text-xl mb-2">Error loading favorites</p>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredFavorites.length > 0 ? (
              filteredFavorites.map((item) => (
                <MovieCard
                  key={`${item.media_type}-${item.id}`}
                  movie={item}
                  type={item.media_type}
                />
              ))
            ) : searchQuery ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-xl mb-2">No results found</p>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-xl mb-2">No favorites yet</p>
                <p className="text-gray-500">Start adding your favorite movies and shows!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}