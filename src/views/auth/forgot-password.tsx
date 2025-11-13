// next
import NextLink from 'next/link';

// material-ui
import Link from '@mui/material/Link';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthForgotPassword from 'sections/auth/auth-forms/AuthForgotPassword';

// ================================|| FORGOT PASSWORD ||================================ //

export default function ForgotPassword() {
  return (
    <AuthWrapper>
      <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
        <div
          className="w-24 h-24 rounded-full border-2 border-gray-400 flex items-center justify-center"
          style={{
            width: '6rem',
            height: '6rem',
            borderRadius: '50%',
            border: '2px solid #9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: '#9ca3af' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-semibold" style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Trouble logging in?
        </h1>
        <p className="text-gray-400 text-center text-sm" style={{ color: '#9ca3af', textAlign: 'center', fontSize: '0.875rem', marginBottom: 0 }}>
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <AuthForgotPassword />
      </div>

      <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="flex-1 border-t border-gray-600" style={{ flex: 1, borderTop: '1px solid #4b5563' }}></div>
        <span className="text-gray-400 text-sm" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>OR</span>
        <div className="flex-1 border-t border-gray-600" style={{ flex: 1, borderTop: '1px solid #4b5563' }}></div>
      </div>

      <div className="text-center" style={{ textAlign: 'center' }}>
        <Link
          component={NextLink}
          href="/register"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          sx={{
            color: '#c084fc',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
            '&:hover': {
              color: '#d8b4fe',
            }
          }}
        >
          Create new account
        </Link>
      </div>

      <div className="text-center" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link
          component={NextLink}
          href="/login"
          className="text-gray-400 hover:text-gray-300 text-sm"
          sx={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            textDecoration: 'none',
            '&:hover': {
              color: '#d1d5db',
            }
          }}
        >
          Back to Login
        </Link>
      </div>
    </AuthWrapper>
  );
}
