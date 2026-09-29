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
    ],
  },
  async redirects() {
    return [
      // The old thumbnail tool page: AI Thumbnails now has its landing page here.
      { source: '/tools/thumbnail-generator', destination: '/ai-thumbnails', permanent: true },
    ];
  },
};

export default nextConfig;
