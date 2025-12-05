'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import HorizontalMediaList from '@/components/profile/HorizontalMediaList';
import useUserProfile from '@/hooks/useUserProfile';

export default function ProfileView() {
  const { data: session } = useSession();
  const profile = useUserProfile();

  // Refetch data when page becomes visible (e.g., when navigating back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && profile.userId) {
        console.log('🔄 Page became visible, refetching profile data...');
        profile.refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile.userId, profile.refetch]);

  // Debug logging
  console.log('=== Profile Debug ===');
  console.log('Session ID:', session?.id);
  console.log('Profile User ID:', profile.userId);
  console.log('User Email:', session?.user?.email);
  console.log('Full Session:', session);

  // Loading state
  if (profile.isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-xl text-gray-400">Loading your profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (profile.error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-red-900/20 border border-red-500/30 rounded-xl p-8">
              <p className="text-xl text-red-400 mb-2">Error loading profile</p>
              <p className="text-gray-400">{profile.error}</p>
              <button
                onClick={() => profile.refetch()}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Get avatar URL - prefer API avatar, fallback to session image
  const avatarUrl = profile.avatar?.avatar_url || session?.user?.image || '/assets/images/users/avatar-1.png';
  const displayName = profile.userName || session?.user?.name || 'User';
  const displayEmail = profile.userEmail || session?.user?.email || '';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Profile
          </h1>
          <p className="text-xl text-gray-400 mb-6">What&apos;s next on your Watchlist?</p>

          {/* User Info & Stats Card */}
          <div className="mb-8 px-12 pt-6 pb-8 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white flex items-center gap-12">
            <div>
              <h3 className="text-4xl font-bold mb-1 text-white">{displayName}</h3>
              <p className="text-2xl text-gray-400 mb-4">{displayEmail}</p>

              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-48 h-48 rounded-full border-2 border-purple-500 object-cover"
              />
            </div>

            <div className="flex gap-12 ml-8">
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">FAVORITES</p>
                <p className="text-2xl font-bold mt-1">
                  {profile.isLoadingFavorites ? '...' : profile.favoritesCount}
                </p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">WATCHLIST</p>
                <p className="text-2xl font-bold mt-1">
                  {profile.isLoadingWatchlist ? '...' : profile.watchlistCount}
                </p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">HISTORY</p>
                <p className="text-2xl font-bold mt-1">
                  {profile.isLoadingWatched ? '...' : profile.watchedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Favorites List */}
          <div className="mb-8 px-12 pt-6 pb-8 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
            {profile.isLoadingFavorites ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading favorites...</p>
              </div>
            ) : profile.favoritesError ? (
              <div className="text-center py-8 text-red-400">
                <p>Error loading favorites: {profile.favoritesError}</p>
              </div>
            ) : profile.favorites.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-xl">No favorites yet</p>
                <p className="text-sm mt-2">Start adding your favorite movies and shows!</p>
              </div>
            ) : (
              <HorizontalMediaList title={'Favorites'} items={profile.favorites} />
            )}
          </div>

          {/* Watched List */}
          <div className="mb-8 px-12 pt-6 pb-8 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
            {profile.isLoadingWatched ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading watch history...</p>
              </div>
            ) : profile.watchedError ? (
              <div className="text-center py-8 text-red-400">
                <p>Error loading watch history: {profile.watchedError}</p>
              </div>
            ) : profile.watched.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-xl">No watch history yet</p>
                <p className="text-sm mt-2">Mark movies and shows as watched to see them here!</p>
              </div>
            ) : (
              <HorizontalMediaList title={'Watched'} items={profile.watched} />
            )}
          </div>

          {/* Watchlist */}
          <div className="mb-8 px-12 pt-6 pb-8 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
            {profile.isLoadingWatchlist ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading watchlist...</p>
              </div>
            ) : profile.watchlistError ? (
              <div className="text-center py-8 text-red-400">
                <p>Error loading watchlist: {profile.watchlistError}</p>
              </div>
            ) : profile.watchlist.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-xl">Your watchlist is empty</p>
                <p className="text-sm mt-2">Add movies and shows to watch later!</p>
              </div>
            ) : (
              <HorizontalMediaList title={'Watchlist'} items={profile.watchlist} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
