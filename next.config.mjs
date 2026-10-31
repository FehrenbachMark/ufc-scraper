/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Lets hot reload work through the Herd proxy (herd proxy ufc-champs http://127.0.0.1:3000).
  allowedDevOrigins: ['ufc-champs.test'],
  images: {
    // No `search` key, so UFC's "?itok=..." cache-busting params are allowed.
    remotePatterns: [
      { protocol: 'https', hostname: 'ufc.com', pathname: '/images/**' },
      { protocol: 'https', hostname: 'www.ufc.com', pathname: '/images/**' },
    ],
  },
};

export default nextConfig;
