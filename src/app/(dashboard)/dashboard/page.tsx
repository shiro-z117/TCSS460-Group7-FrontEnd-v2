'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import MetricsGrid from '@/components/dashboard/MetricsGrid';
import PromotionalCarousel from '@/components/dashboard/PromotionalCarousel';
import { getPopularMovies, getPopularTVShows, getImageUrl } from '@/lib/api/tmdb';
import { TMDBMovie, TMDBTVShow } from '@/types/media';

interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url?: string;
  release_date: string;
  rating: number;
  genres: string[];
}

interface TVShow {
  id: number;
  name: string;
  description: string;
  poster_url?: string;
  first_air_date: string;
  rating: number;
  genres: string[];
}

export default function DashboardPage() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [featuredShows, setFeaturedShows] = useState<TVShow[]>([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalShows, setTotalShows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [moviesResponse, showsResponse] = await Promise.all([
          getPopularMovies(1),
          getPopularTVShows(1)
        ]);

        // Transform movies data
        const transformedMovies: Movie[] = moviesResponse.results.slice(0, 4).map((movie: TMDBMovie) => ({
          id: movie.id,
          title: movie.title || 'Untitled',
          description: movie.overview || '',
          poster_url: getImageUrl(movie.poster_path, 'w500'),
          release_date: movie.release_date || '',
          rating: movie.vote_average || 0,
          genres: []
        }));

        // Transform TV shows data
        const transformedShows: TVShow[] = showsResponse.results.slice(0, 4).map((show: TMDBTVShow) => ({
          id: show.id,
          name: show.name || 'Untitled',
          description: show.overview || '',
          poster_url: getImageUrl(show.poster_path, 'w500'),
          first_air_date: show.first_air_date || '',
          rating: show.vote_average || 0,
          genres: []
        }));

        setFeaturedMovies(transformedMovies);
        setFeaturedShows(transformedShows);
        setTotalMovies(moviesResponse.total_results);
        setTotalShows(showsResponse.total_results);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Welcome to PIBBLE
          </h1>
          <p className="text-gray-400 text-xl">Discover your favorite movies and TV shows</p>
        </div>

        {/* Promotional Carousel */}
        <PromotionalCarousel />

        {/* Rotating Metrics Grid - Above Movies */}
        <MetricsGrid />

        {/* Featured Movies */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
            <Link
              href="/dashboard/movies"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              View All Movies ({totalMovies.toLocaleString()})
              <span className="text-xl">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl h-96 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} type="movie" />
              ))}
            </div>
          )}
        </div>

        {/* Featured TV Shows */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Featured TV Shows</h2>
            <Link
              href="/dashboard/shows"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              View All TV Shows ({totalShows.toLocaleString()})
              <span className="text-xl">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl h-96 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredShows.map((show) => (
                <MovieCard key={show.id} movie={show} type="show" />
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur border border-purple-500/30 rounded-xl p-4">
            <h3 className="text-3xl font-bold text-purple-400 mb-1">
              {isLoading ? '...' : totalMovies.toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">Total Movies</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-3xl font-bold text-blue-400 mb-1">
              {isLoading ? '...' : totalShows.toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">Total TV Shows</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 backdrop-blur border border-pink-500/30 rounded-xl p-4">
            <h3 className="text-3xl font-bold text-pink-400 mb-1">
              {isLoading ? '...' : (totalMovies + totalShows).toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">Total Content</p>
          </div>
        </div>
      </main>
    </div>
  );
}