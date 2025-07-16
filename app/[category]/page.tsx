import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata, Viewport } from 'next';
import styles from '../styles/category.module.css';

export default async function CategoryArticlesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const categoryPath = path.join(process.cwd(), 'content', decodedCategory);
  const names = await fs.readdir(categoryPath);
  const articles: { name: string; title: string; date: string; excerpt?: string }[] = [];
  
  // 日付フォーマット関数
  function formatDateForCard(dateValue?: string): string {
    if (!dateValue) return '';
    
    try {
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) {
        return dateValue;
      }
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    } catch {
      return dateValue || '';
    }
  }
  
  for (const name of names) {
    const articlePath = path.join(categoryPath, name, 'index.md');
    try {
      const file = await fs.readFile(articlePath, 'utf8');
      const { data, content } = matter(file);
      
      // 日付を確実に文字列に変換
      const dateString = data.date ? String(data.date) : '';
      const formattedDate = formatDateForCard(dateString);
      
      // 記事の抜粋を作成（最初の段落から）
      const excerpt = content
        .split('\n')
        .find(line => line.trim() && !line.startsWith('#'))
        ?.substring(0, 120) + '...';
      
      articles.push({ 
        name, 
        title: data.title ?? name, 
        date: formattedDate,
        excerpt
      });
    } catch {
      // ファイルが読めない場合はスキップ
    }
  }
  
  // 日付降順でソート
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));
  
  return (
    <main className={styles.main}>
      {/* ナビゲーション */}
      <div className={styles.navigation}>
        <Link href="/categories" className={styles.navLink}>
          カテゴリ一覧
        </Link>
        <Link href="/articles" className={styles.navLink}>
          全記事一覧
        </Link>
      </div>
      
      {/* 記事一覧 */}
      {articles.length > 0 ? (
        <section className={styles.articlesSection}>
          <div className={styles.articlesGrid}>
            {articles.map(article => (
              <Link 
                key={article.name}
                href={`/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(article.name)}`}
                className={styles.articleCard}
              >
                <div className={styles.articleDate}>
                  {article.date}
                </div>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                {article.excerpt && (
                  <p className={styles.articleDescription}>{article.excerpt}</p>
                )}
                <div className={styles.articleLink}>続きを読む</div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.emptyState}>
          <h2>記事がありません</h2>
          <p>このカテゴリにはまだ記事が投稿されていません。</p>
          <Link href="/categories">他のカテゴリを見る</Link>
        </div>
      )}
    </main>
  );
}

// SSG用: generateStaticParams
export async function generateStaticParams() {
  const contentPath = path.join(process.cwd(), 'content');
  const categories = await fs.readdir(contentPath);
  const params: { category: string }[] = [];
  for (const category of categories) {
    const categoryPath = path.join(contentPath, category);
    const stat = await fs.stat(categoryPath);
    if (!stat.isDirectory()) continue;
    params.push({ category });
  }
  return params;
}

// メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  const categoryDisplayNames: Record<string, string> = {
    'sample-category': 'サンプルカテゴリ',
    'test': 'テスト',
    'てすと': '日本語テスト'
  };
  
  const displayName = categoryDisplayNames[decodedCategory] || decodedCategory;
  const title = `${displayName}`;
  const description = `${displayName}の技術記事一覧`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

// Viewport設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
