'use client';

import { useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { mockMovies } from '@/lib/mockData';
import Image from 'next/image';
import Link from 'next/link';

export default function MovieDetailPage() {
  const params = useParams();
  const movie = mockMovies.find(m => m.id === parseInt(params.id as string));

  if (!movie) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="text-center text-white">
            <h1 className="text-4xl mb-4">Movie Not Found</h1>
            <Link href="/dashboard/movies" className="text-purple-400 hover:text-purple-300">
              ← Back to Movies
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <Link href="/dashboard/movies" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to Movies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-9xl">🎬</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-yellow-400 text-xl">⭐ {movie.rating.toFixed(1)}</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-400">{new Date(movie.release_date).getFullYear()}</span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre} className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Additional Information</h2>
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="text-purple-400 font-semibold">Release Date:</span> {new Date(movie.release_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Rating:</span> {movie.rating}/10
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
