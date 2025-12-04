'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { showsApi } from '@/services/showsApi';
import Image from 'next/image';
import Link from 'next/link';

interface ShowDetailsViewProps {
  showId: string;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function ShowDetailsView({ showId }: ShowDetailsViewProps) {
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await showsApi.getById(parseInt(showId));
        setShow(response.data.data || response.data); // Handle both possible structures
      } catch (err: any) {
        console.error('Error fetching show:', err);
        setError(err.message || 'Failed to load show');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${show.name}"?\n\n(Note: This only removes it from the current view. Refresh the page to see it again.)`
    );

    if (confirmDelete) {
      setIsDeleted(true);
      setTimeout(() => {
        router.push('/dashboard/shows');
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
            <h1 className="text-4xl font-bold mb-4">TV Show Deleted Successfully</h1>
            <p className="text-gray-400 mb-6">The show has been removed from your view. Refresh the page to see it again.</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{error ? 'Error Loading Show' : 'TV Show Not Found'}</h1>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <Link href="/dashboard/shows" className="text-purple-400 hover:text-purple-300 text-lg">
              ← Back to TV Shows
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle genres - could be array of objects or strings
  const getGenres = () => {
    if (!show.genres) return [];
    if (Array.isArray(show.genres)) {
      return show.genres.map((g: any) => typeof g === 'string' ? g : (g.name || g));
    }
    if (typeof show.genres === 'string') {
      return show.genres.split(',').map((g: string) => g.trim());
    }
    return [];
  };

  const genres = getGenres();
  const actors = show.actors || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        <Link
          href="/dashboard/shows"
          className="text-purple-400 hover:text-purple-300 text-lg mb-6 inline-flex items-center gap-2"
        >
          <span>←</span> Back to TV Shows
        </Link>

        <div className="mt-8 bg-black bg-opacity-50 rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-purple-900 mb-6">
                {show.poster_url ? (
                  <Image
                    src={show.poster_url.startsWith('http') ? show.poster_url : `${IMAGE_BASE_URL}${show.poster_url}`}
                    alt={show.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-9xl">📺</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <span>+</span> Add to Watch Later
                </button>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <span>✓</span> Add to Finished Watching
                </button>

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
                  Delete TV Show
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 text-white">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-purple-300">{show.name}</h1>
                {show.tmdb_rating && (
                  <div className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-xl font-bold">{show.tmdb_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {show.first_air_date && (
                <p className="text-gray-400 mb-2">
                  First Aired:{' '}
                  {new Date(show.first_air_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}

              {show.status && (
                <p className="text-gray-400 mb-2">
                  Status: <span className={show.status === 'Ended' ? 'text-red-400' : 'text-green-400'}>{show.status}</span>
                </p>
              )}

              {(show.seasons || show.episodes) && (
                <p className="text-gray-400 mb-4">
                  {show.seasons && `${show.seasons} Seasons`}
                  {show.seasons && show.episodes && ' • '}
                  {show.episodes && `${show.episodes} Episodes`}
                </p>
              )}

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
                <p className="text-gray-300 text-lg leading-relaxed">{show.overview || 'No description available.'}</p>
              </div>

              {show.creators && show.creators.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-purple-300">Creators</h3>
                  <p className="text-gray-300">{Array.isArray(show.creators) ? show.creators.join(', ') : show.creators}</p>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-300">Cast</h2>
                {actors.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {actors.slice(0, 10).map((actor: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="relative w-full aspect-square bg-purple-700 rounded-lg mb-2 overflow-hidden">
                          {actor.profile_url ? (
                            <Image src={actor.profile_url} alt={actor.name} fill className="object-cover" />
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
