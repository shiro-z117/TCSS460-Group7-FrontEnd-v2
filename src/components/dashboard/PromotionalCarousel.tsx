'use client';

import { useEffect, useState } from 'react';
import { getTrending, getImageUrl } from '@/lib/api/tmdb';
import { TrendingItem } from '@/types/media';

export default function PromotionalCarousel() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch trending items on mount
  useEffect(() => {
    async function fetchTrending() {
      const trendingItems = await getTrending('all', 'week');
      setItems(trendingItems.slice(0, 5)); // Only show 5 items
      setLoading(false);
    }
    fetchTrending();
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl animate-pulse" />
    );
  }

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];
  const title = currentItem.title || currentItem.name || 'Unknown';
  const backdropUrl = getImageUrl(currentItem.backdrop_path, 'original');

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden mb-12 group">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-12">
        <div className="max-w-2xl">
          <div className="inline-block px-4 py-1 bg-purple-600 rounded-full text-sm font-semibold mb-4">
            {currentItem.media_type === 'movie' ? '🎬 TRENDING MOVIE' : '📺 TRENDING TV SHOW'}
          </div>

          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h2>

          <p className="text-gray-200 text-lg mb-6 line-clamp-3 drop-shadow-md">
            {currentItem.overview}
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-yellow-400 font-semibold">
              ⭐ {currentItem.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-300">
              {currentItem.release_date || currentItem.first_air_date}
            </span>
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-3 bg-purple-500'
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Left/Right Arrow Buttons (appear on hover) */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + items.length) % items.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <span className="text-white text-2xl">←</span>
      </button>

      <button
        onClick={() => goToSlide((currentIndex + 1) % items.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <span className="text-white text-2xl">→</span>
      </button>
    </div>
  );
}