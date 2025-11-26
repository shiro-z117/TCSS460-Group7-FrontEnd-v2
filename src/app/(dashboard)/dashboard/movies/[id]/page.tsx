import MovieDetailsView from '@/views/single-page/movie-details';

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MovieDetailsView movieId={id} />;
}
