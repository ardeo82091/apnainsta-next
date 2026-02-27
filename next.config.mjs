/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.devtool = 'source-map'; // IMPORTANT
    return config;
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
