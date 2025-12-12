import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Quando você chamar /api/...
        destination: 'http://localhost:8002/:path*', // O Next.js redireciona para o backend
      },
    ];
  },
};

export default nextConfig;
