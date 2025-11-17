'use client';

import { useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import FilterSidebar from '@/components/dashboard/FilterSidebar';
import ItemDetails from '@/components/dashboard/ItemDetails';
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

        <div className="flex gap-8">
          {/* Component 4 - Filter Sidebar */}
          <FilterSidebar type='movie' />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Movie Poster */}
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

              {/* Component 5 - Movie Details */}
              <ItemDetails item={movie} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}