'use client';

import { useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { mockTVShows } from '@/lib/mockData';
import Image from 'next/image';
import Link from 'next/link';

export default function ShowDetailPage() {
  const params = useParams();
  const show = mockTVShows.find(s => s.id === parseInt(params.id as string));

  if (!show) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="text-center text-white">
            <h1 className="text-4xl mb-4">TV Show Not Found</h1>
            <Link href="/dashboard/shows" className="text-purple-400 hover:text-purple-300">
              ← Back to TV Shows
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
        <Link href="/dashboard/shows" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to TV Shows
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              {show.poster_url ? (
                <Image
                  src={show.poster_url}
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
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-5xl font-bold text-white mb-4">{show.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-yellow-400 text-xl">⭐ {show.rating.toFixed(1)}</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-400">{new Date(show.first_air_date).getFullYear()}</span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
                  <span key={genre} className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{show.description}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Additional Information</h2>
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="text-purple-400 font-semibold">First Air Date:</span> {new Date(show.first_air_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Rating:</span> {show.rating}/10
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
