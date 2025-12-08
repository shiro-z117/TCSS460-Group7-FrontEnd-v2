'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  description: string;
  poster_url?: string;
  release_date?: string;
  first_air_date?: string;
  rating: number;
  mpa_rating?: string;
  genres: string[];
}

interface MovieCardProps {
  movie: Movie;
  type?: 'movie' | 'show';
}

export default function MovieCard({ movie, type = 'movie' }: MovieCardProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const pageSegment = segments[segments.length - 1];

  const title = movie.title || movie.name || 'Untitled';
  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const href = type === 'movie' ? `/dashboard/movies/${movie.id}?from=${pageSegment}` : `/dashboard/shows/${movie.id}?from=${pageSegment}`;

  return (
    <Link href={href} className="group cursor-pointer block">
      <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
        <div className="relative aspect-[2/3] bg-gray-700">
          {movie.poster_url ? (
            <Image
              src={movie.poster_url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span className="text-6xl">🎬</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold truncate mb-2">{title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-sm">{year}</span>
            {type === 'movie' && movie.mpa_rating ? (
              <span className="text-gray-300 text-sm font-semibold border border-gray-500 px-2 py-0.5 rounded">{movie.mpa_rating}</span>
            ) : (
              <span className="text-gray-300 text-sm font-semibold border border-gray-500 px-2 py-0.5 rounded">
                ⭐ {movie.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
