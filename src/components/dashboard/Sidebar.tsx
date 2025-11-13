'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Movies', href: '/dashboard/movies', icon: '🎬' },
  { name: 'TV Shows', href: '/dashboard/shows', icon: '📺' },
  { name: 'Profile', href: '/dashboard/profile/change-password', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-purple-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-purple-800">
        <h1 className="text-2xl font-bold text-purple-200">PIBBLE</h1>
        <p className="text-sm text-purple-300 mt-1">Movies & TV Shows</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-700 text-white shadow-lg' 
                      : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button at Bottom */}
      <div className="p-4 border-t border-purple-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-purple-800 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
