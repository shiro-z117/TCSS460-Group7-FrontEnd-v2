'use client';

import { useParams } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import FilterSidebar from '@/components/dashboard/FilterSidebar';
import ItemDetails from '@/components/dashboard/ItemDetails';
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

  // Convert TV show data to match movie format for MovieDetails component
  const showAsMovie = {
    ...show,
    title: show.name,
    release_date: show.first_air_date
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <Link href="/dashboard/shows" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to TV Shows
        </Link>

        <div className="flex gap-8">
          {/* Component 4 - Filter Sidebar */}
          <FilterSidebar type="show" />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Show Poster */}
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

              {/* Component 5 - Show Details */}
              <ItemDetails item={showAsMovie} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}