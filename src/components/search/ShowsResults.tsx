interface Show {
  show_id: number;
  name: string;
  original_name?: string;
  first_air_date?: string;
  status?: string;
  seasons?: number;
  episodes?: number;
  tmdb_rating?: number;
  popularity?: number;
  poster_url?: string;
  overview?: string;
  genres?: Array<{
    genre_id: number;
    name: string;
  }>;
}

interface ShowsResultsProps {
  shows: Show[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  hasMorePages: boolean;
  onPageChange: (page: number) => void;
}

export default function ShowsResults({
  shows,
  loading,
  currentPage,
  itemsPerPage,
  hasMorePages,
  onPageChange
}: ShowsResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Searching TV shows...</p>
        </div>
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">📺</div>
          <p className="text-xl text-gray-400">No TV shows found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="mb-6">
        <p className="text-gray-400">
          Page <span className="text-white font-semibold">{currentPage}</span> -
          Showing <span className="text-white font-semibold">{shows.length}</span> results
          {hasMorePages && <span className="ml-1">(more available)</span>}
        </p>
      </div>

      {/* Shows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {shows.map((show) => (
          <div
            key={show.show_id}
            className="bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all hover:scale-105 cursor-pointer"
          >
            {show.poster_url ? (
              <img
                src={show.poster_url}
                alt={show.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                <span className="text-6xl">📺</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-1 truncate">{show.name}</h3>
              {show.first_air_date && (
                <p className="text-gray-400 text-sm mb-2">
                  {new Date(show.first_air_date).getFullYear()}
                </p>
              )}

              {show.genres && show.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {show.genres.map((genre) => (
                    <span
                      key={genre.genre_id}
                      className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-2">
                {show.status && (
                  <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded">
                    {show.status}
                  </span>
                )}
                {show.tmdb_rating && (
                  <span className="px-2 py-1 bg-yellow-600/30 text-yellow-300 text-xs rounded">
                    ⭐ {show.tmdb_rating.toFixed(1)}
                  </span>
                )}
              </div>

              {show.seasons !== undefined && show.episodes !== undefined && (
                <p className="text-gray-400 text-sm mb-2">
                  {show.seasons} Season{show.seasons !== 1 ? 's' : ''} • {show.episodes} Episode{show.episodes !== 1 ? 's' : ''}
                </p>
              )}

              {show.overview && (
                <p className="text-gray-400 text-sm mt-2 line-clamp-3">{show.overview}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(currentPage > 1 || hasMorePages) && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 hover:border-purple-500 disabled:text-gray-600 disabled:border-gray-700 disabled:cursor-not-allowed transition-all"
          >
            &lt; Previous
          </button>

          {/* Page Numbers */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - 2);
            let endPage = startPage + maxVisiblePages - 1;

            // Adjust if we're near the beginning
            if (currentPage <= 3) {
              startPage = 1;
              endPage = maxVisiblePages;
            }

            // Generate page buttons
            for (let i = startPage; i <= endPage; i++) {
              // Don't show pages beyond current if we don't know there are more
              if (i > currentPage && !hasMorePages && i > currentPage) break;

              pages.push(
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  disabled={i === currentPage}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    i === currentPage
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold cursor-default'
                      : 'bg-gray-800/50 border border-purple-500/30 text-purple-400 hover:text-purple-300 hover:border-purple-500'
                  }`}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasMorePages}
            className="px-6 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 hover:border-purple-500 disabled:text-gray-600 disabled:border-gray-700 disabled:cursor-not-allowed transition-all"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}
