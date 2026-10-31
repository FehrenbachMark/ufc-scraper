// Fighter pages link to opponents, who link to theirs, and each new page costs
// two requests to ufc.com. Keep crawlers from walking the whole roster.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/fighter/' },
  };
}
