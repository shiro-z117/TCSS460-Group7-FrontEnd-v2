'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    phone: '',
    firstname: '',
    lastname: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://credentials-api-group2-20f368b8528b.herokuapp.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Registration failed');
      }

      if (data.data && data.data.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user || {}));
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-black rounded-lg p-8">
          <div className="flex border-b border-gray-700 mb-8">
            <Link href="/login" className="flex-1 text-center py-3 font-medium text-gray-400 hover:text-white">Login</Link>
            <button type="button" className="flex-1 text-center py-3 font-medium text-white border-b-2 border-purple-600">Sign Up</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">{error}</div>}
            <div>
              <label htmlFor="firstname" className="block text-white font-medium mb-2">First Name</label>
              <input id="firstname" type="text" required minLength={1} maxLength={100} value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} className="w-full px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-white font-medium mb-2">Last Name</label>
              <input id="lastname" type="text" required minLength={1} maxLength={100} value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} className="w-full px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
              <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label htmlFor="username" className="block text-white font-medium mb-2">Username</label>
              <input id="username" type="text" required minLength={3} maxLength={50} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-purple-600" />
              <p className="text-gray-400 text-sm mt-1">3-50 characters</p>
            </div>
            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} required minLength={8} maxLength={128} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-purple-600 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-1">8-128 characters</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-white font-medium mb-2">Phone</label>
              <input id="phone" type="tel" required minLength={10} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-purple-600" placeholder="1234567890" />
              <p className="text-gray-400 text-sm mt-1">At least 10 digits</p>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded">{loading ? 'Creating Account...' : 'Submit'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
