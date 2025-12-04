'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Sidebar from '@/components/dashboard/Sidebar';
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
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
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        openSnackbar({
          open: true,
          message: 'Failed to load user data',
          variant: 'alert',
          alert: {
            color: 'error',
            variant: 'filled'
          },
          close: true
        } as any);
        setIsLoading(false);
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
      const errorMessage = error?.details || error?.error || error?.message || 'Failed to send verification email';
      openSnackbar({
        open: true,
        message: errorMessage,
        variant: 'alert',
        alert: {
          color: errorMessage.includes('already verified') ? 'info' : 'error',
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

      // Fetch latest user data to check current verification status
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
      const latestUserData = result.data?.user || result.data;

      // Update state with latest data
      setUserData(latestUserData);

      // Check if email is verified
      if (!latestUserData.emailVerified) {
        openSnackbar({
          open: true,
          message: 'Please verify your email first before changing password',
          variant: 'alert',
          alert: {
            color: 'warning',
            variant: 'filled'
          },
          close: true
        } as any);
        setIsChangingPassword(false);
        return;
      }

      // Navigate to change password page
      router.push('/dashboard/change-password');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to check verification status';
      openSnackbar({
        open: true,
        message: errorMessage,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        },
        close: true
      } as any);
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
        setShowDeleteConfirm(false);
        return;
      }

      await authApi.deleteAccount();

      openSnackbar({
        open: true,
        message: 'Account deleted successfully. Redirecting to login...',
        variant: 'alert',
        alert: {
          color: 'success',
          variant: 'filled'
        },
        close: true
      } as any);

      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Sign out and redirect to login
      setTimeout(async () => {
        await signOut({ redirect: false });
        router.push('/login');
      }, 1500);

    } catch (error: any) {
      const errorMessage = error?.details || error?.error || error?.message || 'Failed to delete account';
      openSnackbar({
        open: true,
        message: errorMessage,
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'filled'
        },
        close: true
      } as any);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Profile</h1>
          <p className="text-xl text-gray-400 mb-6">What&apos;s next on your Watchlist?</p>
          <div className="mb-8 px-12 pt-6 pb-8 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white flex items-center gap-12">
            <div>
              <h3 className="text-4xl font-bold mb-1 text-white">
                {isLoading ? 'Loading...' : userData ? `${userData.name} ${userData.lastname}` : 'User'}
              </h3>
              <p className="text-2xl text-gray-400 mb-4">
                {isLoading ? 'Loading...' : userData ? userData.username : 'username'}
              </p>
              <img
                src={
                  isLoading
                    ? 'https://ui-avatars.com/api/?name=Loading&size=192&background=9333ea&color=fff'
                    : userData
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}+${encodeURIComponent(userData.lastname)}&size=192&background=9333ea&color=fff&bold=true`
                    : 'https://ui-avatars.com/api/?name=User&size=192&background=9333ea&color=fff'
                }
                alt="User Avatar"
                className="w-48 h-48 rounded-full border-2 border-purple-500"
              />
            </div>
            <div className="flex gap-12 ml-8">
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">FAVORITES</p>
                <p className="text-2xl font-bold mt-1">61</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">WATCHLIST</p>
                <p className="text-2xl font-bold mt-1">67</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-300">HISTORY</p>
                <p className="text-2xl font-bold mt-1">4444</p>
              </div>
            </div>
          </div>
          <div className="mb-8 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Verification</h3>
                  <p className="text-sm text-gray-400">Verify your email address to enable all features</p>
                </div>
                <button onClick={handleVerifyEmail} disabled={isVerifying} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">
                  {isVerifying ? 'Sending...' : 'Verify Email'}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                <div>
                  <h3 className="text-lg font-semibold text-white">Change Password</h3>
                  <p className="text-sm text-gray-400">Update your account password</p>
                </div>
                <button onClick={handleChangePassword} disabled={isChangingPassword} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">
                  {isChangingPassword ? 'Checking...' : 'Change Password'}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                  <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                </div>
                <button onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting} className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
          <div className="h-64 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white"></div>
        </div>
      </main>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Delete Account?</h2>
            <p className="text-gray-300 mb-6">This action cannot be undone. All your data, favorites, watchlist, and history will be permanently deleted.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={isDeleting} className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors">{isDeleting ? 'Deleting...' : 'Delete Forever'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}