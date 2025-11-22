'use client';

import { useEffect, useState } from 'react';
import {
  getPopularMovies,
  getPopularTVShows,
  getTrending,
  getTopRatedMovies,
  getTopRatedTVShows,
  getNowPlayingMovies
} from '@/lib/api/tmdb';

interface Metric {
  id: number;
  title: string;
  value: string;
  icon: string;
  color: string;
  gradient: string;
}

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [
          popularMovies,
          popularShows,
          trending,
          topRatedMovies,
          topRatedShows,
          nowPlaying
        ] = await Promise.all([
          getPopularMovies(1),
          getPopularTVShows(1),
          getTrending('all', 'week'),
          getTopRatedMovies(1),
          getTopRatedTVShows(1),
          getNowPlayingMovies(1)
        ]);

        const metricsData: Metric[] = [
          {
            id: 1,
            title: 'Popular Movies',
            value: popularMovies.total_results.toLocaleString(),
            icon: '🎬',
            color: 'purple',
            gradient: 'from-purple-600/20 to-purple-900/20'
          },
          {
            id: 2,
            title: 'Popular TV Shows',
            value: popularShows.total_results.toLocaleString(),
            icon: '📺',
            color: 'blue',
            gradient: 'from-blue-600/20 to-blue-900/20'
          },
          {
            id: 3,
            title: 'Trending This Week',
            value: trending.length.toString(),
            icon: '🔥',
            color: 'orange',
            gradient: 'from-orange-600/20 to-orange-900/20'
          },
          {
            id: 4,
            title: 'Top Rated Movies',
            value: topRatedMovies.total_results.toLocaleString(),
            icon: '⭐',
            color: 'yellow',
            gradient: 'from-yellow-600/20 to-yellow-900/20'
          },
          {
            id: 5,
            title: 'Top Rated Shows',
            value: topRatedShows.total_results.toLocaleString(),
            icon: '🏆',
            color: 'green',
            gradient: 'from-green-600/20 to-green-900/20'
          },
          {
            id: 6,
            title: 'Now Playing',
            value: nowPlaying.total_results.toLocaleString(),
            icon: '🎥',
            color: 'pink',
            gradient: 'from-pink-600/20 to-pink-900/20'
          }
        ];

        setMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (metrics.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3) % metrics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [metrics.length]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700/30 rounded-xl p-6 animate-pulse"
          >
            <div className="h-12 bg-gray-700/50 rounded mb-2"></div>
            <div className="h-6 bg-gray-700/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Display 3 cards at a time
  const visibleMetrics = [
    metrics[currentIndex % metrics.length],
    metrics[(currentIndex + 1) % metrics.length],
    metrics[(currentIndex + 2) % metrics.length]
  ];

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Live Metrics from TMDB</h2>
        <div className="flex gap-2">
          {metrics.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentIndex / 3) === Math.floor(index / 3)
                  ? 'bg-purple-500 w-6'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to metrics ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
        {visibleMetrics.map((metric, index) => (
          <div
            key={`${metric.id}-${currentIndex}-${index}`}
            className={`bg-gradient-to-br ${metric.gradient} backdrop-blur border border-${metric.color}-500/30 rounded-xl p-4 transform transition-all duration-500 hover:scale-105 hover:border-${metric.color}-500/60`}
            style={{
              animation: 'fadeIn 0.5s ease-in-out'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">{metric.icon}</span>
              <div className={`px-2 py-1 bg-${metric.color}-500/20 rounded-full`}>
                <span className={`text-${metric.color}-400 text-xs font-semibold`}>Live</span>
              </div>
            </div>
            <h3 className={`text-3xl font-bold text-${metric.color}-400 mb-1`}>
              {metric.value}
            </h3>
            <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}