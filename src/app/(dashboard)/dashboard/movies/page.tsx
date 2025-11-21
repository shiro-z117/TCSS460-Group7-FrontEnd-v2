'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { getPopularMovies, searchMovies, getImageUrl } from '@/lib/api/tmdb';
import { TMDBMovie } from '@/types/media';

interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url?: string;
  release_date: string;
  rating: number;
  genres: string[];
}

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        let response;

        if (searchQuery.trim()) {
          response = await searchMovies(searchQuery, currentPage);
        } else {
          response = await getPopularMovies(currentPage);
        }

        // Transform TMDB response to match MovieCard expected structure
        const transformedMovies: Movie[] = response.results.map((movie: TMDBMovie) => ({
          id: movie.id,
          title: movie.title || 'Untitled',
          description: movie.overview || '',
          poster_url: getImageUrl(movie.poster_path, 'w500'),
          release_date: movie.release_date || '',
          rating: movie.vote_average || 0,
          genres: [], // Genre IDs would need to be mapped to names
        }));

        setMovies(transformedMovies);
        setTotalPages(Math.min(response.total_pages, 500)); // TMDB limits to 500 pages
        setTotalResults(response.total_results);
      } catch (error) {
        console.error('Error fetching movies from TMDB:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
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
            Movies
          </h1>
          <p className="text-gray-400 mb-6">
            {isLoading ? 'Loading...' : `Browse ${totalResults.toLocaleString()} movies from TMDB`}
          </p>

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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading movies...</p>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} type="movie" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-xl">No movies found</p>
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
            Page {currentPage} of {totalPages} • Showing {movies.length} movies
          </p>
        )}
      </main>
    </div>
  );
}