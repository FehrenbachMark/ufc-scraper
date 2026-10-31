import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseChampions } from '../lib/ufc/champions.js';
import { parseEventPage, parseNextEventListing } from '../lib/ufc/events.js';
import { parseAthleteFights, parseAthleteProfile } from '../lib/ufc/athlete.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

test('parseChampions reads each titleholder card', () => {
  const [van, gane, dern] = parseChampions(fixture('athletes.html'));

  assert.deepEqual(van, {
    slug: 'joshua-van',
    division: 'Flyweight',
    gender: 'men',
    weight: '125 lb (56.82 kg)',
    name: 'Joshua Van',
    nickname: 'The Fearless',
    record: '18-2-0',
    lastFight: 'Joshua Van vs Alexandre Pantoja',
    interim: false,
    imageUrl: 'https://ufc.com/images/styles/inline/s3/2026-09/VAN_JOSHUA_09-19.png?itok=x',
    profileUrl: 'https://www.ufc.com/athlete/joshua-van',
  });

  assert.equal(gane.interim, true);
  assert.equal(gane.nickname, null);
  assert.equal(gane.lastFight, null);
  assert.equal(gane.imageUrl, 'https://www.ufc.com/images/styles/inline/s3/2026-06/GANE_CIRYL_BELT_01-22.png');

  assert.equal(dern.division, "Women's Strawweight");
  assert.equal(dern.gender, 'women');
  assert.equal(dern.imageUrl, null);
});

test('parseChampions returns [] when the block is missing', () => {
  assert.deepEqual(parseChampions('<html></html>'), []);
});

test('parseNextEventListing reads the first upcoming event only', () => {
  assert.deepEqual(parseNextEventListing(fixture('events.html')), {
    headline: 'Moicano vs Nolan',
    path: '/event/ufc-fight-night-october-31-2026',
    url: 'https://www.ufc.com/event/ufc-fight-night-october-31-2026',
    startTimes: {
      mainCard: '2026-11-01T00:00:00.000Z',
      prelims: '2026-10-31T21:00:00.000Z',
      earlyPrelims: null,
    },
    venue: 'Meta APEX',
    location: 'Las Vegas, NV, United States',
  });
  assert.equal(parseNextEventListing('<html></html>'), null);
});

test('parseEventPage reads the fight card by section', () => {
  const event = parseEventPage(fixture('event.html'));

  assert.equal(event.title, 'UFC Fight Night');
  // Empty sections (early prelims here) are dropped.
  assert.deepEqual(event.sections.map((s) => s.name), ['Main Card', 'Prelims']);

  const [main] = event.sections[0].fights;
  assert.equal(main.weightClass, 'Lightweight Title');
  assert.equal(main.titleFight, true);
  assert.deepEqual(main.red, {
    slug: 'renato-moicano',
    name: 'Renato Moicano',
    rank: '#12',
    country: 'Brazil',
    odds: '-125',
    imageUrl: 'https://ufc.com/images/MOICANO_RENATO_L.png',
    profileUrl: 'https://www.ufc.com/athlete/renato-moicano',
  });
  assert.equal(main.blue.name, 'Tom Nolan');
  assert.equal(main.blue.rank, '#14');
  assert.equal(main.blue.odds, '+105');

  const [prelim] = event.sections[1].fights;
  assert.equal(prelim.weightClass, "Women's Flyweight");
  assert.equal(prelim.titleFight, false);
  assert.equal(prelim.red.name, 'Lucia Szabová');
  assert.equal(prelim.red.rank, null);
  assert.equal(prelim.red.odds, null);
  assert.equal(prelim.blue.name, 'Tainara Lisboa');
});

test('parseAthleteProfile reads the header, stats and bio', () => {
  assert.deepEqual(parseAthleteProfile(fixture('athlete.html')), {
    name: 'Joshua Van',
    nickname: 'The Fearless',
    division: 'Flyweight Division',
    record: '18-2-0',
    tags: ['Flyweight Division', '#6 PFP', 'Title Holder'],
    imageUrl: 'https://ufc.com/images/styles/athlete_bio_full_body/s3/2026-09/VAN_JOSHUA_L_BELT_09-19.png',
    stats: [
      { value: '9', label: 'Wins by Knockout' },
      { value: '2', label: 'Wins by Submission' },
    ],
    bio: { 'Place of Birth': 'Hakha , Myanmar', Age: '25', Height: '65.00' },
  });
  // Unknown athletes redirect to a search page with no profile header.
  assert.equal(parseAthleteProfile('<html><h1>Search</h1></html>'), null);
});

test('parseAthleteFights reads results from the athlete\'s side', () => {
  const [win, loss, ...rest] = parseAthleteFights(fixture('athlete.html'), 'joshua-van');
  assert.equal(rest.length, 0);

  assert.deepEqual(win, {
    result: 'win',
    opponent: { name: 'Alexandre Pantoja', slug: 'alexandre-pantoja', imageUrl: 'https://ufc.com/images/PANTOJA_ALEXANDRE.png' },
    date: 'Sep. 19, 2026',
    round: '5',
    time: '5:00',
    method: 'Decision - Unanimous',
    eventUrl: 'https://www.ufc.com/event/cryptocom-ufc-331#13017',
  });

  // Here the athlete is in the blue corner, and the opponent headshot has no alt text.
  assert.equal(loss.result, 'loss');
  assert.equal(loss.opponent.slug, 'charles-johnson');
  assert.equal(loss.opponent.name, 'Charles Johnson'); // from the slug: no alt text
  assert.equal(loss.method, null);
  assert.equal(loss.eventUrl, null);
});
