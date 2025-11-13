import Sidebar from '@/components/dashboard/Sidebar';
import MovieCard from '@/components/dashboard/MovieCard';
import { mockMovies, mockTVShows } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to PIBBLE</h1>
          <p className="text-gray-400 text-lg">Discover movies and TV shows you'll love</p>
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Movies</h2>
            <Link href="/dashboard/movies" className="text-purple-400 hover:text-purple-300">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="movie" />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Featured TV Shows</h2>
            <Link href="/dashboard/shows" className="text-purple-400 hover:text-purple-300">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTVShows.map((show) => (
              <MovieCard key={show.id} movie={show as any} type="show" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
