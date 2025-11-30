'use client';

// next
import NextLink from 'next/link';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';

// ================================|| CHECK MAIL ||================================ //

export default function CheckMail() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3" sx={{ color: '#ffffff' }}>
              Check Your Mail
            </Typography>
            <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
              We have sent instructions for recovering your password to your email.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              component={NextLink}
              href="/login"
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#9333ea',
                '&:hover': { backgroundColor: '#7e22ce' },
                textTransform: 'none',
                fontSize: '1rem',
                color: 'white',
                paddingY: '0.75rem',
                borderRadius: '0.375rem'
              }}
            >
              Go To Login
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
