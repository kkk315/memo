import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages用設定（リポジトリ名がサブパスになる場合）
  // basePath: '/memo',
  // assetPrefix: '/memo/',
};

export default nextConfig;
