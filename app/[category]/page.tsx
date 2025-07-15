
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata, Viewport } from 'next';
import { siteConfig } from '../../lib/site-config';

export default async function CategoryArticlesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const categoryPath = path.join(process.cwd(), 'content', decodedCategory);
  const names = await fs.readdir(categoryPath);
  const articles: { name: string; title: string; date: string; excerpt?: string }[] = [];
  
  // カテゴリのメタデータを読み込む
  const getCategoryMetadata = async (categoryName: string) => {
    const metadataPath = path.join(process.cwd(), 'content', categoryName, 'metadata.md');
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
  
  const categoryMeta = await getCategoryMetadata(decodedCategory);
  const displayName = categoryMeta.displayName;
  
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
    <div>
      {/* カテゴリヘッダー */}
      <div className="category-header">
        <h1>📂 {displayName}</h1>
        <p className="category-description">
          このカテゴリには {articles.length} 件の記事があります。
          気になる記事をクリックして詳細をご覧ください。
        </p>
      </div>
      
      {/* 記事グリッド */}
      <div className="articles-grid">
        {articles.map(article => (
          <Link 
            key={article.name}
            href={`/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(article.name)}`}
            className="article-card"
          >
            <div className="article-card-content">
              <h3>{article.title}</h3>
              {article.excerpt && (
                <p>{article.excerpt}</p>
              )}
              {article.date && (
                <div className="article-card-date">
                  📅 {article.date}
                </div>
              )}
              <div className="article-card-arrow">続きを読む →</div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* バックリンク */}
      <div className="back-link">
        <Link href="/" className="back-button">
          ← カテゴリ一覧へ戻る
        </Link>
      </div>
    </div>
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
  const title = `${displayName} | Tech Blog`;
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
