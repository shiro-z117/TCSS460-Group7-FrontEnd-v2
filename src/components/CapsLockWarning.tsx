'use client';

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

export default function CapsLockWarning() {
  const [capsOn, setCapsOn] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setCapsOn(e.getModifierState('CapsLock'));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setCapsOn(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!capsOn) return null;

  return (
    <Typography variant="caption" sx={{ color: 'warning.main' }}>
      Caps lock is on!
    </Typography>
  );
}
