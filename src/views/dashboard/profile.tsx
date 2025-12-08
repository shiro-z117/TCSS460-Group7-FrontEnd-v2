'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Sidebar from '@/components/dashboard/Sidebar';
import HorizontalMediaList from '@/components/profile/HorizontalMediaList';
import AvatarPicker from '@/components/profile/AvatarPicker';
import useUserProfile from '@/hooks/useUserProfile';
import { authApi } from '@/services/authApi';
import { openSnackbar } from '@/api/snackbar';

interface UserData {
  id: number;
  email: string;
  username: string;
  name: string;
  lastname: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: string;
}

export default function ProfileView() {
  const { data: session } = useSession();
  const profile = useUserProfile();
  const router = useRouter();
  const [itemsToShow, setItemsToShow] = useState(6); // Default to 6 items
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Account settings states
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  };

  // Calculate how many items can fit on screen
  useEffect(() => {
    const calculateItemsToShow = () => {
      // Account for sidebar (256px) and main padding (2 * 32px = 64px)
      // Removed card padding from calculation to allow more items
      const availableWidth = window.innerWidth - 256 - 64;
      // Each card is 192px (w-48) + 24px gap between cards
      const itemWidth = 192;
      const gap = 24;

      // Calculate how many complete items can fit
      // Total width needed for n items: n * itemWidth + (n-1) * gap
      // We need: n * itemWidth + (n-1) * gap <= availableWidth
      // Solving for n: n * (itemWidth + gap) - gap <= availableWidth
      // n <= (availableWidth + gap) / (itemWidth + gap)
      let count = Math.floor((availableWidth + gap) / (itemWidth + gap));

      // Show at least 3, allow as many as fit on screen
      count = Math.max(3, count);

      console.log('Window width:', window.innerWidth, 'Available width:', availableWidth, 'Items to show:', count);
      setItemsToShow(count);
    };

    calculateItemsToShow();
    window.addEventListener('resize', calculateItemsToShow);
    return () => window.removeEventListener('resize', calculateItemsToShow);
  }, []);

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

  // Fetch user data for account settings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) {
          return; // Don't redirect, user might be using NextAuth
        }

        const apiUrl = process.env.NEXT_PUBLIC_CREDENTIALS_API_URL || 'https://credentials-api-group2-20f368b8528b.herokuapp.com';
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const result = await response.json();
        console.log('User data fetched:', result);
        // API returns data in result.data.user for login, but result.data for /auth/me
        const user = result.data?.user || result.data;
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    try {
      const token = getToken();
      if (!token) {
        openSnackbar({
          open: true,
          message: 'Please login first',
          variant: 'alert',
          alert: {
            color: 'error',
            variant: 'filled'
          },
          close: true
        } as any);
        setIsVerifying(false);
        return;
      }

      await authApi.sendVerificationEmail();
      openSnackbar({
        open: true,
        message: 'Verification email sent! Please check your inbox.',
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'filled'
        },
        close: true
      } as any);
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      openSnackbar({
        open: true,
        message: error.message || 'Failed to send verification email',
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        },
        close: true
      } as any);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      const token = getToken();
      if (!token) {
        openSnackbar({
          open: true,
          message: 'Please login first',
          variant: 'alert',
          alert: {
            color: 'error',
            variant: 'filled'
          },
          close: true
        } as any);
        setIsChangingPassword(false);
        return;
      }

      await authApi.requestPasswordReset(userData?.email || '');
      openSnackbar({
        open: true,
        message: 'Password reset email sent! Check your inbox.',
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'filled'
        },
        close: true
      } as any);
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      openSnackbar({
        open: true,
        message: error.message || 'Failed to request password reset',
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        },
        close: true
      } as any);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = getToken();
      if (!token) {
        openSnackbar({
          open: true,
          message: 'Please login first',
          variant: 'alert',
          alert: {
            color: 'error',
            variant: 'filled'
          },
          close: true
        } as any);
        setIsDeleting(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_CREDENTIALS_API_URL || 'https://credentials-api-group2-20f368b8528b.herokuapp.com';
      const response = await fetch(`${apiUrl}/auth/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      openSnackbar({
        open: true,
        message: 'Account deleted successfully',
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'filled'
        },
        close: true
      } as any);

      // Clear tokens and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      openSnackbar({
        open: true,
        message: error.message || 'Failed to delete account',
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        },
        close: true
      } as any);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

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
        <div className="w-full">
          {/* Profile Header */}
          <div className="mb-8 p-12 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 flex items-center">
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-48 h-48 rounded-full border-2 border-purple-500"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Change Avatar</span>
              </div>
            </div>
            <div className="ml-8 flex-1">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">{displayName}</h1>
                <p className="text-xl text-gray-300">{displayEmail}</p>
              </div>
              <div className="flex gap-12">
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">FAVORITES</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {profile.isLoadingFavorites ? '...' : profile.favoritesCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">WATCHLIST</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {profile.isLoadingWatchlist ? '...' : profile.watchlistCount}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">WATCH HISTORY</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {profile.isLoadingWatched ? '...' : profile.watchedCount}
                </p>
              </div>
            </div>
            </div>
          </div>

          {/* Favorites List */}
          <div className="mb-8 pt-6 pb-8 px-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
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
              <HorizontalMediaList
                title={'Favorites'}
                items={profile.favorites.slice(0, itemsToShow)}
                viewAllLink="/dashboard/favorites"
                totalCount={profile.favoritesCount}
              />
            )}
          </div>

          {/* Watched List */}
          <div className="mb-8 pt-6 pb-8 px-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
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
              <HorizontalMediaList
                title={'Watch History'}
                items={profile.watched.slice(0, itemsToShow)}
                viewAllLink="/dashboard/history"
                totalCount={profile.watchedCount}
              />
            )}
          </div>

          {/* Watchlist */}
          <div className="mb-8 pt-6 pb-8 px-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
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
              <HorizontalMediaList
                title={'Watchlist'}
                items={profile.watchlist.slice(0, itemsToShow)}
                viewAllLink="/dashboard/watchlist"
                totalCount={profile.watchlistCount}
              />
            )}
          </div>

          {/* Account Settings */}
          <div className="mb-8 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Verification</h3>
                  <p className="text-sm text-gray-400">Verify your email address to enable all features</p>
                </div>
                <button
                  onClick={handleVerifyEmail}
                  disabled={isVerifying}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isVerifying ? 'Sending...' : 'Verify Email'}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                <div>
                  <h3 className="text-lg font-semibold text-white">Change Password</h3>
                  <p className="text-sm text-gray-400">Update your account password</p>
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isChangingPassword ? 'Checking...' : 'Change Password'}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                  <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && profile.userId && (
        <AvatarPicker
          currentAvatarId={profile.avatar?.avatar_id}
          userId={profile.userId}
          onAvatarChange={() => {
            profile.refetch();
          }}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Delete Account?</h2>
            <p className="text-gray-300 mb-6">
              This action cannot be undone. All your data, favorites, watchlist, and history will be permanently deleted.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}