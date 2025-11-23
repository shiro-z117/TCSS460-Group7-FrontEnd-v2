import { showsService } from 'utils/axios';

// Types for TV Shows API

/**
 * ShowsFilters - Interface for advanced filtering with support for:
 * - Pagination (page, limit)
 * - Name/title search
 * - Actor filtering (comma-separated)
 * - Genre filtering (comma-separated)
 * - Network filtering
 * - Minimum rating
 * - Date range (startDate, endDate)
 *
 * All filters can be combined to narrow down search results.
 */
export interface ShowsFilters {
  page?: number;
  limit?: number;
  name?: string;
  actors?: string;
  genres?: string;
  network?: string;
  min_rating?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * ShowInput - Interface for creating new TV shows
 * All fields are required for show creation.
 */
export interface ShowInput {
  name: string;
  original_name?: string;
  first_air_date?: string;
  last_air_date?: string;
  status?: string;
  overview?: string;
  seasons?: number;
  episodes?: number;
  tmdb_rating?: number;
  creators?: string[];
  country?: string;
  poster_url?: string;
  backdrop_url?: string;
  companies?: number[];
  networks?: number[];
  genres?: number[];
}

/**
 * ShowUpdate - Interface for updating existing TV shows
 * All fields are optional. Only provided fields will be updated.
 */
export interface ShowUpdate {
  name?: string;
  original_name?: string;
  first_air_date?: string;
  last_air_date?: string;
  status?: string;
  overview?: string;
  seasons?: number;
  episodes?: number;
  tmdb_rating?: number;
}

export const showsApi = {
  // GET /shows - List shows with basic pagination
  getAll: (page: number = 1, limit: number = 50) =>
    showsService.get(`/shows?page=${page}&limit=${limit}`),

  // GET /shows/filter - Filter shows with advanced options
  // Returns a filtered list of TV shows.
  // Supports filtering by actors, genres, network, minimum rating, and date range.
  // All filters can be combined to narrow down search results.
  getAllFiltered: (filters: ShowsFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return showsService.get(`/shows/filter?${params.toString()}`);
  },

  // GET /shows/random - Get random shows
  getRandom: (limit: number = 50) => showsService.get(`/shows/random?limit=${limit}`),

  // GET /shows/{id} - Get show details by ID
  getById: (id: number) => showsService.get(`/shows/${id}`),

  // GET /shows/{id}/summary - Get abridged show summary
  getSummary: (id: number) => showsService.get(`/shows/${id}/summary`),

  // POST /admin/shows - Create a new show (admin)
  create: (data: ShowInput) => showsService.post('/admin/shows', data),

  // PUT /admin/shows/{id} - Update a show (admin)
  update: (id: number, data: ShowUpdate) => showsService.put(`/admin/shows/${id}`, data),

  // DELETE /admin/shows/{id} - Delete a show (admin)
  delete: (id: number) => showsService.delete(`/admin/shows/${id}`)
};
