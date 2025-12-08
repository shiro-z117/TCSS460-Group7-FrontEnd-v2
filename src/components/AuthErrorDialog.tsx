'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthError } from '@/contexts/AuthErrorContext';

export default function AuthErrorDialog() {
  const router = useRouter();
  const { showError, setShowError } = useAuthError();

  if (!showError) return null;

  const handleGoToLogin = () => {
    setShowError(false);
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 border-2 border-red-500/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-3">Authentication Error</h2>

          {/* Message */}
          <p className="text-gray-300 text-lg mb-8">
            Your session has expired or you are not authenticated. Please log in again to continue.
          </p>

          {/* Button */}
          <button
            onClick={handleGoToLogin}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}