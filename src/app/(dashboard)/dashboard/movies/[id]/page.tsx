import MovieDetailsView from '@/views/single-page/movie-details';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return <MovieDetailsView movieId={params.id} />;
}
