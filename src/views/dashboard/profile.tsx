'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { authApi } from '@/services/authApi';
import { openSnackbar } from '@/api/snackbar';

export default function ProfileView() {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    try {
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
      });
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
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r 
from-purple-400 to-pink-600">
            Profile
          </h1>
          <p className="text-xl text-gray-400 mb-6">What&apos;s next on your Watchlist?</p>

          <div className="mb-8 px-12 pt-6 pb-8 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 
text-white flex items-center gap-12">
            <div>
              <h3 className="text-4xl font-bold mb-1 text-white">Laios</h3>
              <p className="text-2xl text-gray-400 mb-4">monstergourmand4</p>

              <img
                src="https://shapes.inc/api/public/avatar/laiostouden"
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

          {/* Account Actions Section */}
          <div className="mb-8 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              {/* Verify Email Button */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Verification</h3>
                  <p className="text-sm text-gray-400">Verify your email address to enable all features</p>
                </div>
                <button
                  onClick={handleVerifyEmail}
                  disabled={isVerifying}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 
disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isVerifying ? 'Sending...' : 'Verify Email'}
                </button>
              </div>

              {/* Change Password Button - Coming Soon */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 opacity-50">
                <div>
                  <h3 className="text-lg font-semibold text-white">Change Password</h3>
                  <p className="text-sm text-gray-400">Update your account password</p>
                </div>
                <button
                  disabled
                  className="px-6 py-2 bg-gray-600 cursor-not-allowed text-white font-semibold rounded-lg"
                >
                  Coming Soon
                </button>
              </div>

              {/* Delete Account Button - Coming Soon */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 opacity-50">
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                  <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                </div>
                <button
                  disabled
                  className="px-6 py-2 bg-gray-600 cursor-not-allowed text-white font-semibold rounded-lg"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          <div className="h-64 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 
text-white"></div>
        </div>
      </main>
    </div>
  );
}
