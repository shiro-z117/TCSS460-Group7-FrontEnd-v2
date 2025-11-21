import ShowDetailsView from '@/views/single-page/show-details';

export default function ShowDetailPage({ params }: { params: { id: string } }) {
  return <ShowDetailsView showId={params.id} />;
}
