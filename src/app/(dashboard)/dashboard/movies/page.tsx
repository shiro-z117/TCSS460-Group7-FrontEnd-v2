'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { mockMovies } from '@/lib/mockData';

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredMovies = mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Movies
          </h1>
          <p className="text-gray-400 mb-6">Browse {mockMovies.length} movies</p>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="🔍 Search movies..."
            className="w-full max-w-md px-6 py-4 bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type="movie" />
          ))}
        </div>

        {/* Google-style Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded ${
                  currentPage === pageNum
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
