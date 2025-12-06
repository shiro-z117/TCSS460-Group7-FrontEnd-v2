'use client';

import { useEffect, useState } from 'react';
import { movieApi } from '@/services/movieApi';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_url?: string;
  poster_url?: string;
  vote_average?: number;
  mpa_rating?: string;
  release_date?: string;
}

// Image base URL for poster/backdrop images stored in the database
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function PromotionalCarousel() {
  const [items, setItems] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch random movies on mount
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await movieApi.getRandom();
        const moviesData = response.data?.data || [];
        if (moviesData.length > 0) {
          setItems(moviesData.slice(0, 5)); // Only show 5 items
        }
      } catch (error: any) {
        console.error('Error fetching promotional movies:', error?.message || error);
        // If error, try to get regular movies instead
        try {
          const fallbackResponse = await movieApi.getAllFiltered({ page: 1, limit: 5 });
          const fallbackData = fallbackResponse.data?.data || [];
          setItems(fallbackData);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
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
      <div className="w-full h-[500px] bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl animate-pulse" />
    );
  }

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];
  const title = currentItem.title || 'Unknown';

  // Fix relative image paths by adding the base URL
  const rawBackdrop = currentItem.backdrop_url || currentItem.poster_url;
  const backdropUrl = rawBackdrop
    ? (rawBackdrop.startsWith('http') ? rawBackdrop : `${IMAGE_BASE_URL}${rawBackdrop}`)
    : '/placeholder.jpg';

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-12 group">
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
            🎬 FEATURED MOVIE
          </div>

          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h2>

          <p className="text-gray-200 text-lg mb-6 line-clamp-3 drop-shadow-md">
            {currentItem.overview || 'No description available.'}
          </p>

          <div className="flex items-center gap-4">
            {currentItem.mpa_rating && (
              <span className="bg-gray-700/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded border border-gray-600">
                {currentItem.mpa_rating}
              </span>
            )}
            <span className="text-gray-300">
              {currentItem.release_date || 'Release date unknown'}
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
