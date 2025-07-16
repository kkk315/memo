import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { siteConfig } from '../../lib/site-config';
import styles from '../styles/categories.module.css';

// カテゴリの型定義
type Category = {
  name: string;
  displayName: string;
  description: string;
  articleCount: number;
  latestArticleDate?: string;
};

export default async function CategoriesPage() {
  const contentPath = path.join(process.cwd(), 'content');
  const names = await fs.readdir(contentPath);
  const categories: Category[] = [];

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

  // カテゴリ情報を収集
  for (const name of names) {
    const categoryPath = path.join(contentPath, name);
    const stat = await fs.stat(categoryPath);
    
    if (stat.isDirectory()) {
      const articles = await fs.readdir(categoryPath);
      let articleCount = 0;
      let latestDate: Date | null = null;

      // 記事数をカウントし、最新記事の日付を取得
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
            
            articleCount++;
            
            // 日付を確認
            if (data.date) {
              const articleDate = new Date(data.date);
              if (!latestDate || articleDate > latestDate) {
                latestDate = articleDate;
              }
            }
          }
        } catch {
          // アクセスできないファイルはスキップ
        }
      }

      const config = await getCategoryMetadata(name);

      categories.push({
        name,
        displayName: config.displayName,
        description: config.description,
        articleCount,
        latestArticleDate: latestDate?.toISOString()
      });
    }
  }

  // 記事数で並び替え（記事数が多い順）
  const sortedCategories = categories
    .filter(category => category.articleCount > 0)
    .sort((a, b) => b.articleCount - a.articleCount);

  // 日付のフォーマット関数
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  return (
    <main className={styles.main}>
      {sortedCategories.length > 0 ? (
        <section className={styles.categoriesSection}>
          <div className={styles.categoriesGrid}>
            {sortedCategories.map((category) => (
              <Link
                key={category.name}
                href={`/${encodeURIComponent(category.name)}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{category.displayName}</h2>
                  <span className={styles.articleCount}>
                    {category.articleCount}記事
                  </span>
                </div>
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
                {category.latestArticleDate && (
                  <div className={styles.latestInfo}>
                    <span className={styles.latestLabel}>最新更新:</span>
                    <time className={styles.latestDate}>
                      {formatDate(category.latestArticleDate)}
                    </time>
                  </div>
                )}
                <div className={styles.categoryLink}>
                  カテゴリを見る
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.emptyState}>
          <h2>カテゴリがありません</h2>
          <p>まだカテゴリが作成されていません。</p>
        </div>
      )}
    </main>
  );
}

// メタデータ
export const metadata: Metadata = {
  title: `カテゴリ一覧 | ${siteConfig.title}`,
  description: `技術ブログのカテゴリ一覧ページです。${siteConfig.description}`,
  keywords: ['カテゴリ', ...siteConfig.keywords],
  openGraph: {
    title: `カテゴリ一覧 | ${siteConfig.title}`,
    description: `技術ブログのカテゴリ一覧ページです。${siteConfig.description}`,
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: `カテゴリ一覧 | ${siteConfig.title}`,
    description: `技術ブログのカテゴリ一覧ページです。${siteConfig.description}`,
  },
};
