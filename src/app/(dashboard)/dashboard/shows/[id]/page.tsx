import ShowDetailsView from '@/views/single-page/show-details';

export default async function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShowDetailsView showId={id} />;
}
