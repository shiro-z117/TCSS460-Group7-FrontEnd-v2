'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { mockShows } from '@/lib/mockData';

export default function ShowsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredShows = mockShows.filter(show => 
    show.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredShows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedShows = filteredShows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
            TV Shows
          </h1>
          <p className="text-gray-400 mb-6">Browse {mockShows.length} TV shows</p>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="🔍 Search TV shows..."
            className="w-full max-w-md px-6 py-4 bg-gray-800/50 backdrop-blur border border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Shows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {displayedShows.map((show) => (
            <MovieCard key={show.id} movie={show} type="show" />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
            >
              ← Previous
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
            >
              Next →
            </button>
          </div>
        )}

        <p className="text-center text-gray-500 mt-6">
          Page {currentPage} of {totalPages} • Showing {displayedShows.length} of {filteredShows.length} shows
        </p>
      </main>
    </div>
  );
}
