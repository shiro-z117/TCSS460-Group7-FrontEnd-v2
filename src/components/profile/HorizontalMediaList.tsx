'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EnrichedMediaItem } from '@/hooks/useUserProfile';

interface HorizontalMediaListProps {
  title: string;
  items: EnrichedMediaItem[];
  viewAllLink?: string;
  totalCount?: number;
  isLoading?: boolean;
  accentColor?: 'purple' | 'blue' | 'pink' | 'green' | 'orange';
}

const colorClasses = {
  purple: {
    button: 'bg-purple-600 hover:bg-purple-700',
    badge: 'bg-purple-900 text-purple-200',
    year: 'text-purple-400'
  },
  blue: {
    button: 'bg-blue-600 hover:bg-blue-700',
    badge: 'bg-blue-900 text-blue-200',
    year: 'text-blue-400'
  },
  pink: {
    button: 'bg-pink-600 hover:bg-pink-700',
    badge: 'bg-pink-900 text-pink-200',
    year: 'text-pink-400'
  },
  green: {
    button: 'bg-green-600 hover:bg-green-700',
    badge: 'bg-green-900 text-green-200',
    year: 'text-green-400'
  },
  orange: {
    button: 'bg-orange-600 hover:bg-orange-700',
    badge: 'bg-orange-900 text-orange-200',
    year: 'text-orange-400'
  }
};

export default function HorizontalMediaList({
  title,
  items,
  viewAllLink,
  totalCount,
  isLoading = false,
  accentColor = 'purple'
}: HorizontalMediaListProps) {
  const colors = colorClasses[accentColor];

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className={`px-6 py-3 ${colors.button} text-white font-semibold rounded-lg transition-all flex items-center gap-2`}
          >
            View All{totalCount !== undefined && ` (${totalCount.toLocaleString()})`}
            <span className="text-xl">→</span>
          </Link>
        )}
      </div>

      {/* Horizontal List */}
      {isLoading ? (
        <div className="overflow-hidden">
          <div className="flex gap-6 pb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-48 bg-gray-800/50 rounded-xl h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="flex gap-6 pb-4">
            {items.filter(item => item.id !== undefined && item.id !== null).map((item, index) => {
              const itemTitle = item.title || item.name || 'Untitled';
              const date = item.release_date || item.first_air_date;
              const year = date ? new Date(date).getFullYear() : 'N/A';
              // Use media_type from the item to determine the correct route
              const href =
                item.media_type === 'movie'
                  ? `/dashboard/movies/${item.id}`
                  : `/dashboard/shows/${item.id}`;

              return (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  href={href}
                  className="group/card cursor-pointer block flex-shrink-0 w-48"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="relative aspect-[2/3] bg-gray-700">
                      {item.poster_url ? (
                        <Image
                          src={item.poster_url}
                          alt={itemTitle}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 192px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <span className="text-6xl">🎬</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-semibold truncate mb-2 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-purple-400 group-hover/card:to-pink-400 transition-all">
                        {itemTitle}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`${colors.year} text-sm`}>{year}</span>
                        {item.rating > 0 && (
                          <span className="text-yellow-400 text-sm">
                            ⭐ {item.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.genres.slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className={`text-xs ${colors.badge} px-2 py-1 rounded-full`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}