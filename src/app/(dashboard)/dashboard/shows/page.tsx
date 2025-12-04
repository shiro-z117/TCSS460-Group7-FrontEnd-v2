'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShowsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/search?tab=tvshows');
  }, [router]);

  return null;
}

/*
DEPRECATED VERSION

import ShowsView from 'views/dashboard/shows';

export default function ShowsPage() {
  return <ShowsView />;
}

*/
