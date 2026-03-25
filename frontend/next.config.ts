import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  reactCompiler: true,
  images: {
    disableStaticImages: true,
  },
};

export default nextConfig;
