import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import { siteConfig } from '../../../lib/site-config';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Mermaid from '../../components/Mermaid';
import ArticleBody from '../../components/ArticleBody';
import styles from '../../styles/article.module.css';

// 1. 新しいPreコンポーネントを定義
const Pre: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (React.isValidElement(children) && children.type === 'code') {
    const { className, children: code } = children.props as { className?: string; children: string };
    const language = className?.replace('language-', '') || 'plaintext';

    if (language === 'mermaid') {
      return <Mermaid>{String(code)}</Mermaid>;
    }

    return (
      <SyntaxHighlighter
        style={atomOneLight}
        language={language}
        PreTag="pre"
        showLineNumbers={false}
      >
        {String(code).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  }
  return <pre>{children}</pre>;
};

// 記事データ取得
type ArticleData = {
  content: string;
  data: {
    date?: string;
    update?: string;
    description?: string;
    [key: string]: unknown;
  };
};

const getArticle = async (category: string, article: string): Promise<ArticleData> => {
  const articlePath = path.join(
    process.cwd(),
    'content',
    decodeURIComponent(category),
    decodeURIComponent(article),
    'index.md'
  );
  const file = await fs.readFile(articlePath, 'utf8');
  const { content, data } = matter(file);
  return { content, data };
};

// 画像タグを静的パスに変換するコンポーネント
type ImgProps = { src: string; alt?: string; category: string; article: string };
const Img: React.FC<ImgProps> = ({ src, alt, category, article }) => {
  const isLocal = src && !src.startsWith('http') && !src.startsWith('/');

  let finalSrc = src;
  if (isLocal) {
    // パラメータをデコードしてから使用
    const decodedCategory = decodeURIComponent(category);
    const decodedArticle = decodeURIComponent(article);
    // SSG時は /content-images/ パスを使用
    finalSrc = `/content-images/${encodeURIComponent(
      decodedCategory
    )}/${encodeURIComponent(decodedArticle)}/${encodeURIComponent(src)}`;
  }

  return <img src={finalSrc} alt={alt ?? ''} />;
};

// Mermaid用コンポーネント
function getComponents(
  category: string,
  article: string
): MDXRemoteProps['components'] {
  // 2. コンポーネントマッピングを修正
  const components = {
    pre: Pre, // preのみマッピング
    mermaid: Mermaid,
    img: (props: { src: string; alt?: string }) => <Img {...props} category={category} article={article} />,
  };
  return components;
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; article: string }> }) {
  const { category, article } = await params;
  const { content, data } = await getArticle(category, article);
  const articleTitle = decodeURIComponent(article);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      // 'yyyy/MM/dd' 形式でフォーマット
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } catch (e) {
      console.error('Invalid date format:', dateString, e);
      return null;
    }
  };

  const publishedDate = formatDate(data.date);
  const updatedDate = formatDate(data.update);

  // [---]で分割し、各ページをMDXRemoteでHTML化（keyを付与）
  const pages = content.split('[---]');
  const htmlPages: React.ReactNode[] = [];
  for (let idx = 0; idx < pages.length; idx++) {
    const mdx = await MDXRemote({ source: pages[idx], components: getComponents(category, article) });
    htmlPages.push(<React.Fragment key={idx}>{mdx}</React.Fragment>);
  }
  return (
    <main className={styles.main}>
      <article>
        {/* 記事コンテンツ */}
        <div className={styles.articleContent}>
          <h1>{articleTitle}</h1>
          <div className={styles.articleMeta}>
            {publishedDate && <span>投稿日: {publishedDate}</span>}
            {updatedDate && <span>更新日: {updatedDate}</span>}
          </div>
          <Suspense fallback={<div className="loading-spinner">🔄 記事を読み込んでいます...</div>}>
            <ArticleBody htmlPages={htmlPages} />
          </Suspense>
        </div>
      </article>
    </main>
  );
}
// SSG用: generateStaticParams
export async function generateStaticParams() {
  const contentPath = path.join(process.cwd(), 'content');
  const categories = await fs.readdir(contentPath);
  const params: { category: string; article: string }[] = [];
  for (const category of categories) {
    const categoryPath = path.join(contentPath, category);
    const stat = await fs.stat(categoryPath);
    if (!stat.isDirectory()) continue;
    const articles = await fs.readdir(categoryPath);
    for (const article of articles) {
      const articlePath = path.join(categoryPath, article);
      const statA = await fs.stat(articlePath);
      if (!statA.isDirectory()) continue;
      params.push({ category, article });
    }
  }
  return params;
}

// メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; article: string }>;
}): Promise<Metadata> {
  const { category, article } = await params;
  const articleTitle = decodeURIComponent(article);

  try {
    const { data } = await getArticle(category, article);
    const title = `${articleTitle} | ${siteConfig.title}`;
    const description = (data.description as string) || `${decodeURIComponent(category)}カテゴリの技術記事`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: data.date as string,
        modifiedTime: (data.update as string) || (data.date as string),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }
}

// Viewport設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

