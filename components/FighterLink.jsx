import Link from 'next/link';

/**
 * Links to our fighter page, falling back to UFC.com when the slug is unknown.
 * No prefetching: a page full of these would scrape every fighter on it.
 */
export function FighterLink({ slug, profileUrl, ...props }) {
  if (slug) return <Link href={`/fighter/${slug}`} prefetch={false} {...props} />;
  return <a href={profileUrl} target="_blank" rel="noopener" {...props} />;
}
