'use client';

// next
import NextLink from 'next/link';
import { getProviders, getCsrfToken } from 'next-auth/react';

// material-ui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

export default function SignIn() {
  const csrfToken = getCsrfToken();
  const providers = getProviders();

  return (
    <AuthWrapper>
      <div className="text-center mb-12" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-7xl font-bold text-purple-600" style={{ fontSize: '4.5rem', fontWeight: 'bold', color: '#9333ea', margin: 0 }}>
          PIBBLE
        </h1>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AuthLogin providers={providers} csrfToken={csrfToken} />
        </Grid>
        <Grid item xs={12}>
          <div className="text-center" style={{ textAlign: 'center' }}>
            <p className="text-white mb-4" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              Don't have an account?
            </p>
            <Link
              component={NextLink}
              href="/register"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded no-underline"
              sx={{
                display: 'inline-block',
                backgroundColor: '#9333ea',
                color: '#ffffff !important',
                fontWeight: 600,
                padding: '0.75rem 2rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: '#7e22ce',
                }
              }}
            >
              Sign Up
            </Link>
          </div>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
