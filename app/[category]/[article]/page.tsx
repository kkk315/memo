import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import type { JSX } from 'react';
import Mermaid from '../../components/Mermaid';

// 記事のパスを取得（非同期化）
const getArticlePaths = async (category: string): Promise<string[]> => {
  const categoryPath = path.join(process.cwd(), 'content', category);
  const names = await fs.readdir(categoryPath);
  const dirs: string[] = [];
  for (const name of names) {
    const stat = await fs.stat(path.join(categoryPath, name));
    if (stat.isDirectory()) dirs.push(name);
  }
  return dirs;
};

// 記事データ取得
type ArticleData = {
  content: string;
  data: Record<string, any>;
};

const getArticle = async (category: string, article: string): Promise<ArticleData> => {
  const articlePath = path.join(process.cwd(), 'content', category, article, 'index.md');
  const file = await fs.readFile(articlePath, 'utf8');
  const { content, data } = matter(file);
  return { content, data };
};

// コードブロック用コンポーネント
type CodeProps = {
  className?: string;
  children: string;
};
const Code: React.FC<CodeProps> = ({ className, children }) => {
  const language = className?.replace('language-', '') || '';
  if (language === 'mermaid') {
    return <Mermaid>{children}</Mermaid>;
  }
  return (
    <SyntaxHighlighter style={atomOneDark} language={language} PreTag="div">
      {children}
    </SyntaxHighlighter>
  );
};

// 画像タグをAPI経由に変換するコンポーネント
type ImgProps = { src: string; alt?: string; category: string; article: string };
const Img: React.FC<ImgProps> = ({ src, alt, category, article }) => {
  const isLocal = src && !src.startsWith('http') && !src.startsWith('/');
  const apiSrc = isLocal
    ? `/api/image?category=${encodeURIComponent(category)}&article=${encodeURIComponent(article)}&name=${encodeURIComponent(src)}`
    : src;
  return <img src={apiSrc} alt={alt ?? ''} />;
};

// Mermaid用コンポーネント
function getComponents(category: string, article: string): MDXRemoteProps['components'] {
  return {
    code: Code,
    mermaid: Mermaid,
    img: (props: { src: string; alt?: string }) => <Img {...props} category={category} article={article} />,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; article: string }> }) {
  const { category, article } = await params;
  const { content, data } = await getArticle(category, article);
  // 日付を文字列として表示
  // 日付をyyyy/mm/dd形式で表示
  function formatDate(str?: string) {
    if (!str) return '不明';
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  }
  const created = formatDate(data.date);
  const updated = formatDate(data.update ?? data.date);
  return (
    <article>
      <div className="article-meta">
        <div className="article-date">投稿日: {created}</div>
        <div className="article-updated">編集日: {updated}</div>
      </div>
      <MDXRemote source={content} components={getComponents(category, article)} />
    </article>
  );
}
// SSG用: generateStaticParams
export async function generateStaticParams() {
  const contentPath = path.join(process.cwd(), 'content');
  const categories = await fs.readdir(contentPath);
  const params: { params: { category: string; article: string } }[] = [];
  for (const category of categories) {
    const categoryPath = path.join(contentPath, category);
    const stat = await fs.stat(categoryPath);
    if (!stat.isDirectory()) continue;
    const articles = await fs.readdir(categoryPath);
    for (const article of articles) {
      const articlePath = path.join(categoryPath, article);
      const statA = await fs.stat(articlePath);
      if (!statA.isDirectory()) continue;
      params.push({ params: { category, article } });
    }
  }
  return [
    { params: { category: 'sample-category', article: 'sample-article' } }
  ];
}

