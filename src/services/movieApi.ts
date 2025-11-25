import { movieService } from 'utils/axios';

// Types for Movie API

/**
 * MovieFilters - Interface for advanced filtering with support for:
 * - Pagination (page, limit)
 * - Year range (yearStart, yearEnd, year)
 * - Runtime range (runtimeMin, runtimeMax)
 * - Budget range (budgetMin, budgetMax)
 * - Revenue range (revenueMin, revenueMax)
 * - Text filters (title, genre, mpaRating, studios, producers, directors, collection, actorNames, etc.)
 *
 * All filters can be combined to narrow down search results.
 */
export interface MovieFilters {
  page?: number;
  limit?: number;
  yearStart?: number;
  yearEnd?: number;
  year?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  budgetMin?: number;
  budgetMax?: number;
  revenueMin?: number;
  revenueMax?: number;
  title?: string;
  genre?: string;
  mpaRating?: string;
  studios?: string;
  producers?: string;
  directors?: string;
  collection?: string;
  posterUrl?: string;
  backdropUrl?: string;
  studioLogos?: string;
  studioCountries?: string;
  actorNames?: string;
}

/**
 * MovieInput - Interface for creating new movies
 * Only the title field is required; all other fields are optional.
 */
export interface MovieInput {
  title: string;
  original_title?: string;
  release_date?: string;
  runtime?: number;
  genres?: string;
  overview?: string;
  budget?: number;
  revenue?: number;
  mpa_rating?: string;
  collection?: string;
  poster_url?: string;
  backdrop_url?: string;
  producers?: string;
  directors?: string;
  studios?: string;
  studio_logos?: string;
  studio_countries?: string;
  actor1_name?: string;
  actor1_character?: string;
  actor1_profile?: string;
  actor2_name?: string;
  actor2_character?: string;
  actor2_profile?: string;
  actor3_name?: string;
  actor3_character?: string;
  actor3_profile?: string;
  actor4_name?: string;
  actor4_character?: string;
  actor4_profile?: string;
  actor5_name?: string;
  actor5_character?: string;
  actor5_profile?: string;
  actor6_name?: string;
  actor6_character?: string;
  actor6_profile?: string;
  actor7_name?: string;
  actor7_character?: string;
  actor7_profile?: string;
  actor8_name?: string;
  actor8_character?: string;
  actor8_profile?: string;
  actor9_name?: string;
  actor9_character?: string;
  actor9_profile?: string;
  actor10_name?: string;
  actor10_character?: string;
  actor10_profile?: string;
}

/**
 * MovieUpdate - Interface for updating existing movies
 * All fields are optional. Only provided fields will be updated.
 */
export interface MovieUpdate {
  title?: string;
  original_title?: string;
  release_date?: string;
  runtime?: number;
  genres?: string;
  overview?: string;
  budget?: number;
  revenue?: number;
  mpa_rating?: string;
  collection?: string;
  poster_url?: string;
  backdrop_url?: string;
  producers?: string;
  directors?: string;
  studios?: string;
  studio_logos?: string;
  studio_countries?: string;
}

/**
 * StatsDimension - Type for statistics grouping options
 * Specifies the dimension by which to group movie statistics
 */
export type StatsDimension = 'genre' | 'year' | 'mpa_rating' | 'producers' | 'directors' | 'studios' | 'collection' | 'runtime' | 'budget' | 'revenue';

export const movieApi = {
  // GET /movies - List movies with basic pagination
  getAll: (page: number = 1, pageSize: number = 25) => movieService.get(`/movies?page=${page}&pageSize=${pageSize}`),

  // GET /movies/page - Advanced paginated list with comprehensive filters
  // Returns a paginated list of movies with advanced filtering capabilities.
  // Supports filtering by year range, runtime, budget, revenue, genre, rating,
  // title search, studios, producers, directors, collections, and actor names.
  // All filters can be combined to narrow down search results.
  getAllFiltered: (filters: MovieFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return movieService.get(`/movies/page?${params.toString()}`);
  },

  // GET /movies/random - Get random movies
  getRandom: () => movieService.get('/movies/random'),

  // GET /movies/stats - Movie statistics
  getStats: (by: StatsDimension) => movieService.get(`/movies/stats?by=${by}`),

  // GET /movies/getID/{id} - Get movie details by ID
  getById: (id: number) => movieService.get(`/movies/getID/${id}`),

  // POST /movies/post - Create a new movie
  create: (data: MovieInput) => movieService.post('/movies/post', data),

  // PATCH /movies/patchID/{id} - Partially update a movie
  update: (id: number, data: MovieUpdate) => movieService.patch(`/movies/patchID/${id}`, data),

  // DELETE /movies/deleteID/{id} - Delete a movie
  delete: (id: number) => movieService.delete(`/movies/deleteID/${id}`)
};
