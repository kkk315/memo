import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default function CategoryPage() {
  const contentPath = path.join(process.cwd(), 'content');
  const categories = fs.readdirSync(contentPath).filter((name) => fs.lstatSync(path.join(contentPath, name)).isDirectory());

  return (
    <main>
      <h1>カテゴリ一覧</h1>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link href={`/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
