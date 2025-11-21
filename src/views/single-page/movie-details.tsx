'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockMovies } from '@/lib/mockData';
import Image from 'next/image';
import Link from 'next/link';

interface MovieDetailsViewProps {
  movieId: string;
}

export default function MovieDetailsView({ movieId }: MovieDetailsViewProps) {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false); // Tracks deletion state
  const router = useRouter();

  useEffect(() => {
    // Fetch the movie data --> currently using mock data!!
    const foundMovie = mockMovies.find((m) => m.id === parseInt(movieId));
    setMovie(foundMovie);
    setLoading(false);
  }, [movieId]);

  // Handles the delete --> only removes from the UI, not from API
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${movie.title}"? (This will only remove it from the current view - refresh to see it again)`
    );

    if (confirmDelete) {
      setIsDeleted(true);
      // Redirect to the movies list after "deleting" ...
      setTimeout(() => {
        router.push('/dashboard/movies');
      }, 500);
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

  if (!movie || isDeleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4"> 
              {isDeleted ? 'Movie Deleted Successfully' : 'Movie Not Found'} </h1>
            <p className="text-gray-400 mb-6">
              {isDeleted && 'The movie has been removed from your view. Refresh the page to see it again.'}
            </p>
            <Link href="/dashboard/movies" className="text-purple-400 hover:text-purple-300 text-lg">
              ← Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        {/* Back Button */}
        <Link href="/dashboard/movies" className="text-purple-400 hover:text-purple-300 text-lg mb-6 inline-flex items-center gap-2">
          <span>←</span> Back to Movies
        </Link>

        {/* Main Content */}
        <div className="mt-8 bg-black bg-opacity-50 rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column, the posters and actions */}
            <div className="lg:col-span-1">
              {/* Movie Posters */}
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-purple-900 mb-6">
                {movie.poster_url ? (
                  <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-9xl">🎬</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <span>+</span> Add to Watch Later
                </button>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <span>✓</span> Add to Finished Watching
                </button>

                {/* Delete Button - but deletes on the UI Only 
                (doesnt actually delete from the API) */}
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={handleDelete}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete Movie
                </button>
              </div>
            </div>

            {/* Right Column - Movie Details */}
            <div className="lg:col-span-2 text-white">
              {/* Title & Ratings */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-purple-300">{movie.title}</h1>
                <div className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-xl font-bold">{movie.rating}</span>
                </div>
              </div>

              {/* Release dates */}
              <p className="text-gray-400 mb-4">
                Release Date: {new Date(movie.release_date).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre: string) => (
                  <span key={genre} className="bg-purple-600 px-4 py-1 rounded-full text-sm font-semibold">
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-3 text-purple-300">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed"> {movie.description} </p>
              </div>

              {/* Actors Section - jsut placeholder for now until connecting api */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-300">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Placeholder actor cards, will be filled with real API later */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center">
                      <div className="w-full aspect-square bg-purple-700 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                      <p className="text-sm text-gray-400">Actor {i}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
