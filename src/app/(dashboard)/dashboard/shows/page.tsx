'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { showsApi } from '@/services/showsApi';

interface TVShow {
  id: number;
  name: string;
  description: string;
  poster_url?: string;
  first_air_date: string;
  rating: number;
  genres: string[];
}

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 20;

  // Fetch TV Shows from API
  useEffect(() => {
    const fetchTVShows = async () => {
      setIsLoading(true);
      try {
        const response = await showsApi.getAllFiltered({
          page: currentPage,
          limit: itemsPerPage,
          name: searchQuery || undefined,
        });

        // Transform API response to match MovieCard expected structure
        const showsData = response.data.data || [];
        const transformedShows = showsData.map((show: any) => ({
          id: show.id,
          name: show.name || 'Untitled',
          description: show.overview || '',
          poster_url: show.poster_url,
          first_air_date: show.first_air_date || '',
          rating: show.tmdb_rating || 0,
          genres: show.genres ? (Array.isArray(show.genres) ? show.genres : show.genres.split(',').map((g: string) => g.trim())) : [],
        }));

        setTVShows(transformedShows);
        setTotalPages(Math.ceil((response.data.count || showsData.length) / itemsPerPage));
        setTotalResults(response.data.count || showsData.length);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
        setTVShows([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTVShows();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            TV Shows
          </h1>
          <p className="text-gray-400 mb-6">
            {isLoading ? 'Loading...' : `Browse ${totalResults} TV shows`}
          </p>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="🔍 Search TV shows..."
            className="w-full max-w-md px-6 py-4 bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading TV shows...</p>
          </div>
        )}

        {/* TV Shows Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {tvShows.length > 0 ? (
              tvShows.map((show) => (
                <MovieCard key={show.id} movie={show} type="show" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-xl">No TV shows found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-all"
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
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-all"
            >
              Next →
            </button>
          </div>
        )}

        {!isLoading && (
          <p className="text-center text-gray-500 mt-6">
            Page {currentPage} of {totalPages} • Showing {tvShows.length} of {totalResults} TV shows
          </p>
        )}
      </main>
    </div>
  );
}