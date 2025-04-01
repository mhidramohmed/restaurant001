/** @type {import('next').NextConfig} */
const nextConfig = {
    output:"export",
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'bonsai-marrakech.com',
        },
      ],
    },
  };

  module.exports = nextConfig;
