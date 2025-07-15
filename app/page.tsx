import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import type { Metadata, Viewport } from 'next';

export default async function HomePage() {
  const contentPath = path.join(process.cwd(), 'content');
  const names = await fs.readdir(contentPath);
  const categories: Array<{
    name: string;
    displayName: string;
    description: string;
    articleCount: number;
    icon: string;
  }> = [];

  // カテゴリ情報の設定
  const categoryConfig: Record<string, { displayName: string; description: string; icon: string }> = {
    'sample-category': {
      displayName: 'サンプルカテゴリ',
      description: 'サンプル記事とデモンストレーション用のコンテンツを収録しています。',
      icon: '📝'
    },
    'test': {
      displayName: 'テスト',
      description: '実験的な機能やテスト用のコンテンツを掲載しています。',
      icon: '🧪'
    },
    'てすと': {
      displayName: '日本語テスト',
      description: '日本語URLのテストと国際化対応のサンプルです。',
      icon: '🗾'
    }
  };

  for (const name of names) {
    const categoryPath = path.join(contentPath, name);
    const stat = await fs.stat(categoryPath);
    
    if (stat.isDirectory()) {
      // 記事数を数える
      const articles = await fs.readdir(categoryPath);
      let articleCount = 0;
      
      for (const article of articles) {
        const articlePath = path.join(categoryPath, article);
        try {
          const articleStat = await fs.stat(articlePath);
          if (articleStat.isDirectory()) {
            const indexPath = path.join(articlePath, 'index.md');
            await fs.access(indexPath);
            articleCount++;
          }
        } catch {
          // アクセスできないファイルはスキップ
        }
      }

      const config = categoryConfig[name] || {
        displayName: name,
        description: 'このカテゴリの記事一覧です。',
        icon: '📚'
      };

      categories.push({
        name,
        displayName: config.displayName,
        description: config.description,
        articleCount,
        icon: config.icon
      });
    }
  }

  return (
    <main>
      {/* ヒーローセクション */}
      <section className="hero-section">
        <h1 className="hero-title">Tech Memo</h1>
        <p className="hero-description">
          技術的な知見とインサイトを共有する、プロフェッショナルなメモブログです。
          最新の技術トレンドから実践的なプログラミングテクニックまで、
          エンジニアに役立つ情報をお届けします。
        </p>
      </section>

      {/* カテゴリグリッド */}
      <section className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/${encodeURIComponent(category.name)}`}
            className="category-card"
          >
            <h2>
              <span>{category.icon}</span>
              {category.displayName}
            </h2>
            <p>{category.description}</p>
            <div className="category-stats">
              <span>{category.articleCount}件の記事</span>
              <span className="category-link">
                記事を見る →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

// メタデータ
export const metadata: Metadata = {
  title: 'Tech Blog | 技術ブログ',
  description: '技術に関する知識やノウハウを共有する技術ブログです。プログラミング、開発ツール、ベストプラクティスなど、様々な技術記事をお届けします。',
  keywords: ['技術ブログ', 'プログラミング', '開発', 'テクノロジー', 'エンジニア'],
  openGraph: {
    title: 'Tech Blog | 技術ブログ',
    description: '技術に関する知識やノウハウを共有する技術ブログです。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Blog | 技術ブログ',
    description: '技術に関する知識やノウハウを共有する技術ブログです。',
  },
};

// Viewport設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
