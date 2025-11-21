'use client';

import Sidebar from '@/components/dashboard/Sidebar';

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <h1 className="text-5xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Profile
        </h1>

        {/* Top container: basic user info */}
        <div className="mb-8 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
          {/* Placeholder for user info */}
        </div>

        {/* Bottom container: larger container */}
        <div className="h-64 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white">
          {/* Placeholder for more detailed profile info */}
        </div>
      </main>
    </div>
  );
}
