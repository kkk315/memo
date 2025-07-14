
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// SSG用: generateStaticParams（ファイル先頭に移動）
export default async function CategoryArticlesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const categoryPath = path.join(process.cwd(), 'content', decodedCategory);
  const names = await fs.readdir(categoryPath);
  const articles: { name: string; title: string; date: string }[] = [];
  for (const name of names) {
    const articlePath = path.join(categoryPath, name, 'index.md');
    try {
      const file = await fs.readFile(articlePath, 'utf8');
      const { data } = matter(file);
      articles.push({ name, title: data.title ?? name, date: data.date ?? '' });
    } catch {}
  }
  // 日付降順でソート
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div>
      <h1>{decodedCategory} の記事一覧</h1>
      <ul>
        {articles.map(article => {
          return (
            <li key={article.name}>
              <Link href={`/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(article.name)}`}>{article.title}</Link>
            </li>
          );
        })}
      </ul>
      <Link href="/">← カテゴリ一覧へ戻る</Link>
    </div>
  );
}

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
