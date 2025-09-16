import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/backend/:path*',
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