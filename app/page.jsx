import { Suspense } from 'react';
import { getChampions } from '@/lib/data';
import { Champions } from '@/components/Champions';
import { Loading } from '@/components/Loading';

export default function ChampionsPage() {
  return (
    <Suspense fallback={<Loading label="Loading champions…" />}>
      <ChampionsContent />
    </Suspense>
  );
}

async function ChampionsContent() {
  const { champions, fetchedAt } = await getChampions();
  return <Champions champions={champions} fetchedAt={fetchedAt} />;
}
