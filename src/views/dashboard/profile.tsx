'use client';

import Sidebar from '@/components/dashboard/Sidebar';

export default function ProfileView() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Profile
          </h1>
          <p className="text-xl text-gray-400 mb-6">How many movies & shows have you watched?</p>

          <div className="mb-8 px-12 pt-6 pb-8 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white flex items-center gap-12">
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

          <div className="h-64 p-6 rounded-xl bg-gray-800/50 backdrop-blur border border-purple-500/30 text-white"></div>
        </div>
      </main>
    </div>
  );
}
