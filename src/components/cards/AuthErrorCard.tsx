'use client';

import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

interface ErrorCardProps {
  message?: string | null;
}

export default function ErrorCard({ message }: ErrorCardProps) {
  if (!message) return null;

  return (
    <Alert
      severity="error"
      sx={{
        mb: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        color: '#ef4444'
      }}
    >
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
}
