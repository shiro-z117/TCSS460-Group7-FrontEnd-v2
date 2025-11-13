'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { mockTVShows } from '@/lib/mockData';

export default function ShowsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShows = mockTVShows.filter(show => 
    show.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">TV Shows</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TV shows..."
            className="w-full max-w-md px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredShows.map((show) => (
            <MovieCard key={show.id} movie={show as any} type="show" />
          ))}
        </div>
      </main>
    </div>
  );
}
