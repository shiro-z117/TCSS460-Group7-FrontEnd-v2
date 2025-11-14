'use client';

import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { mockMovies, mockTVShows } from '@/lib/mockData';

export default function DashboardPage() {
  const featuredMovies = mockMovies.slice(0, 4);
  const featuredShows = mockTVShows.slice(0, 4);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Welcome to PIBBLE
          </h1>
          <p className="text-gray-400 text-xl">Discover your favorite movies and TV shows</p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
            <Link 
              href="/dashboard/movies"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              View All Movies ({mockMovies.length})
              <span className="text-xl">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="movie" />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Featured TV Shows</h2>
            <Link 
              href="/dashboard/shows"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              View All TV Shows ({mockTVShows.length})
              <span className="text-xl">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredShows.map((show) => (
              <MovieCard key={show.id} movie={show} type="show" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-4xl font-bold text-purple-400 mb-2">{mockMovies.length}</h3>
            <p className="text-gray-400">Total Movies</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-4xl font-bold text-blue-400 mb-2">{mockTVShows.length}</h3>
            <p className="text-gray-400">Total TV Shows</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 backdrop-blur border border-pink-500/30 rounded-xl p-6">
            <h3 className="text-4xl font-bold text-pink-400 mb-2">{mockMovies.length + mockTVShows.length}</h3>
            <p className="text-gray-400">Total Content</p>
          </div>
        </div>
      </main>
    </div>
  );
}
