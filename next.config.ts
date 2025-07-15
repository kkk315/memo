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
  // 独自ドメインを使用する場合、basePathやassetPrefixは不要
};

export default nextConfig;
