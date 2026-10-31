import { cacheLife } from 'next/cache';
import { fetchHtml } from './ufc/html.js';
import { parseChampions } from './ufc/champions.js';
import { parseEventPage, parseNextEventListing } from './ufc/events.js';
import { parseAthleteFights, parseAthleteProfile } from './ufc/athlete.js';

// Results are cached by Next.js and refreshed in the background once stale.
// A refresh that throws isn't cached, so the last good data keeps being served
// (and an empty parse throws, since it almost always means the markup changed).

async function requireHtml(path) {
  const html = await fetchHtml(path);
  if (html === null) throw new Error(`GET ${path} responded 404`);
  return html;
}

export async function getChampions() {
  'use cache';
  cacheLife('days');

  const champions = parseChampions(await requireHtml('/athletes'));
  if (champions.length === 0) throw new Error('No champions found; selectors may be out of date');
  return { champions, fetchedAt: new Date().toISOString() };
}

export async function getNextEvent() {
  'use cache';
  // Hourly, so the page moves on soon after an event ends.
  cacheLife('hours');

  const listing = parseNextEventListing(await requireHtml('/events'));
  if (!listing?.path) return null;
  const details = parseEventPage(await requireHtml(listing.path));
  return { ...listing, ...details };
}

const FIGHT_HISTORY_LENGTH = 5;

/** A fighter's profile and last 5 fights, or null if ufc.com has no such athlete. */
export async function getFighter(slug) {
  'use cache';
  cacheLife('days');

  // The profile lists 3 fights per page; ?page=1 has the next 3.
  const path = `/athlete/${slug}`;
  const [first, second] = await Promise.all([
    fetchHtml(path),
    fetchHtml(`${path}?page=1`).catch(() => null), // nice to have, not required
  ]);
  // Unknown athletes 302 to a search page, which has no profile header.
  const profile = first && parseAthleteProfile(first);
  if (!profile) return null;

  const fights = [first, second]
    .filter(Boolean)
    .flatMap((html) => parseAthleteFights(html, slug))
    .slice(0, FIGHT_HISTORY_LENGTH);

  return { slug, ...profile, profileUrl: `https://www.ufc.com${path}`, fights };
}
