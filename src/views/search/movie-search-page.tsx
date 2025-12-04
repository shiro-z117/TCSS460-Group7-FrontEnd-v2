'use client';

import { useState, useEffect, useCallback } from 'react';
import { movieApi, MovieFilters } from 'services/movieApi';
import SearchBar from 'components/search/SearchBar';
import MovieFilterPanel from 'components/search/MovieFilterPanel';
import MovieResults from 'components/search/MovieResults';

export default function MovieSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    limit: 25
  });
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Fetch movies whenever searchQuery, page, or limit change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const searchFilters: MovieFilters = {
          ...filters,
          title: searchQuery || undefined
        };

        const response = await movieApi.getAllFiltered(searchFilters);
        const results = response.data.data || [];
        setMovies(results);

        // Detect if there are more pages:
        // If we got fewer results than the limit, we're on the last page
        setHasMorePages(results.length === filters.limit);
      } catch (error) {
        console.error('Search error:', error);
        setMovies([]);
        setHasMorePages(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, filters.page, filters.limit]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchFilters: MovieFilters = {
        ...filters,
        title: searchQuery || undefined
      };

      const response = await movieApi.getAllFiltered(searchFilters);
      const results = response.data.data || [];
      setMovies(results);

      // Detect if there are more pages:
      // If we got fewer results than the limit, we're on the last page
      setHasMorePages(results.length === filters.limit);
    } catch (error) {
      console.error('Search error:', error);
      setMovies([]);
      setHasMorePages(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<MovieFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <>
      {/* Search Bar */}
      <div className="sticky top-[72px] z-10 bg-gray-900/80 backdrop-blur-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            loading={loading}
            title="Movie Search"
            placeholder="Search for Movies by title..."
          />
        </div>
      </div>

      <div className="flex">
        {/* Filter Panel - Left Side */}
        <aside className="w-80 border-r border-purple-500/30 bg-gray-900/50 min-h-screen sticky top-[160px] self-start">
          <MovieFilterPanel filters={filters} onFilterChange={handleFilterChange} onApply={handleSearch} />
        </aside>

        {/* Results Area - Center */}
        <main className="flex-1 p-8">
          <MovieResults
            movies={movies}
            loading={loading}
            currentPage={filters.page || 1}
            itemsPerPage={filters.limit || 25}
            hasMorePages={hasMorePages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </>
  );
}
