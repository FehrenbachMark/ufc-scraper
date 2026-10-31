// Shown in Eastern time, matching how ufc.com lists events.
const dateTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
});

export const formatDateTime = (iso) => (iso ? dateTime.format(new Date(iso)) : null);

/** 65.00 (inches) → 5'5" */
export function formatHeight(inches) {
  const n = Math.round(Number(inches));
  return n ? `${Math.floor(n / 12)}'${n % 12}"` : null;
}

/** "https://www.ufc.com/event/cryptocom-ufc-331#13017" → "UFC 331" */
export function eventLabel(url) {
  const slug = url?.match(/\/event\/([^/?#]+)/)?.[1];
  if (!slug) return null;
  const numbered = slug.match(/ufc-(\d+)$/);
  if (numbered) return `UFC ${numbered[1]}`;
  if (slug.includes('fight-night')) return 'UFC Fight Night';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
