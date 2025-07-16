import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { siteConfig } from '../../../lib/site-config';
import styles from './Sidebar.module.css';

// 記事の型定義
type Article = {
  title: string;
  url: string;
  date: Date;
};

// カテゴリの型定義
type Category = {
  name: string;
  displayName: string;
  articleCount: number;
};

export default async function Sidebar() {
  const contentPath = path.join(process.cwd(), 'content');
  const names = await fs.readdir(contentPath);
  
  const categories: Category[] = [];
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

  // カテゴリと記事を読み込み
  for (const name of names) {
    const categoryPath = path.join(contentPath, name);
    const stat = await fs.stat(categoryPath);
    
    if (stat.isDirectory()) {
      const articles = await fs.readdir(categoryPath);
      let articleCount = 0;
      
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
            
            // 記事情報を追加
            allArticles.push({
              title: data.title || article,
              url: `/${encodeURIComponent(name)}/${encodeURIComponent(article)}`,
              date: data.date ? new Date(data.date) : new Date()
            });
          }
        } catch {
          // アクセスできないファイルはスキップ
        }
      }

      if (articleCount > 0) {
        const config = await getCategoryMetadata(name);
        categories.push({
          name,
          displayName: config.displayName,
          articleCount
        });
      }
    }
  }

  // 最新記事を10件取得
  const recentArticles = allArticles
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  // 日付フォーマット関数
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <aside className={styles.sidebar}>
      {/* サイト説明セクション */}
      <section className={styles.profileSection}>
        <h2 className={styles.sidebarTitle}>About</h2>
        <div className={styles.profileInfo}>
          <h3>{siteConfig.author}</h3>
          <p>{siteConfig.description}</p>
        </div>
      </section>

      {/* カテゴリセクション */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sidebarTitle}>カテゴリ</h2>
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li key={category.name} className={styles.categoryItem}>
              <Link 
                href={`/${encodeURIComponent(category.name)}`}
                className={styles.categoryLink}
              >
                <span className={styles.categoryName}>{category.displayName}</span>
                <span className={styles.categoryCount}>{category.articleCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 最新記事セクション */}
      <section className={styles.recentSection}>
        <h2 className={styles.sidebarTitle}>最近の記事</h2>
        <ul className={styles.recentList}>
          {recentArticles.map((article, index) => (
            <li key={index} className={styles.recentItem}>
              <Link href={article.url} className={styles.recentLink}>
                {article.title}
              </Link>
              <div className={styles.recentDate}>
                {formatDate(article.date)}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
