import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { userDbApi, MediaItemInput } from '@/services/userDbApi';

export interface UseMediaListsReturn {
  // Check functions
  isInWatchlist: (mediaId: string) => boolean;
  isInFavorites: (mediaId: string) => boolean;
  isInWatched: (mediaId: string) => boolean;

  // Add functions
  addToWatchlist: (mediaType: 'movie' | 'tvshow', mediaId: string) => Promise<void>;
  addToFavorites: (mediaType: 'movie' | 'tvshow', mediaId: string) => Promise<void>;
  addToWatched: (mediaType: 'movie' | 'tvshow', mediaId: string) => Promise<void>;

  // Remove functions
  removeFromWatchlist: (mediaId: string) => Promise<void>;
  removeFromFavorites: (mediaId: string) => Promise<void>;
  removeFromWatched: (mediaId: string) => Promise<void>;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

interface UseMediaListsProps {
  watchlistIds: string[];
  favoritesIds: string[];
  watchedIds: string[];
  onListsChanged?: () => void;
}

export function useMediaLists({
  watchlistIds,
  favoritesIds,
  watchedIds,
  onListsChanged
}: UseMediaListsProps): UseMediaListsReturn {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.id;

  // Check functions
  const isInWatchlist = useCallback(
    (mediaId: string) => watchlistIds.includes(mediaId),
    [watchlistIds]
  );

  const isInFavorites = useCallback(
    (mediaId: string) => favoritesIds.includes(mediaId),
    [favoritesIds]
  );

  const isInWatched = useCallback(
    (mediaId: string) => watchedIds.includes(mediaId),
    [watchedIds]
  );

  // Add to watchlist
  const addToWatchlist = useCallback(
    async (mediaType: 'movie' | 'tvshow', mediaId: string) => {
      if (!userId) {
        setError('You must be logged in to add items to your watchlist');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data: MediaItemInput = { media_type: mediaType, media_id: mediaId };
        await userDbApi.addToWatchlist(userId, data);
        onListsChanged?.();
      } catch (err: any) {
        console.error('Error adding to watchlist:', err);
        setError(err?.response?.data?.message || 'Failed to add to watchlist');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onListsChanged]
  );

  // Add to favorites
  const addToFavorites = useCallback(
    async (mediaType: 'movie' | 'tvshow', mediaId: string) => {
      if (!userId) {
        setError('You must be logged in to add items to your favorites');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data: MediaItemInput = { media_type: mediaType, media_id: mediaId };
        await userDbApi.addToFavorites(userId, data);
        onListsChanged?.();
      } catch (err: any) {
        console.error('Error adding to favorites:', err);
        setError(err?.response?.data?.message || 'Failed to add to favorites');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onListsChanged]
  );

  // Add to watched
  const addToWatched = useCallback(
    async (mediaType: 'movie' | 'tvshow', mediaId: string) => {
      if (!userId) {
        setError('You must be logged in to mark items as watched');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data: MediaItemInput = { media_type: mediaType, media_id: mediaId };
        await userDbApi.addToWatched(userId, data);
        onListsChanged?.();
      } catch (err: any) {
        console.error('Error adding to watched:', err);
        setError(err?.response?.data?.message || 'Failed to mark as watched');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onListsChanged]
  );

  // Remove from watchlist
  const removeFromWatchlist = useCallback(
    async (mediaId: string) => {
      if (!userId) {
        setError('You must be logged in to remove items from your watchlist');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await userDbApi.deleteWatchlistItem(userId, mediaId);
        onListsChanged?.();
      } catch (err: any) {
        console.error('Error removing from watchlist:', err);
        setError(err?.response?.data?.message || 'Failed to remove from watchlist');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onListsChanged]
  );

  // Remove from favorites
  const removeFromFavorites = useCallback(
    async (mediaId: string) => {
      if (!userId) {
        setError('You must be logged in to remove items from your favorites');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await userDbApi.deleteFavoriteItem(userId, mediaId);
        onListsChanged?.();
      } catch (err: any) {
        console.error('Error removing from favorites:', err);
        setError(err?.response?.data?.message || 'Failed to remove from favorites');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onListsChanged]
  );

  // Remove from watched
  const removeFromWatched = useCallback(
    async (mediaId: string) => {
      if (!userId) {
        setError('You must be logged in to remove items from watched history');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await userDbApi.deleteWatchedItem(userId, mediaId);
        onListsChanged?.();
      } catch (err: any) {
        console.error('Error removing from watched:', err);
        setError(err?.response?.data?.message || 'Failed to remove from watched history');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, onListsChanged]
  );

  return {
    isInWatchlist,
    isInFavorites,
    isInWatched,
    addToWatchlist,
    addToFavorites,
    addToWatched,
    removeFromWatchlist,
    removeFromFavorites,
    removeFromWatched,
    isLoading,
    error
  };
}