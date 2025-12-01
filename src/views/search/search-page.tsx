'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import MovieSearchPage from './movie-search-page';
import TVShowSearchPage from './tvshow-search-page';

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'movies' | 'tvshows'>('movies');

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-lg border-b border-purple-500/30">
          <div className="px-8 py-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('movies')}
                className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                  activeTab === 'movies'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                🎬 Movies
              </button>
              <button
                onClick={() => setActiveTab('tvshows')}
                className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                  activeTab === 'tvshows'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                📺 TV Shows
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          <div style={{ display: activeTab === 'movies' ? 'block' : 'none' }}>
            <MovieSearchPage />
          </div>
          <div style={{ display: activeTab === 'tvshows' ? 'block' : 'none' }}>
            <TVShowSearchPage />
          </div>
        </div>
      </main>
    </div>
  );
}
