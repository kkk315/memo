import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata, Viewport } from 'next';

// 記事の型定義
type Article = {
  category: string;
  categoryDisplayName: string;
  article: string;
  title: string;
  date: string;
  description?: string;
  href: string;
};

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

  // 最新記事を取得
  const allArticles: Article[] = [];

  for (const name of names) {
    const categoryPath = path.join(contentPath, name);
    const stat = await fs.stat(categoryPath);
    
    if (stat.isDirectory()) {
      const articles = await fs.readdir(categoryPath);
      
      for (const article of articles) {
        const articlePath = path.join(categoryPath, article);
        try {
          const articleStat = await fs.stat(articlePath);
          if (articleStat.isDirectory()) {
            const indexPath = path.join(articlePath, 'index.md');
            await fs.access(indexPath);
            
            // 記事のメタデータを読み込み
            const fileContent = await fs.readFile(indexPath, 'utf8');
            const { data } = matter(fileContent);
            
            const config = categoryConfig[name] || {
              displayName: name,
              description: 'このカテゴリの記事一覧です。',
              icon: '📚'
            };
            
            allArticles.push({
              category: name,
              categoryDisplayName: config.displayName,
              article,
              title: data.title || article,
              date: data.date || new Date().toISOString(),
              description: data.description as string,
              href: `/${encodeURIComponent(name)}/${encodeURIComponent(article)}`
            });
          }
        } catch {
          // アクセスできないファイルはスキップ
        }
      }
    }
  }

  // 日付でソートして最新5件を取得
  const latestArticles = allArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // カテゴリ一覧の作成
  for (const name of names) {
    const categoryPath = path.join(contentPath, name);
    const stat = await fs.stat(categoryPath);
    
    if (stat.isDirectory()) {
      // 記事数を数える（既に上で処理済みの情報を再利用）
      const categoryArticles = allArticles.filter(article => article.category === name);
      const articleCount = categoryArticles.length;

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

  // 日付のフォーマット関数
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

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

      {/* 最新記事セクション */}
      {latestArticles.length > 0 && (
        <section className="latest-articles-section">
          <h2 className="section-title">最新の記事</h2>
          <div className="latest-articles-grid">
            {latestArticles.map((article) => (
              <Link
                key={`${article.category}-${article.article}`}
                href={article.href}
                className="latest-article-card"
              >
                <div className="latest-article-meta">
                  <span className="latest-article-category">
                    {article.categoryDisplayName}
                  </span>
                  <time className="latest-article-date">
                    {formatDate(article.date)}
                  </time>
                </div>
                <h3 className="latest-article-title">{article.title}</h3>
                {article.description && (
                  <p className="latest-article-description">
                    {article.description}
                  </p>
                )}
                <div className="latest-article-link">
                  記事を読む →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* カテゴリグリッド */}
      <section className="categories-section">
        <h2 className="section-title">カテゴリ一覧</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <h3>
                <span>{category.icon}</span>
                {category.displayName}
              </h3>
              <p>{category.description}</p>
              <div className="category-stats">
                <span>{category.articleCount}件の記事</span>
                <span className="category-link">
                  記事を見る →
                </span>
              </div>
            </Link>
          ))}
        </div>
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
