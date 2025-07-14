import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default function CategoryArticlesPage({ params }: { params: { category: string } }) {
  const categoryPath = path.join(process.cwd(), 'content', params.category);
  const articles = fs.readdirSync(categoryPath).filter((name) => fs.lstatSync(path.join(categoryPath, name)).isDirectory());

  return (
    <main>
      <h1>{params.category} の記事一覧</h1>
      <ul>
        {articles.map((article) => (
          <li key={article}>
            <Link href={`/${params.category}/${article}`}>{article}</Link>
          </li>
        ))}
      </ul>
      <Link href="/">← カテゴリ一覧へ戻る</Link>
    </main>
  );
}
