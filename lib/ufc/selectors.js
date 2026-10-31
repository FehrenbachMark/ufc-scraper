// CSS selectors for ufc.com. Every page used here is server-rendered, so these
// work against the raw HTML. Nested selectors are scoped to their parent item.

// https://www.ufc.com/athletes – "Titleholders" block
export const champion = {
  card: '.view-athletes-titleholders .athlete-titleholder-wrp',
  division: '.ath-wlcass',          // "Flyweight", "Women's Strawweight"
  weight: '.ath-weight',            // "125 lb (56.82 kg)"
  image: '.atm-thumbnail img',      // alt text sometimes says "interim"
  nickname: '.ath-nn__nickname',    // "\"The Fearless\"" (optional)
  name: '.ath-n__name',
  profileLink: '.ath-n__name a',    // relative, e.g. "/athlete/joshua-van"
  record: '.c-ath--record',         // "18-2-0 (W-L-D)"
  // Rendered twice per card (desktop + mobile); take the first.
  lastFight: '.view-fighter-last-fight .views-row',
};

// https://www.ufc.com/events – upcoming list, soonest first
export const eventListing = {
  card: '#events-list-upcoming article.c-card-event--result',
  headline: '.c-card-event--result__headline a', // "Moicano vs Nolan", href "/event/..."
  // Carries data-{main-card,prelims-card,early-card}-timestamp (unix seconds)
  date: '.c-card-event--result__date',
  venue: '.c-card-event--result__location h5',
  locality: '.c-card-event--result__location .locality',
  region: '.c-card-event--result__location .administrative-area',
  country: '.c-card-event--result__location .country',
};

// https://www.ufc.com/athlete/<slug> (add ?page=1 for the next 3 fights)
export const athlete = {
  name: '.hero-profile__name',
  nickname: '.hero-profile__nickname',       // "\"The Fearless\"" (optional)
  division: '.hero-profile__division-title', // "Flyweight Division"
  record: '.hero-profile__division-body',    // "18-2-0 (W-L-D)"
  tags: '.hero-profile__tag',                // "#6 PFP", "Title Holder", ...
  image: 'img.hero-profile__image',          // full body, 460x700
  stat: '.hero-profile__stat',               // "9" / "Wins by Knockout"
  statValue: '.hero-profile__stat-numb',
  statLabel: '.hero-profile__stat-text',
  bioField: '.c-bio__field',                 // "Age" / "25", "Height" / "65.00" (inches)
  bioLabel: '.c-bio__label',
  bioValue: '.c-bio__text',
  // Fight history, newest first, 3 per page
  fight: '#athlete-record article.c-card-event--athlete-results',
  // Two per fight (red, blue), each with a profile link, a headshot (alt = full
  // name) and a class of win / loss / draw / no-contest.
  fightCorner: '.c-card-event--athlete-results__image',
  fightDate: '.c-card-event--athlete-results__date',          // "Sep. 19, 2026"
  fightResult: '.c-card-event--athlete-results__result',      // label/text pairs: Round, Time, Method
  fightResultLabel: '.c-card-event--athlete-results__result-label',
  fightResultText: '.c-card-event--athlete-results__result-text',
  fightEventLink: '.c-card-event--athlete-results__actions a[href*="/event/"]',
};

// https://www.ufc.com/event/<slug>
export const eventPage = {
  title: '.c-hero__headline-prefix h1',  // "UFC Fight Night", "UFC 334"
  section: '#main-card, #prelims-card, #early-prelims',
  sectionTitle: '.c-event-fight-card-broadcaster__card-title', // "Main Card", "Prelims"
  fight: '.c-listing-fight',
  weightClass: '.c-listing-fight__class--desktop .c-listing-fight__class-text', // "Lightweight Bout"
  // Two per fight (red, blue); empty when unranked.
  ranks: '.c-listing-fight__class--desktop .c-listing-fight__corner-rank',
  odds: '.c-listing-fight__odds-amount', // two per fight (red, blue)
  corner: (color) => ({
    // Usually given/family-name spans, but sometimes plain text in the link.
    name: `.c-listing-fight__corner-name--${color}`,
    link: `.c-listing-fight__corner-name--${color} a`,
    image: `.c-listing-fight__corner-image--${color} img`,
    country: `.c-listing-fight__country--${color} .c-listing-fight__country-text`,
  }),
};
