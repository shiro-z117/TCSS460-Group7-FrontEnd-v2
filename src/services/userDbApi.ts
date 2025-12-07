import { userDbService } from 'utils/axios';

// Types for Pibble Media Tracking API

export interface MediaItem {
  id: string; // UUID of the record
  source_text: 'watchlist' | 'favorites' | 'watched'; // Source category
  user_id: number; // ID of the user who owns this entry
  media_type: 'movie' | 'tvshow'; // Type of media content
  media_id: string; // ID of the movie or TV show (e.g., tt9876543)
  added_at: string; // Timestamp when the item was added
}

export interface MediaItemInput {
  media_type: 'movie' | 'tvshow'; // Type of media content
  media_id: string; // ID of the movie or TV show
}

export interface Avatar {
  avatar_id: number; // Unique identifier for the avatar
  avatar_url: string; // URL or path to the avatar image
  avatar_name?: string; // Descriptive name for the avatar
}

export interface AvatarUpdate {
  avatar_id: number; // ID of the avatar to assign to the user
}

// Pibble API - Media Tracking and Avatar Management
export const userDbApi = {
  // ==================== WATCHLIST OPERATIONS ====================

  // GET /:userid/watchlist - Get all watchlist items for a user
  getWatchlist: (userId: number) => userDbService.get(`/${userId}/watchlist`),

  // POST /:userid/watchlist - Add item to watchlist
  addToWatchlist: (userId: number, data: MediaItemInput) =>
    userDbService.post(`/${userId}/watchlist`, data),

  // DELETE /:userid/watchlist - Delete all watchlist items
  deleteAllWatchlist: (userId: number) =>
    userDbService.delete(`/${userId}/watchlist`),

  // DELETE /:userid/watchlist/:mediaid - Delete single watchlist item
  deleteWatchlistItem: (userId: number, mediaId: string) =>
    userDbService.delete(`/${userId}/watchlist/${mediaId}`),

  // ==================== FAVORITES OPERATIONS ====================

  // GET /:userid/favorites - Get all favorites for a user
  getFavorites: (userId: number) => userDbService.get(`/${userId}/favorites`),

  // POST /:userid/favorites - Add item to favorites
  addToFavorites: (userId: number, data: MediaItemInput) =>
    userDbService.post(`/${userId}/favorites`, data),

  // DELETE /:userid/favorites - Delete all favorites
  deleteAllFavorites: (userId: number) =>
    userDbService.delete(`/${userId}/favorites`),

  // DELETE /:userid/favorites/:mediaid - Delete single favorite item
  deleteFavoriteItem: (userId: number, mediaId: string) =>
    userDbService.delete(`/${userId}/favorites/${mediaId}`),

  // ==================== WATCHED OPERATIONS ====================

  // GET /:userid/watched - Get all watched items for a user
  getWatched: (userId: number) => userDbService.get(`/${userId}/watched`),

  // POST /:userid/watched - Add item to watched history
  addToWatched: (userId: number, data: MediaItemInput) =>
    userDbService.post(`/${userId}/watched`, data),

  // DELETE /:userid/watched - Delete all watched items
  deleteAllWatched: (userId: number) =>
    userDbService.delete(`/${userId}/watched`),

  // DELETE /:userid/watched/:mediaid - Delete single watched item
  deleteWatchedItem: (userId: number, mediaId: string) =>
    userDbService.delete(`/${userId}/watched/${mediaId}`),

  // ==================== AVATAR OPERATIONS ====================

  // GET /avatar/all - Get all available avatars
  getAllAvatars: () => userDbService.get('/avatar/all'),

  // GET /:userid/avatar - Get user's current avatar
  getUserAvatar: (userId: number) => userDbService.get(`/${userId}/avatar`),

  // PATCH /:userid/avatar - Update user's avatar
  updateUserAvatar: (userId: number, data: AvatarUpdate) =>
    userDbService.patch(`/${userId}/avatar`, data)
};