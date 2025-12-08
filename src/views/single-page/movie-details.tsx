'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { movieApi } from '@/services/movieApi';
import Image from 'next/image';
import Link from 'next/link';
import useUserProfile from '@/hooks/useUserProfile';
import { useMediaLists } from '@/hooks/useMediaLists';
import { useSearchParams } from 'next/navigation';

interface MovieDetailsViewProps {
  movieId: string;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetailsView({ movieId }: MovieDetailsViewProps) {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from') || 'search';

  const handleGoBack = () => {
    switch (fromPage) {
      case 'profile':
        router.push('/dashboard/profile');
        break;
      case 'favorites':
        router.push('/dashboard/favorites');
        break;
      case 'watchlist':
        router.push('/dashboard/watchlist');
        break;
      case 'history':
        router.push('/dashboard/history');
        break;
      case 'dashboard':
        router.push('/dashboard');
        break;
      default:
        router.push('/dashboard/movies'); // explore page
    }
  };

  // Get user's lists
  const { watchlist, favorites, watched, refetch } = useUserProfile();

  // Extract media IDs from user's lists
  const watchlistIds = watchlist.map(item => item.id.toString());
  const favoritesIds = favorites.map(item => item.id.toString());
  const watchedIds = watched.map(item => item.id.toString());

  // Media list management
  const {
    isInWatchlist,
    isInFavorites,
    isInWatched,
    addToWatchlist,
    addToFavorites,
    addToWatched,
    removeFromWatchlist,
    removeFromFavorites,
    removeFromWatched,
    isLoading: isListLoading
  } = useMediaLists({
    watchlistIds,
    favoritesIds,
    watchedIds,
    onListsChanged: refetch
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🎬 Movie ID:', movieId);
        const response = await movieApi.getById(parseInt(movieId));

        // Handle both possible response structures
        const movieData = response.data.data || response.data;
        setMovie(movieData);
      } catch (err: any) {
        console.error('Error fetching movie:', err);
        setError(err.message || 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${movie.title}"?\n\n(Note: This only removes it from the current view. Refresh the page to see it again.)`
    );

    if (confirmDelete) {
      setIsDeleted(true);
      setTimeout(() => {
        router.push('/dashboard/movies');
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <div className="mb-6">
              <div className="inline-block p-4 bg-green-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Movie Deleted Successfully</h1>
            <p className="text-gray-400 mb-6">The movie has been removed from your view. Refresh the page to see it again.</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{error ? 'Error Loading Movie' : 'Movie Not Found'}</h1>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <button onClick={handleGoBack} className="text-purple-400 hover:text-purple-300 text-lg mb-6 inline-flex items-center gap-2">
              <span>←</span> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const actors = movie.actors || [];
  const genres = Array.isArray(movie.genres) ? movie.genres : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        <button onClick={handleGoBack} className="text-purple-400 hover:text-purple-300 text-lg mb-6 inline-flex items-center gap-2">
          <span>←</span> Go Back
        </button>

        <div className="mt-8 bg-black bg-opacity-50 rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-purple-900 mb-6">
                {movie.poster_url ? (
                  <Image src={`${IMAGE_BASE_URL}${movie.poster_url}`} alt={movie.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-9xl">🎬</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {/* Watchlist Button */}
                {isInWatchlist(movieId) ? (
                  <button
                    onClick={() => removeFromWatchlist(movieId)}
                    disabled={isListLoading}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>✓</span> Remove from Watchlist
                  </button>
                ) : (
                  <button
                    onClick={() => addToWatchlist('movie', movieId)}
                    disabled={isListLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>+</span> Add to Watchlist
                  </button>
                )}

                {/* Favorites Button */}
                {isInFavorites(movieId) ? (
                  <button
                    onClick={() => removeFromFavorites(movieId)}
                    disabled={isListLoading}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>★</span> Remove from Favorites
                  </button>
                ) : (
                  <button
                    onClick={() => addToFavorites('movie', movieId)}
                    disabled={isListLoading}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>⭐</span> Add to Favorites
                  </button>
                )}

                {/* Watched Button */}
                {isInWatched(movieId) ? (
                  <button
                    onClick={() => removeFromWatched(movieId)}
                    disabled={isListLoading}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>✓</span> Remove from Watched
                  </button>
                ) : (
                  <button
                    onClick={() => addToWatched('movie', movieId)}
                    disabled={isListLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>✓</span> Mark as Watched
                  </button>
                )}

                {/* Delete Button - Keep original */}
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={handleDelete}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete Movie
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 text-white">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-purple-300">{movie.title}</h1>
                {movie.mpa_rating && (
                  <div className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg">
                    <span className="text-xl font-bold">{movie.mpa_rating}</span>
                  </div>
                )}
              </div>

              {movie.release_date && (
                <p className="text-gray-400 mb-4">
                  Release Date:{' '}
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}

              {movie.runtime && <p className="text-gray-400 mb-4">Runtime: {movie.runtime} minutes</p>}

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {genres.map((genre: string, index: number) => (
                    <span key={index} className="bg-purple-600 px-4 py-1 rounded-full text-sm font-semibold">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3 text-purple-300">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed">{movie.overview || 'No description available.'}</p>
              </div>

              {movie.directors && movie.directors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-purple-300">Directors</h3>
                  <p className="text-gray-300">{movie.directors.join(', ')}</p>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-300">Cast</h2>
                {actors.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {actors.slice(0, 10).map((actor: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="relative w-full aspect-square bg-purple-700 rounded-lg mb-2 overflow-hidden">
                          {actor.profile ? (
                            <Image
                              src={`${IMAGE_BASE_URL}${actor.profile}`}
                              alt={actor.name}
                              fill
                              sizes="(max-width: 640px) 50vw, 20vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl">👤</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-white">{actor.name}</p>
                        {actor.character && <p className="text-xs text-gray-400">{actor.character}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Cast information not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
