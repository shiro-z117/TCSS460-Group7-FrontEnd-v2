'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ItemDetailsProps {
  item: any;
}

export default function ItemDetails({ item }: ItemDetailsProps) {
  const [inWatchlist, setInWatchlist] = useState(false);

  const handleAddToWatchlist = () => {
    setInWatchlist(!inWatchlist);
    // TODO: Have to connect to backend API later
  };

  return (
    <div className="lg:col-span-2">
      <h1 className="text-5xl font-bold text-white mb-4">{item.title}</h1>
      
      {/* Rating and Year */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-yellow-400 text-xl">⭐ {item.rating.toFixed(1)}</span>
        <span className="text-gray-400">|</span>
        <span className="text-purple-400">{new Date(item.release_date).getFullYear()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleAddToWatchlist}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            inWatchlist
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
        </button>
        
        <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">
          ↗ Share
        </button>
      </div>

      {/* Genres */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {item.genres.map((genre: string) => (
            <span key={genre} className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full">
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Overview</h2>
        <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
      </div>

      {/* Cast & Crew (w just mock data for now) */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-3">Cast & Crew</h2>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="mb-3">
            <span className="text-purple-400 font-semibold">Director:</span>
            <span className="text-gray-300 ml-2">Christopher Nolan</span>
          </div>
          <div>
            <span className="text-purple-400 font-semibold">Cast:</span>
            <span className="text-gray-300 ml-2">Matthew McConaughey, Anne Hathaway, Jessica Chastain</span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Additional Information</h2>
        <div className="space-y-3 text-gray-300">
          <div>
            <span className="text-purple-400 font-semibold">Release Date:</span> {new Date(item.release_date).toLocaleDateString()}
          </div>
          <div>
            <span className="text-purple-400 font-semibold">Rating:</span> {item.rating}/10
          </div>
          <div>
            <span className="text-purple-400 font-semibold">Runtime:</span> 2h 49min
          </div>
        </div>
      </div>
    </div>
  );
}