import { useState } from 'react';
import { ShowsFilters } from 'services/showsApi';

interface ShowsFilterPanelProps {
  filters: ShowsFilters;
  onFilterChange: (filters: Partial<ShowsFilters>) => void;
  onApply: () => void;
}

export default function ShowsFilterPanel({ filters, onFilterChange, onApply }: ShowsFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState({
    rating: true,
    date: false,
    genre: false,
    network: false,
    actors: false
  });

  const toggleSection = (section: keyof typeof isExpanded) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClearFilters = () => {
    onFilterChange({
      actors: undefined,
      genres: undefined,
      network: undefined,
      min_rating: undefined,
      startDate: undefined,
      endDate: undefined
    });
  };

  const genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'];

  const networks = ['HBO', 'Netflix', 'Amazon Prime Video', 'Hulu', 'Disney+', 'Apple TV+', 'NBC', 'CBS', 'ABC', 'FOX', 'The CW', 'AMC', 'FX', 'Showtime', 'Starz'];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Results Per Page */}
      <div className="border-b border-purple-500/30 pb-4">
        <label className="block text-white font-semibold mb-3">Results Per Page</label>
        <select
          value={filters.limit || 25}
          onChange={(e) => onFilterChange({ limit: parseInt(e.target.value), page: 1 })}
          className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
      </div>

      {/* Minimum Rating Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Minimum Rating</span>
          <span className="text-purple-400">{isExpanded.rating ? '−' : '+'}</span>
        </button>
        {isExpanded.rating && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Min Rating (0-10)"
              min="0"
              max="10"
              step="0.1"
              value={filters.min_rating || ''}
              onChange={(e) => onFilterChange({ min_rating: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        )}
      </div>

      {/* Genre Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('genre')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Genres</span>
          <span className="text-purple-400">{isExpanded.genre ? '−' : '+'}</span>
        </button>
        {isExpanded.genre && (
          <input
            type="text"
            placeholder="Comma-separated genres"
            value={filters.genres || ''}
            onChange={(e) => onFilterChange({ genres: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
          />
        )}
      </div>

      {/* Network Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('network')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Network</span>
          <span className="text-purple-400">{isExpanded.network ? '−' : '+'}</span>
        </button>
        {isExpanded.network && (
          <input
            type="text"
            placeholder="Network name"
            value={filters.network || ''}
            onChange={(e) => onFilterChange({ network: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
          />
        )}
      </div>

      {/* Air Date Range Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('date')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Air Date Range</span>
          <span className="text-purple-400">{isExpanded.date ? '−' : '+'}</span>
        </button>
        {isExpanded.date && (
          <div className="space-y-3">
            <input
              type="date"
              placeholder="Start Date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ startDate: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="date"
              placeholder="End Date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ endDate: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        )}
      </div>

      {/* Actors Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('actors')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Actors</span>
          <span className="text-purple-400">{isExpanded.actors ? '−' : '+'}</span>
        </button>
        {isExpanded.actors && (
          <input
            type="text"
            placeholder="Comma-separated actor names"
            value={filters.actors || ''}
            onChange={(e) => onFilterChange({ actors: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
          />
        )}
      </div>

      {/* Apply Button */}
      <button
        onClick={onApply}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all mt-6"
      >
        Apply Filters
      </button>
    </div>
  );
}
