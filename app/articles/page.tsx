import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { siteConfig } from '../../lib/site-config';
import styles from '../styles/articles.module.css';

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

export default async function ArticlesPage() {
  const contentPath = path.join(process.cwd(), 'content');
  const names = await fs.readdir(contentPath);
  const allArticles: Article[] = [];

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
      return {
        displayName: categoryName,
        description: siteConfig.ui.defaultCategoryDescription
      };
    }
  };

  // 全記事を取得
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

  // 日付でソートして全記事を取得
  const sortedArticles = allArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      {sortedArticles.length > 0 ? (
        <section className={styles.articlesSection}>
          <div className={styles.articlesGrid}>
            {sortedArticles.map((article) => (
              <Link
                key={`${article.category}-${article.article}`}
                href={article.href}
                className={styles.articleCard}
              >
                <div className={styles.articleMeta}>
                  <span className={styles.articleCategory}>
                    {article.categoryDisplayName}
                  </span>
                  <time className={styles.articleDate}>
                    {formatDate(article.date)}
                  </time>
                </div>
                <h2 className={styles.articleTitle}>{article.title}</h2>
                {article.description && (
                  <p className={styles.articleDescription}>
                    {article.description}
                  </p>
                )}
                <div className={styles.articleLink}>
                  {siteConfig.ui.readMore}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.emptyState}>
          <h2>記事がありません</h2>
          <p>まだ記事が投稿されていません。</p>
        </div>
      )}
    </main>
  );
}

// メタデータ
export const metadata: Metadata = {
  title: '全記事一覧',
  description: `技術ブログの全記事を最新順で表示しています。${siteConfig.description}`,
  keywords: ['記事一覧', ...siteConfig.keywords],
  openGraph: {
    title: `全記事一覧 | ${siteConfig.title}`,
    description: `技術ブログの全記事を最新順で表示しています。${siteConfig.description}`,
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: `全記事一覧 | ${siteConfig.title}`,
    description: `技術ブログの全記事を最新順で表示しています。${siteConfig.description}`,
  },
};
