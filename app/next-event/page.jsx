import { Suspense } from 'react';
import { getEventResults, getNextEvent } from '@/lib/data';
import { NextEvent } from '@/components/NextEvent';
import { Loading } from '@/components/Loading';

export const metadata = { title: 'Next Event' };

export default function NextEventPage() {
  return (
    <Suspense fallback={<Loading label="Loading next event…" />}>
      <NextEventContent />
    </Suspense>
  );
}

async function NextEventContent() {
  const event = await getNextEvent();
  if (!event) return <p className="py-12 text-center text-slate-400">No upcoming event is listed on UFC.com right now.</p>;
  // Results are a bonus: if the feed fails, still show the card.
  const results = event.liveStatsId ? await getEventResults(event.liveStatsId).catch(() => ({})) : {};
  return <NextEvent event={event} results={results} />;
}
