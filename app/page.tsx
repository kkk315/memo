import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata, Viewport } from 'next';
import { siteConfig } from '../lib/site-config';
import styles from './styles/home.module.css';

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
  }> = [];

  // カテゴリのメタデータを読み込む関数
  const getCategoryMetadata = async (categoryName: string) => {
    const metadataPath = path.join(contentPath, categoryName, 'metadata.md');
    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf8');
      const { data } = matter(metadataContent);
      return {
        displayName: categoryName,
        description: data.description || siteConfig.ui.defaultCategoryDescription
      };
    } catch {
      // metadata.mdがない場合はデフォルト値を返す
      return {
        displayName: categoryName,
        description: siteConfig.ui.defaultCategoryDescription
      };
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
            
            const config = await getCategoryMetadata(name);
            
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

      const config = await getCategoryMetadata(name);

      categories.push({
        name,
        displayName: config.displayName,
        description: config.description,
        articleCount
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
    <main className={styles.main}>

      {/* 最新記事セクション */}
      {latestArticles.length > 0 && (
        <section>
          <h2 className="section-title">{siteConfig.sections.latestArticles}</h2>
          <div className={styles.latestArticlesGrid}>
            {latestArticles.map((article) => (
              <Link
                key={`${article.category}-${article.article}`}
                href={article.href}
                className={styles.latestArticleCard}
              >
                <div className={styles.latestArticleMeta}>
                  <span className={styles.latestArticleCategory}>
                    {article.categoryDisplayName}
                  </span>
                  <time className={styles.latestArticleDate}>
                    {formatDate(article.date)}
                  </time>
                </div>
                <h3 className={styles.latestArticleTitle}>{article.title}</h3>
                {article.description && (
                  <p className={styles.latestArticleDescription}>
                    {article.description}
                  </p>
                )}
                <div className={styles.latestArticleLink}>
                  {siteConfig.ui.readMore}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* カテゴリグリッド */}
      <section className={styles.categoriesSection}>
        <h2 className="section-title">{siteConfig.sections.categories}</h2>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/${encodeURIComponent(category.name)}`}
              className={styles.categoryCard}
            >
              <h3>
                {category.displayName}
              </h3>
              <p>{category.description}</p>
              <div className={styles.categoryStats}>
                <span>{siteConfig.ui.articleCount(category.articleCount)}</span>
                <span className={styles.categoryLink}>
                  {siteConfig.ui.readMore}
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
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

// Viewport設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
