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
  // PWA configuration for mobile optimization
  experimental: {
    appDir: true,
  },
}

export default nextConfig;