import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.base.tube',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // Creator pages (/creators/youtube): video thumbnails and channel avatars from YouTube.
      { protocol: 'https', hostname: 'i.ytimg.com', port: '', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com', port: '', pathname: '/**' },
    ],
  },
  async redirects() {
    return [
      // The old thumbnail tool page: AI Thumbnails now has its landing page here.
      { source: '/tools/thumbnail-generator', destination: '/ai-thumbnails', permanent: true },
      // Modern Warfare 4 is covered on the Call of Duty page.
      { source: '/thumbnails/modern-warfare-4', destination: '/thumbnails/call-of-duty', permanent: true },
      // The creator pages live under /creators/youtube (room for other platforms later).
      { source: '/creators', destination: '/creators/youtube', permanent: true },
      // Pages of the old static site that still get visits (links on Facebook and elsewhere).
      { source: '/waiting.html', destination: '/ai-thumbnails', permanent: true },
      { source: '/Blogpost/tik-tok-growth.html', destination: '/blog/youtube-vs-tiktok-vs-instagram-what-actually-paid', permanent: true },
      { source: '/Blogpost/:path*', destination: '/blog', permanent: true },
    ];
  },
};

export default nextConfig;
