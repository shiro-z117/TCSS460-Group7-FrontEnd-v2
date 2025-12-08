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

export default function WatchlistView() {
  const { data: session } = useSession();
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!session?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch watchlist from user DB
        const response = await userDbApi.getWatchlist(session.id);
        const watchlistData = Array.isArray(response.data) ? response.data : [];

        // Enrich each watchlist item with full details
        const enrichedWatchlist = await Promise.all(
          watchlistData.map(async (item: any) => {
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
                  mpa_rating: movie.mpa_rating || 'NR',
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
              console.error(`Failed to enrich watchlist item ${item.media_id}:`, err);
              return null;
            }
          })
        );

        const validWatchlist = enrichedWatchlist.filter((item): item is MediaItem => item !== null);
        setWatchlist(validWatchlist);
      } catch (err: any) {
        console.error('Error fetching watchlist:', err);
        setError(err?.message || 'Failed to load watchlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [session?.id]);

  // Filter watchlist based on search query
  const filteredWatchlist = useMemo(() => {
    if (!searchQuery.trim()) return watchlist;

    const query = searchQuery.toLowerCase();
    return watchlist.filter((item) => {
      const itemTitle = (item.title || item.name || '').toLowerCase();
      return itemTitle.includes(query);
    });
  }, [watchlist, searchQuery]);

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
              My Watchlist
            </h1>
          </div>
          <p className="text-gray-400 mb-6">
            {isLoading ? 'Loading...' : `${filteredWatchlist.length} ${filteredWatchlist.length === 1 ? 'item' : 'items'} to watch`}
          </p>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search watchlist..."
            className="w-full max-w-md px-6 py-4 bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading your watchlist...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-400 text-xl mb-2">Error loading watchlist</p>
              <p className="text-gray-400">{error}</p>
            </div>
          </div>
        )}

        {/* Watchlist Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredWatchlist.length > 0 ? (
              filteredWatchlist.map((item) => (
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
                <p className="text-gray-400 text-xl mb-2">Your watchlist is empty</p>
                <p className="text-gray-500">Add movies and shows to watch later!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}