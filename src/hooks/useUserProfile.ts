import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { userDbApi, MediaItem, Avatar } from '@/services/userDbApi';
import { movieApi } from '@/services/movieApi';
import { showsApi } from '@/services/showsApi';

// Enriched media item with full details for display
export interface EnrichedMediaItem {
  id: number;
  title?: string;
  name?: string;
  description: string;
  poster_url?: string;
  release_date?: string;
  first_air_date?: string;
  rating: number;
  genres: string[];
  media_type: 'movie' | 'tvshow';
}

interface UseUserProfileReturn {
  // User session data
  userId: number | null;
  userName: string | null;
  userEmail: string | null;

  // Media data (enriched with full details)
  watchlist: EnrichedMediaItem[];
  favorites: EnrichedMediaItem[];
  watched: EnrichedMediaItem[];
  avatar: Avatar | null;

  // Stats
  watchlistCount: number;
  favoritesCount: number;
  watchedCount: number;

  // Loading states
  isLoading: boolean;
  isLoadingWatchlist: boolean;
  isLoadingFavorites: boolean;
  isLoadingWatched: boolean;
  isLoadingAvatar: boolean;

  // Error states
  error: string | null;
  watchlistError: string | null;
  favoritesError: string | null;
  watchedError: string | null;
  avatarError: string | null;

  // Refetch function
  refetch: () => Promise<void>;
}

// Helper function to enrich a single media item with full details
async function enrichMediaItem(item: MediaItem): Promise<EnrichedMediaItem | null> {
  try {
    // Parse media_id to number (assuming it's stored as string like "tt1234567" or just "1234567")
    const mediaIdNum = parseInt(item.media_id.replace(/\D/g, ''), 10);

    if (item.media_type === 'movie') {
      const response = await movieApi.getById(mediaIdNum);
      // Handle both possible response structures
      const movie = response.data.data || response.data;

      // Movies API might return movie_id instead of id
      const movieId = movie.movie_id || movie.id;

      // Check if the response has a valid ID
      if (!movieId) {
        console.error('❌ Movie response missing ID field. Full response:', movie);
        return null;
      }

      // Handle genres - can be array of objects, array of strings, or comma-separated string
      let genresList: string[] = [];
      if (movie.genres) {
        if (Array.isArray(movie.genres)) {
          // If it's an array of objects or strings
          genresList = movie.genres.map((g: any) =>
            typeof g === 'string' ? g : (g.name || g)
          );
        } else if (typeof movie.genres === 'string') {
          // If it's a comma-separated string
          genresList = movie.genres.split(',').map((g: string) => g.trim());
        }
      }

      // Ensure poster_url has the full TMDB base URL
      const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
      let posterUrl = movie.poster_url;
      if (posterUrl && !posterUrl.startsWith('http')) {
        posterUrl = `${IMAGE_BASE_URL}${posterUrl}`;
      }

      return {
        id: movieId,
        title: movie.title,
        description: movie.overview || '',
        poster_url: posterUrl,
        release_date: movie.release_date,
        rating: movie.tmdb_rating || 0,
        genres: genresList,
        media_type: 'movie'
      };
    } else if (item.media_type === 'tvshow') {
      const response = await showsApi.getById(mediaIdNum);
      // Handle both possible response structures
      const show = response.data.data || response.data;

      // Shows API returns show_id instead of id
      const showId = show.show_id || show.id;

      // Check if the response has a valid ID
      if (!showId) {
        console.error('❌ TV show response missing ID field. Full response:', show);
        return null;
      }

      // Handle genres - can be array of objects, array of strings, or comma-separated string
      let genresList: string[] = [];
      if (show.genres) {
        if (Array.isArray(show.genres)) {
          // If it's an array of objects like [{genre_id: 1, name: "Drama"}], extract the names
          genresList = show.genres.map((g: any) =>
            typeof g === 'string' ? g : (g.name || g)
          );
        } else if (typeof show.genres === 'string') {
          // If it's a comma-separated string
          genresList = show.genres.split(',').map((g: string) => g.trim());
        }
      }

      // Ensure poster_url has the full TMDB base URL if it's just a path
      const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
      let posterUrl = show.poster_url;
      if (posterUrl && !posterUrl.startsWith('http')) {
        posterUrl = `${IMAGE_BASE_URL}${posterUrl}`;
      }

      return {
        id: showId,
        name: show.name,
        description: show.overview || '',
        poster_url: posterUrl,
        first_air_date: show.first_air_date,
        rating: show.tmdb_rating || 0,
        genres: genresList,
        media_type: 'tvshow'
      };
    }

    return null;
  } catch (error: any) {
    console.error(`❌ Failed to enrich media item ${item.media_id}:`, error.message);
    return null;
  }
}

// Helper function to enrich an array of media items
async function enrichMediaItems(items: MediaItem[]): Promise<EnrichedMediaItem[]> {
  const enrichedPromises = items.map(item => enrichMediaItem(item));
  const enrichedItems = await Promise.all(enrichedPromises);
  // Filter out any null results (failed enrichments)
  return enrichedItems.filter((item): item is EnrichedMediaItem => item !== null);
}

