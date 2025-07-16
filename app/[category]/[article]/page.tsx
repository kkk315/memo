import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Mermaid from '../../components/Mermaid';
import ArticleBody from '../../components/ArticleBody';
import styles from '../../styles/article.module.css';

// 記事データ取得
type ArticleData = {
  content: string;
  data: {
    title?: string;
    date?: string;
    update?: string;
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

// コードブロック用コンポーネント
type CodeProps = {
  className?: string;
  children: string;
};

type PreProps = {
  children: React.ReactNode;
};

const Code: React.FC<CodeProps> = ({ className, children }) => {
  const language = className?.replace('language-', '') || '';
  
  if (language === 'mermaid') {
    return <Mermaid>{children}</Mermaid>;
  }
  return (
    <SyntaxHighlighter 
      style={atomOneLight} 
      language={language} 
      PreTag="div"
      showLineNumbers={true}
    >
      {children}
    </SyntaxHighlighter>
  );
};

const Pre: React.FC<PreProps> = ({ children }) => {
  // code要素をチェック
  if (React.isValidElement(children) && children.type === 'code') {
    const codeProps = children.props as CodeProps;
    const className = codeProps.className || '';
    const language = className.replace('language-', '') || '';
    
    if (language === 'mermaid') {
      return <Mermaid>{codeProps.children}</Mermaid>;
    }
  }
  
  return <pre>{children}</pre>;
};

// 画像タグを静的パスに変換するコンポーネント
type ImgProps = { src: string; alt?: string; category: string; article: string };
const Img: React.FC<ImgProps> = ({ src, alt, category, article }) => {
  const isLocal = src && !src.startsWith('http') && !src.startsWith('/');
  
  let finalSrc = src;
  if (isLocal) {
    // SSG時は /content-images/ パスを使用
    finalSrc = `/content-images/${encodeURIComponent(category)}/${encodeURIComponent(article)}/${encodeURIComponent(src)}`;
  }
  
  return <img src={finalSrc} alt={alt ?? ''} />;
};

// Mermaid用コンポーネント
function getComponents(category: string, article: string): MDXRemoteProps['components'] {
  const components = {
    code: Code,
    pre: Pre,
    mermaid: Mermaid,
    img: (props: { src: string; alt?: string }) => <Img {...props} category={category} article={article} />,
  };
  return components;
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; article: string }> }) {
  const { category, article } = await params;
  const { content } = await getArticle(category, article);
  
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
  
  try {
    const { data } = await getArticle(category, article);
    const title = data.title ? `${data.title} | Tech Blog` : 'Tech Blog';
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
      title: 'Tech Blog',
      description: '技術ブログ',
    };
  }
}

// Viewport設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

