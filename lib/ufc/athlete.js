import * as cheerio from 'cheerio';
import { athlete as s } from './selectors.js';
import { absoluteUrl, athleteSlug, clean } from './html.js';

/** Parse the profile header and bio from an /athlete/<slug> page, or null if it isn't one. */
export function parseAthleteProfile(html) {
  const $ = cheerio.load(html);
  const text = (sel, root = $.root()) => clean(root.find(sel).first().text());

  const name = text(s.name);
  if (!name) return null;

  return {
    name,
    nickname: text(s.nickname)?.replace(/^"|"$/g, '') ?? null,
    division: text(s.division),
    record: text(s.record)?.replace(/\s*\(W-L-D\)$/, '') ?? null,
    tags: $(s.tags).toArray().map((el) => clean($(el).text())).filter(Boolean),
    imageUrl: absoluteUrl($(s.image).first().attr('src')),
    stats: $(s.stat).toArray().map((el) => ({
      value: text(s.statValue, $(el)),
      label: text(s.statLabel, $(el)),
    })),
    bio: Object.fromEntries(
      $(s.bioField).toArray()
        .map((el) => [text(s.bioLabel, $(el)), text(s.bioValue, $(el))])
        .filter(([label, value]) => label && value),
    ),
  };
}

/** Parse the fight history from an /athlete/<slug> page, from `slug`'s point of view. */
export function parseAthleteFights(html, slug) {
  const $ = cheerio.load(html);

  return $(s.fight).toArray().map((el) => {
    const fight = $(el);
    const corners = fight.find(s.fightCorner).toArray().map((corner) => {
      const c = $(corner);
      const slug = athleteSlug(c.find('a').first().attr('href'));
      return {
        slug,
        // Older headshots have no alt text; the headline only has last names.
        name: clean(c.find('img').first().attr('alt')) ?? nameFromSlug(slug),
        imageUrl: absoluteUrl(c.find('img').first().attr('src')),
        result: resultFromClass(c.attr('class')),
      };
    });
    const self = corners.find((c) => c.slug === slug) ?? corners[0];
    const opponent = corners.find((c) => c !== self) ?? null;

    const results = Object.fromEntries(
      fight.find(s.fightResult).toArray().map((r) => [
        clean($(r).find(s.fightResultLabel).text())?.toLowerCase(),
        clean($(r).find(s.fightResultText).text()),
      ]),
    );

    return {
      result: self?.result ?? null,
      opponent: opponent && { name: opponent.name, slug: opponent.slug, imageUrl: opponent.imageUrl },
      date: clean(fight.find(s.fightDate).first().text()),
      round: results.round ?? null,
      time: results.time ?? null,
      method: results.method ?? null,
      eventUrl: absoluteUrl(fight.find(s.fightEventLink).first().attr('href')),
    };
  });
}

/** "steve-erceg" → "Steve Erceg" (drops Drupal's "-0" style duplicate suffixes) */
function nameFromSlug(slug) {
  if (!slug) return null;
  return slug.replace(/-\d+$/, '').split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function resultFromClass(className = '') {
  if (/\bwin\b/.test(className)) return 'win';
  if (/\bloss\b/.test(className)) return 'loss';
  if (/\bdraw\b/.test(className)) return 'draw';
  if (/\b(no-contest|nc)\b/.test(className)) return 'nc';
  return null;
}