export default function useUserProfile(): UseUserProfileReturn {
  const { data: session, status } = useSession();

  // User data from session
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Media data (enriched)
  const [watchlist, setWatchlist] = useState<EnrichedMediaItem[]>([]);
  const [favorites, setFavorites] = useState<EnrichedMediaItem[]>([]);
  const [watched, setWatched] = useState<EnrichedMediaItem[]>([]);
  const [avatar, setAvatar] = useState<Avatar | null>(null);

  // Loading states
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isLoadingWatched, setIsLoadingWatched] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

  // Error states
  const [watchlistError, setWatchlistError] = useState<string | null>(null);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [watchedError, setWatchedError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Extract user info from session
  useEffect(() => {
    if (status === 'authenticated' && session) {
      setUserId(session.id || null);
      setUserName(session.user?.name || null);
      setUserEmail(session.user?.email || null);
    }
  }, [session, status]);

  // Fetch watchlist
  const fetchWatchlist = async (id: number) => {
    setIsLoadingWatchlist(true);
    setWatchlistError(null);
    try {
      const response = await userDbApi.getWatchlist(id);
      const data = response.data;
      const rawItems = Array.isArray(data) ? data : [];

      // Enrich the items with full details
      const enrichedItems = await enrichMediaItems(rawItems);
      setWatchlist(enrichedItems);
    } catch (err: any) {
      console.error('❌ Error fetching watchlist:', err?.message);
      setWatchlistError(err?.message || 'Failed to fetch watchlist');
      setWatchlist([]);
    } finally {
      setIsLoadingWatchlist(false);
    }
  };

  // Fetch favorites
  const fetchFavorites = async (id: number) => {
    setIsLoadingFavorites(true);
    setFavoritesError(null);
    try {
      const response = await userDbApi.getFavorites(id);
      const data = response.data;
      const rawItems = Array.isArray(data) ? data : [];

      // Enrich the items with full details
      const enrichedItems = await enrichMediaItems(rawItems);
      setFavorites(enrichedItems);
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setFavoritesError(err?.message || 'Failed to fetch favorites');
      setFavorites([]);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // Fetch watched history
  const fetchWatched = async (id: number) => {
    setIsLoadingWatched(true);
    setWatchedError(null);
    try {
      const response = await userDbApi.getWatched(id);
      const data = response.data;
      const rawItems = Array.isArray(data) ? data : [];

      // Enrich the items with full details
      const enrichedItems = await enrichMediaItems(rawItems);
      setWatched(enrichedItems);
    } catch (err: any) {
      console.error('Error fetching watched:', err);
      setWatchedError(err?.message || 'Failed to fetch watched history');
      setWatched([]);
    } finally {
      setIsLoadingWatched(false);
    }
  };

  // Fetch user avatar
  const fetchAvatar = async (id: number) => {
    setIsLoadingAvatar(true);
    setAvatarError(null);
    try {
      const response = await userDbApi.getUserAvatar(id);
      console.log('🖼️ [AVATAR] Full API Response:', response);
      console.log('🖼️ [AVATAR] Response.data:', response.data);

      // Handle different response structures
      const avatarData = response.data?.data || response.data;
      console.log('🖼️ [AVATAR] Avatar data before processing:', avatarData);

      // If avatar_url is a relative path, prepend the base URL
      if (avatarData?.avatar_url && !avatarData.avatar_url.startsWith('http')) {
        const USER_DB_BASE_URL = process.env.NEXT_PUBLIC_USER_DB_API_URL || 'https://pibble-user-db.onrender.com';
        avatarData.avatar_url = `${USER_DB_BASE_URL}${avatarData.avatar_url}`;
        console.log('🖼️ [AVATAR] Avatar URL after prepending base:', avatarData.avatar_url);
      }

      setAvatar(avatarData || null);
    } catch (err: any) {
      console.error('❌ [AVATAR] Error fetching avatar:', err);
      console.error('❌ [AVATAR] Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      });
      setAvatarError(err?.message || 'Failed to fetch avatar');
      setAvatar(null);
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  // Fetch all data when userId is available
  const fetchAllData = async () => {
    if (!userId) return;

    // Fetch all data in parallel
    await Promise.all([
      fetchWatchlist(userId),
      fetchFavorites(userId),
      fetchWatched(userId),
      fetchAvatar(userId)
    ]);
  };

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchAllData();
    }
  }, [userId]);

  // Calculate overall loading state
  const isLoading =
    status === 'loading' ||
    isLoadingWatchlist ||
    isLoadingFavorites ||
    isLoadingWatched ||
    isLoadingAvatar;

  // Calculate overall error state
  const error = watchlistError || favoritesError || watchedError || avatarError;

  return {
    // User session data
    userId,
    userName,
    userEmail,

    // Media data
    watchlist,
    favorites,
    watched,
    avatar,

    // Stats
    watchlistCount: watchlist.length,
    favoritesCount: favorites.length,
    watchedCount: watched.length,

    // Loading states
    isLoading,
    isLoadingWatchlist,
    isLoadingFavorites,
    isLoadingWatched,
    isLoadingAvatar,

    // Error states
    error,
    watchlistError,
    favoritesError,
    watchedError,
    avatarError,

    // Refetch function
    refetch: fetchAllData
  };
}