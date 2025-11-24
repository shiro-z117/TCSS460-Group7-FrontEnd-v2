import { useState } from 'react';
import { MovieFilters } from 'services/movieApi';

interface MovieFilterPanelProps {
  filters: MovieFilters;
  onFilterChange: (filters: Partial<MovieFilters>) => void;
  onApply: () => void;
}

export default function MovieFilterPanel({ filters, onFilterChange, onApply }: MovieFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState({
    year: true,
    runtime: false,
    budget: false,
    revenue: false,
    genre: false,
    rating: false,
    people: false
  });

  const toggleSection = (section: keyof typeof isExpanded) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClearFilters = () => {
    onFilterChange({
      yearStart: undefined,
      yearEnd: undefined,
      year: undefined,
      runtimeMin: undefined,
      runtimeMax: undefined,
      budgetMin: undefined,
      budgetMax: undefined,
      revenueMin: undefined,
      revenueMax: undefined,
      genre: undefined,
      mpaRating: undefined,
      studios: undefined,
      producers: undefined,
      directors: undefined,
      collection: undefined,
      actorNames: undefined
    });
  };

  const genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'];

  const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR'];

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

      {/* Year Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('year')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Year</span>
          <span className="text-purple-400">{isExpanded.year ? '−' : '+'}</span>
        </button>
        {isExpanded.year && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Start Year"
              value={filters.yearStart || ''}
              onChange={(e) => onFilterChange({ yearStart: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="number"
              placeholder="End Year"
              value={filters.yearEnd || ''}
              onChange={(e) => onFilterChange({ yearEnd: e.target.value ? parseInt(e.target.value) : undefined })}
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
          <span>Genre</span>
          <span className="text-purple-400">{isExpanded.genre ? '−' : '+'}</span>
        </button>
        {isExpanded.genre && (
          <select
            value={filters.genre || ''}
            onChange={(e) => onFilterChange({ genre: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* MPA Rating Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Rating</span>
          <span className="text-purple-400">{isExpanded.rating ? '−' : '+'}</span>
        </button>
        {isExpanded.rating && (
          <select
            value={filters.mpaRating || ''}
            onChange={(e) => onFilterChange({ mpaRating: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
          >
            <option value="">All Ratings</option>
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Runtime Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('runtime')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Runtime (minutes)</span>
          <span className="text-purple-400">{isExpanded.runtime ? '−' : '+'}</span>
        </button>
        {isExpanded.runtime && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Min Runtime"
              value={filters.runtimeMin || ''}
              onChange={(e) => onFilterChange({ runtimeMin: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="number"
              placeholder="Max Runtime"
              value={filters.runtimeMax || ''}
              onChange={(e) => onFilterChange({ runtimeMax: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        )}
      </div>

      {/* Budget Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('budget')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Budget ($)</span>
          <span className="text-purple-400">{isExpanded.budget ? '−' : '+'}</span>
        </button>
        {isExpanded.budget && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Min Budget"
              value={filters.budgetMin || ''}
              onChange={(e) => onFilterChange({ budgetMin: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="number"
              placeholder="Max Budget"
              value={filters.budgetMax || ''}
              onChange={(e) => onFilterChange({ budgetMax: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        )}
      </div>

      {/* Revenue Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('revenue')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>Revenue ($)</span>
          <span className="text-purple-400">{isExpanded.revenue ? '−' : '+'}</span>
        </button>
        {isExpanded.revenue && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Min Revenue"
              value={filters.revenueMin || ''}
              onChange={(e) => onFilterChange({ revenueMin: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="number"
              placeholder="Max Revenue"
              value={filters.revenueMax || ''}
              onChange={(e) => onFilterChange({ revenueMax: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        )}
      </div>

      {/* People Filter */}
      <div className="border-b border-purple-500/30 pb-4">
        <button
          onClick={() => toggleSection('people')}
          className="w-full flex items-center justify-between text-white font-semibold mb-3"
        >
          <span>People</span>
          <span className="text-purple-400">{isExpanded.people ? '−' : '+'}</span>
        </button>
        {isExpanded.people && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Director"
              value={filters.directors || ''}
              onChange={(e) => onFilterChange({ directors: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="text"
              placeholder="Producer"
              value={filters.producers || ''}
              onChange={(e) => onFilterChange({ producers: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="text"
              placeholder="Actor Names (comma-separated)"
              value={filters.actorNames || ''}
              onChange={(e) => onFilterChange({ actorNames: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="text"
              placeholder="Studio"
              value={filters.studios || ''}
              onChange={(e) => onFilterChange({ studios: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
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
