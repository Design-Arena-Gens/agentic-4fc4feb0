/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['agentic-4fc4feb0.vercel.app']
    }
  },
  reactStrictMode: true
};

module.exports = nextConfig;
