'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import MetricsGrid from '@/components/dashboard/MetricsGrid';
import PromotionalCarousel from '@/components/dashboard/PromotionalCarousel';
import { movieApi } from '@/services/movieApi';
import { showsApi } from '@/services/showsApi';

interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url?: string;
  release_date: string;
  rating: number;
  mpa_rating?: string;
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

// Image base URL for poster images stored in the database
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function DashboardView() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [featuredShows, setFeaturedShows] = useState<TVShow[]>([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalShows, setTotalShows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch movies with error handling
        let transformedMovies: Movie[] = [];
        let totalMoviesCount = 0;

        try {
          // Fetch featured movies
          const moviesResponse = await movieApi.getAllFiltered({ page: 1, limit: 6 });
          const moviesData = moviesResponse.data?.data || [];
          transformedMovies = moviesData.slice(0, 6).map((movie: any) => ({
            id: movie.id,
            title: movie.title || 'Untitled',
            description: movie.overview || '',
            poster_url: movie.poster_url
              ? movie.poster_url.startsWith('http')
                ? movie.poster_url
                : `${IMAGE_BASE_URL}${movie.poster_url}`
              : undefined,
            release_date: movie.release_date || '',
            rating: 0,
            mpa_rating: movie.mpa_rating || movie.rating || 'NR',
            genres: Array.isArray(movie.genres) ? movie.genres : []
          }));

          // Get total count from stats API
          try {
            const statsResponse = await movieApi.getStats('year');
            if (statsResponse.data?.data) {
              totalMoviesCount = statsResponse.data.data.reduce((sum: number, item: any) => sum + (item.count || 0), 0);
            }
          } catch (statsErr) {
            console.warn('Could not fetch movie stats:', statsErr);
            totalMoviesCount = moviesData.length;
          }
        } catch (err) {
          console.error('Error fetching movies:', err);
        }

        // Fetch TV shows with error handling
        let transformedShows: TVShow[] = [];
        let totalShowsCount = 0;

        try {
          const showsResponse = await showsApi.getAll(1, 6);
          // TV Shows API returns { count, page, limit, data }
          const showsData = showsResponse.data?.data || [];
          transformedShows = showsData.slice(0, 6).map((show: any) => ({
            id: show.show_id || show.id,
            name: show.name || 'Untitled',
            description: show.overview || '',
            poster_url: show.poster_url,
            first_air_date: show.first_air_date || '',
            rating: show.tmdb_rating || 0,
            genres: Array.isArray(show.genres) ? show.genres : []
          }));
          totalShowsCount = showsResponse.data?.count || showsData.length;
        } catch (err) {
          console.error('Error fetching shows:', err);
        }

        setFeaturedMovies(transformedMovies);
        setFeaturedShows(transformedShows);
        setTotalMovies(totalMoviesCount);
        setTotalShows(totalShowsCount);
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
              View All Movies ({totalMovies.toLocaleString()})<span className="text-xl">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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
              View All Shows ({totalShows.toLocaleString()})<span className="text-xl">→</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {featuredShows.map((show) => (
                <MovieCard key={show.id} movie={show} type="show" />
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur border border-purple-500/30 rounded-xl p-4">
            <h3 className="text-3xl font-bold text-purple-400 mb-1">{isLoading ? '...' : totalMovies.toLocaleString()}</h3>
            <p className="text-gray-400 text-sm">Total Movies</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-3xl font-bold text-blue-400 mb-1">{isLoading ? '...' : totalShows.toLocaleString()}</h3>
            <p className="text-gray-400 text-sm">Total TV Shows</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 backdrop-blur border border-pink-500/30 rounded-xl p-4">
            <h3 className="text-3xl font-bold text-pink-400 mb-1">{isLoading ? '...' : (totalMovies + totalShows).toLocaleString()}</h3>
            <p className="text-gray-400 text-sm">Total Content</p>
          </div>
        </div>
      </main>
    </div>
  );
}
