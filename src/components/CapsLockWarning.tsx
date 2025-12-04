'use client';

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

export default function CapsLockWarning() {
  const [capsOn, setCapsOn] = useState(false);

  useEffect(() => {
    const update = (e: Event) => {
      if (e instanceof KeyboardEvent) {
        setCapsOn(e.getModifierState('CapsLock'));
      }
    };

    window.addEventListener('keydown', update);
    window.addEventListener('keyup', update);

    return () => {
      window.removeEventListener('keydown', update);
      window.removeEventListener('keyup', update);
    };
  }, []);

  if (!capsOn) return null;

  return (
    <Typography variant="caption" sx={{ color: 'warning.main' }}>
      Caps lock is on!
    </Typography>
  );
}
