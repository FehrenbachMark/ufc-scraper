import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getFighter } from '@/lib/data';
import { Fighter } from '@/components/Fighter';
import { Loading } from '@/components/Loading';

const isValidSlug = (slug) => /^[a-z0-9-]+$/i.test(slug);

async function loadFighter(params) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();
  const fighter = await getFighter(slug.toLowerCase());
  if (!fighter) notFound();
  return fighter;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fighter = isValidSlug(slug) ? await getFighter(slug.toLowerCase()) : null;
  return { title: fighter?.name ?? 'Fighter' };
}

// Fighters render on first visit and are cached from then on (see getFighter).
export default function FighterPage({ params }) {
  return (
    <Suspense fallback={<Loading label="Loading fighter…" />}>
      <FighterContent params={params} />
    </Suspense>
  );
}

async function FighterContent({ params }) {
  return <Fighter fighter={await loadFighter(params)} />;
}
