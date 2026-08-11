/** @type {import('next').NextConfig} */
const nextConfig = {
  // ytdl-core butuh module Node native, pastikan tidak di-bundle ke edge
  experimental: {
    serverComponentsExternalPackages: ['@distube/ytdl-core'],
  },
};

module.exports = nextConfig;
