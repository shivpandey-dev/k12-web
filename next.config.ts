import type { NextConfig } from 'next';

// Server-only: where the /api/v1 proxy forwards to. Never expose it with NEXT_PUBLIC_.
const apiOrigin = (process.env.K12_API_ORIGIN ?? 'http://localhost:3000').replace(/\/+$/, '');

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Same-origin proxy keeps k12-api's HttpOnly refresh cookie first-party, and forwards the
  // original host as x-forwarded-host for School-hostname login (k12-api TRUST_PROXY_HOPS=1).
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: `${apiOrigin}/api/v1/:path*` }];
  },
};

export default nextConfig;
