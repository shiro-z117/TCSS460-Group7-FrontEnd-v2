'use client';

import { useState } from 'react';

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
  type: 'movie' | 'show';
}

interface FilterState {
  genres: string[];
  yearRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
  sortBy: string;
}

const MOVIE_GENRES = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Crime', 'Thriller', 'Adventure'];
const TV_GENRES = ['Drama', 'Comedy', 'Sci-Fi', 'Action', 'Crime', 'Thriller', 'Fantasy'];

const SORT_OPTIONS = [
  { value: 'rating-desc', label: 'Rating (High to Low)' },
  { value: 'rating-asc', label: 'Rating (Low to High)' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'year-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
];

export default function FilterSidebar({ onFilterChange, type }: FilterSidebarProps) {
  const genres = type === 'movie' ? MOVIE_GENRES : TV_GENRES;
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState({ min: 1990, max: 2024 });
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 10 });
  const [sortBy, setSortBy] = useState('rating-desc');

  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    setSelectedGenres(newGenres);
    
    if (onFilterChange) {
      onFilterChange({
        genres: newGenres,
        yearRange,
        ratingRange,
        sortBy
      });
    }
  };

  const handleYearChange = (type: 'min' | 'max', value: number) => {
    const newYearRange = { ...yearRange, [type]: value };
    setYearRange(newYearRange);
    
    if (onFilterChange) {
      onFilterChange({
        genres: selectedGenres,
        yearRange: newYearRange,
        ratingRange,
        sortBy
      });
    }
  };

  const handleRatingChange = (type: 'min' | 'max', value: number) => {
    const newRatingRange = { ...ratingRange, [type]: value };
    setRatingRange(newRatingRange);
    
    if (onFilterChange) {
      onFilterChange({
        genres: selectedGenres,
        yearRange,
        ratingRange: newRatingRange,
        sortBy
      });
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    if (onFilterChange) {
      onFilterChange({
        genres: selectedGenres,
        yearRange,
        ratingRange,
        sortBy: value
      });
    }
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setYearRange({ min: 1990, max: 2024 });
    setRatingRange({ min: 0, max: 10 });
    setSortBy('rating-desc');
    
    if (onFilterChange) {
      onFilterChange({
        genres: [],
        yearRange: { min: 1990, max: 2024 },
        ratingRange: { min: 0, max: 10 },
        sortBy: 'rating-desc'
      });
    }
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 space-y-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-purple-400 hover:text-purple-300 transition"
        >
          Clear All
        </button>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
        <div className="space-y-2">
          {genres.map((genre) => (
            <label
              key={genre}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
              />
              <span className="text-gray-300 group-hover:text-white transition">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Year Range */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Release Year</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">From</label>
            <input
              type="number"
              value={yearRange.min}
              onChange={(e) => handleYearChange('min', parseInt(e.target.value))}
              min={1900}
              max={2024}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">To</label>
            <input
              type="number"
              value={yearRange.max}
              onChange={(e) => handleYearChange('max', parseInt(e.target.value))}
              min={1900}
              max={2024}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Rating Range */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Rating</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Minimum: {ratingRange.min.toFixed(1)} ⭐
            </label>
            <input
              type="range"
              value={ratingRange.min}
              onChange={(e) => handleRatingChange('min', parseFloat(e.target.value))}
              min={0}
              max={10}
              step={0.5}
              className="w-full accent-purple-600"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Maximum: {ratingRange.max.toFixed(1)} ⭐
            </label>
            <input
              type="range"
              value={ratingRange.max}
              onChange={(e) => handleRatingChange('max', parseFloat(e.target.value))}
              min={0}
              max={10}
              step={0.5}
              className="w-full accent-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Count */}
      {(selectedGenres.length > 0 || 
        yearRange.min !== 1990 || 
        yearRange.max !== 2024 || 
        ratingRange.min !== 0 || 
        ratingRange.max !== 10) && (
        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            {selectedGenres.length + 
             (yearRange.min !== 1990 || yearRange.max !== 2024 ? 1 : 0) +
             (ratingRange.min !== 0 || ratingRange.max !== 10 ? 1 : 0)} filter(s) active
          </p>
        </div>
      )}
    </aside>
  );
}
