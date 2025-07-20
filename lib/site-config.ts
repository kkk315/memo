// サイト全体の設定とテキストを管理
export const siteConfig = {
  // サイト基本情報
  title: 'mkazu.net',
  author: 'mkazu',
  description: '個人の技術ブログ。Web技術やプログラミングに関する知見を共有します。',
  // Google Analytics（GA4）トラッキングID（例: G-XXXXXXXXXX）
  googleAnalyticsId: 'G-RKJ7E7VJ1N',
  
  // メタデータ
  keywords: ['技術ブログ', 'プログラミング', '開発', 'エンジニアリング', 'Web開発', 'ソフトウェア'],
  
  // ヒーローセクション
  hero: {
    title: 'mkazu.net',
    description: '。'
  },
  
  // セクションタイトル
  sections: {
    latestArticles: '最新の記事',
    categories: 'カテゴリ一覧'
  },
  
  // UI テキスト
  ui: {
    readMore: '記事を読む →',
    articleCount: (count: number) => `記事：${count}`,
    defaultCategoryDescription: 'このカテゴリの記事一覧です。'
  },
  
  // フッター
  footer: {
    copyright: (year: number) => `© ${year} mkazu.net`
  }
};

export type SiteConfig = typeof siteConfig;
