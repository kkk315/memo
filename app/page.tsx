import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

export default async function CategoryPage() {
  const contentPath = path.join(process.cwd(), 'content');
  const names = await fs.readdir(contentPath);
  const categories: string[] = [];
  for (const name of names) {
    const stat = await fs.stat(path.join(contentPath, name));
    if (stat.isDirectory()) categories.push(name);
  }

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
