interface Movie {
  id: number;
  title: string;
  original_title?: string;
  release_date?: string;
  runtime?: number;
  genres?: string[];
  overview?: string;
  budget?: number;
  revenue?: number;
  studios?: string[];
  producers?: string[];
  directors?: string[];
  mpa_rating?: string;
  collection?: string;
  poster_url?: string;
  backdrop_url?: string;
  actors?: Array<{
    name: string;
    character: string;
    profile?: string;
  }>;
}

interface MovieResultsProps {
  movies: Movie[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  hasMorePages: boolean;
  onPageChange: (page: number) => void;
}

export default function MovieResults({
  movies,
  loading,
  currentPage,
  itemsPerPage,
  hasMorePages,
  onPageChange
}: MovieResultsProps) {

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Searching movies...</p>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-xl text-gray-400">No movies found</p>
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
          Showing <span className="text-white font-semibold">{movies.length}</span> results
          {hasMorePages && <span className="ml-1">(more available)</span>}
        </p>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all hover:scale-105 cursor-pointer"
          >
            {movie.poster_url ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_url}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                <span className="text-6xl">🎬</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-1 truncate">{movie.title}</h3>
              {movie.release_date && (
                <p className="text-gray-400 text-sm mb-2">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              {movie.mpa_rating && (
                <span className="inline-block px-2 py-1 bg-gray-700 text-white text-xs rounded">
                  {movie.mpa_rating}
                </span>
              )}
              {movie.overview && (
                <p className="text-gray-400 text-sm mt-2 line-clamp-3">{movie.overview}</p>
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
