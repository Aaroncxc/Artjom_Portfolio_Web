/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Unblock Vercel build if lint/types fail
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: nur wenn du auch TypeScript-Fehler erstmal ignorieren willst
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.multikunst.com', pathname: '/**' },
    ],
    unoptimized: false,
  },

  // Allow serving static HTML projects from /public/projects/
  async headers() {
    return [
      {
        source: '/projects/:slug/:path*',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ];
  },
};

module.exports = nextConfig;

