'use client';

import { APP_DEFAULT_PATH } from 'config';
import NextLink from 'next/link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Error404() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
        color: 'white',
        textAlign: 'center',
        px: 2
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '8rem', sm: '12rem' },
          fontWeight: 'bold',
          color: '#9333ea'
        }}
      >
        404
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 600 }}>
        <Typography variant="h4">Page Not Found</Typography>
        <Typography sx={{ color: 'gray.400' }}>
          The page you are looking for was moved, removed, renamed, or might have never existed!
        </Typography>
        <Button
          component={NextLink}
          href={APP_DEFAULT_PATH}
          variant="contained"
          sx={{
            backgroundColor: '#9333ea',
            '&:hover': { backgroundColor: '#7e22ce' },
            color: 'white',
            textTransform: 'none',
            fontSize: '1rem',
            py: 1.5,
            borderRadius: '0.375rem'
          }}
        >
          Return
        </Button>
      </Stack>
    </Box>
  );
}
