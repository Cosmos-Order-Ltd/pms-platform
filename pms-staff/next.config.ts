import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/v1/:path*',
      },
    ]
  },
  // PWA configuration
  experimental: {
    appDir: true,
  },
  // PWA setup with next-pwa
  // Note: This requires next-pwa configuration in production
}

export default nextConfig;