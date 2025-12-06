'use client';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthChangePassword from 'sections/auth/auth-forms/AuthChangePassword';

// ================================|| CHANGE PASSWORD ||================================ //

export default function ChangePassword() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Link href="/dashboard/profile" className="text-purple-400 hover:text-purple-300 text-lg mb-6 inline-flex items-center gap-2">
            <span>←</span> Back to Profile
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3" sx={{ color: '#ffffff' }}>
              Change Password
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthChangePassword />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
