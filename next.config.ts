import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // /band-name-generator/ -> out/band-name-generator/index.html
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
