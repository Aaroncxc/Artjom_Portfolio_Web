/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'cdn.multikunst.com'],
    unoptimized: false,
  },
  // Allow serving static HTML projects from /public/projects/
  async headers() {
    return [
      {
        source: '/projects/:slug/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
