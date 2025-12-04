'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MoviesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/search?tab=movies');
  }, [router]);

  return null; // nothing renders because we immediately redirect
}

/*
DEPRECATED VERSION

import MoviesView from 'views/dashboard/movies';

export default function MoviesPage() {
  return <MoviesView />;
}

*/
