import * as cheerio from 'cheerio';
import { eventListing as listing, eventPage as page } from './selectors.js';
import { absoluteUrl, athleteSlug, clean } from './html.js';

const toIso = (unixSeconds) => (unixSeconds ? new Date(Number(unixSeconds) * 1000).toISOString() : null);

/** Parse the soonest upcoming event from the /events page, or null if none is listed. */
export function parseNextEventListing(html) {
  const $ = cheerio.load(html);
  const card = $(listing.card).first();
  if (!card.length) return null;

  const text = (sel) => clean(card.find(sel).first().text());
  const date = card.find(listing.date).first();
  const href = card.find(listing.headline).first().attr('href');

  return {
    headline: text(listing.headline),
    path: href ?? null,
    url: absoluteUrl(href),
    startTimes: {
      mainCard: toIso(date.attr('data-main-card-timestamp')),
      prelims: toIso(date.attr('data-prelims-card-timestamp')),
      earlyPrelims: toIso(date.attr('data-early-card-timestamp')),
    },
    venue: text(listing.venue),
    location: [text(listing.locality), text(listing.region), text(listing.country)].filter(Boolean).join(', ') || null,
  };
}

/** Parse the event title and fight card from an /event/<slug> page. */
export function parseEventPage(html) {
  const $ = cheerio.load(html);

  const sections = $(page.section).toArray().map((sectionEl) => {
    const section = $(sectionEl);
    const fights = section.find(page.fight).toArray().map((fightEl) => parseFight($, $(fightEl)));
    return { name: clean(section.find(page.sectionTitle).first().text()), fights };
  });

  return {
    title: clean($(page.title).first().text()),
    sections: sections.filter((section) => section.fights.length > 0),
  };
}

function parseFight($, fight) {
  const weightClass = clean(fight.find(page.weightClass).first().text());
  const ranks = fight.find(page.ranks).toArray().map((el) => clean($(el).text()));
  const odds = fight.find(page.odds).toArray().map((el) => clean($(el).text()));

  const corner = (color, index) => {
    const s = page.corner(color);
    const text = (sel) => clean(fight.find(sel).first().text());
    const href = fight.find(s.link).first().attr('href');
    return {
      slug: athleteSlug(href),
      name: text(s.name),
      rank: ranks[index] ?? null,
      country: text(s.country),
      odds: odds[index] ?? null,
      imageUrl: absoluteUrl(fight.find(s.image).first().attr('src')),
      profileUrl: absoluteUrl(href),
    };
  };

  return {
    weightClass: weightClass?.replace(/\s*Bout$/i, '') ?? null,
    titleFight: /\btitle\b/i.test(weightClass ?? ''),
    red: corner('red', 0),
    blue: corner('blue', 1),
  };
}
