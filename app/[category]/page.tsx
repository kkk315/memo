import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

export default async function CategoryArticlesPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryPath = path.join(process.cwd(), 'content', category);
  const names = await fs.readdir(categoryPath);
  const articles: string[] = [];
  for (const name of names) {
    const stat = await fs.stat(path.join(categoryPath, name));
    if (stat.isDirectory()) articles.push(name);
  }
  return (
    <main>
      <h1>{category} の記事一覧</h1>
      <ul>
        {articles.map((article) => (
          <li key={article}>
            <Link href={`/${category}/${article}`}>{article}</Link>
          </li>
        ))}
      </ul>
      <Link href="/">← カテゴリ一覧へ戻る</Link>
    </main>
  );
}
