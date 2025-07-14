import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import type { JSX } from 'react';
import Mermaid from '../../components/Mermaid';

// 記事のパスを取得
const getArticlePaths = (category: string): string[] => {
  const categoryPath = path.join(process.cwd(), 'content', category);
  return fs.readdirSync(categoryPath).filter((name) => fs.lstatSync(path.join(categoryPath, name)).isDirectory());
};

// 記事データ取得
type ArticleData = {
  content: string;
  data: Record<string, any>;
};
const getArticle = (category: string, article: string): ArticleData => {
  const articlePath = path.join(process.cwd(), 'content', category, article, 'index.md');
  const file = fs.readFileSync(articlePath, 'utf8');
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

// Mermaid用コンポーネント
const components: MDXRemoteProps['components'] = {
  code: Code,
  mermaid: Mermaid,
};

export type PageProps = {
  params: {
    category: string;
    article: string;
  };
};

const ArticlePage = async ({ params }: PageProps): Promise<JSX.Element> => {
  const { content, data } = getArticle(params.category, params.article);
  return (
    <article>
      <h1>{data.title}</h1>
      <MDXRemote source={content} components={components} />
    </article>
  );
};

export default ArticlePage;
