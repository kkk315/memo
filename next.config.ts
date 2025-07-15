import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 本番ビルド時のみ静的エクスポートを有効にする
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  }),
  // GitHub Pages用設定（リポジトリ名がサブパスになる場合）
  // basePath: '/memo',
  // assetPrefix: '/memo/',
};

export default nextConfig;
