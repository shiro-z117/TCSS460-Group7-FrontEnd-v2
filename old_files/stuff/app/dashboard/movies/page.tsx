'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { mockMovies } from '@/lib/mockData';

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Movies</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full max-w-md px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type="movie" />
          ))}
        </div>
      </main>
    </div>
  );
}
