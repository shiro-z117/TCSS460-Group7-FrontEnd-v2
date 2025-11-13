'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (user) {
      const userData = JSON.parse(user);
      setUserEmail(userData.email || '');
    }
  }, [router]);

  const handleSendVerification = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Please login first');
      }

      const response = await fetch('https://credentials-api-group2-20f368b8528b.herokuapp.com/auth/verify/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to send verification email');
      }

      setIsEmailSent(true);
      setSuccessMessage(result.message || 'Verification email sent successfully!');
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await handleSendVerification();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {/* Email Icon */}
          <div className="w-24 h-24 rounded-full bg-purple-900 bg-opacity-30 flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {!isEmailSent ? (
            <>
              <h1 className="text-white text-2xl font-semibold mb-4">Verify your email</h1>
              <p className="text-gray-400 text-center text-sm mb-8">
                Click the button below to receive a verification link at <span className="text-white font-semibold">{userEmail}</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-white text-2xl font-semibold mb-4">Please verify your email</h1>
              <p className="text-gray-400 text-center text-sm mb-2">
                You're almost there! We sent an email to
              </p>
              <p className="text-white font-semibold mb-4">{userEmail}</p>
              <p className="text-gray-400 text-center text-sm mb-2">
                Just click on the link in that email to complete your signup. If you don't see it, you may need to <span className="font-semibold">check your spam</span> folder.
              </p>
              <p className="text-gray-400 text-center text-sm mb-8">
                Still can't find the email? No problem.
              </p>
            </>
          )}
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {!isEmailSent ? (
            <button
              onClick={handleSendVerification}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Verification Email'}
            </button>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          )}

          <div className="text-center mt-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-300 text-sm">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
