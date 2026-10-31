export const BASE_URL = 'https://www.ufc.com';

// Identify ourselves honestly, with a way to get in touch.
const USER_AGENT = 'UFCChampsBot/1.0 (+https://markfehrenbach.dev)';

// Politeness: requests to ufc.com go out one at a time, at least this far
// apart. (Their robots.txt asks crawlers for 15s; we're not crawling, only
// fetching the few pages visitors ask for, and those are cached for hours.)
const MIN_GAP_MS = 3_000;

let queue = Promise.resolve();
let lastRequestAt = 0;
const inFlight = new Map();

/** GET a ufc.com page's HTML, or null on 404. Throttled, and deduped while in flight. */
export function fetchHtml(path) {
  const url = new URL(path, BASE_URL).href;
  if (!inFlight.has(url)) {
    const request = throttled(() => get(url)).finally(() => inFlight.delete(url));
    inFlight.set(url, request);
  }
  return inFlight.get(url);
}

function throttled(task) {
  const run = queue.then(async () => {
    const wait = lastRequestAt + MIN_GAP_MS - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestAt = Date.now();
    return task();
  });
  queue = run.catch(() => {}); // one failure mustn't stall the queue
  return run;
}

async function get(url) {
  console.log(`[ufc] GET ${url}`); // so the server logs show exactly what we fetch
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
    signal: AbortSignal.timeout(20_000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${url} responded ${res.status}`);
  return res.text();
}

/** Collapse whitespace in scraped text; '' becomes null. */
export const clean = (text) => text?.replace(/\s+/g, ' ').trim() || null;

export const absoluteUrl = (href) => (href ? new URL(href, BASE_URL).href : null);

/** "https://www.ufc.com/athlete/joshua-van" or "/athlete/joshua-van" → "joshua-van" */
export const athleteSlug = (href) => href?.match(/\/athlete\/([^/?#]+)/)?.[1] ?? null;
