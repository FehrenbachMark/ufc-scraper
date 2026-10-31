import * as cheerio from 'cheerio';
import { champion as s } from './selectors.js';
import { absoluteUrl, athleteSlug, clean } from './html.js';

/** Parse the titleholders from the /athletes page. */
export function parseChampions(html) {
  const $ = cheerio.load(html);

  return $(s.card).toArray().map((el) => {
    const card = $(el);
    const text = (sel) => clean(card.find(sel).first().text());
    const img = card.find(s.image).first();
    const division = text(s.division);
    const href = card.find(s.profileLink).first().attr('href');

    return {
      slug: athleteSlug(href),
      division,
      gender: /^women/i.test(division) ? 'women' : 'men',
      weight: text(s.weight),
      name: text(s.name),
      nickname: text(s.nickname)?.replace(/^"|"$/g, '') ?? null,
      record: text(s.record)?.replace(/\s*\(W-L-D\)$/, '') ?? null,
      lastFight: text(s.lastFight),
      interim: /\binterim\b/i.test(img.attr('alt') ?? ''),
      imageUrl: absoluteUrl(img.attr('src')),
      profileUrl: absoluteUrl(href),
    };
  });
}
