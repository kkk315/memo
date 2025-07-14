"use client";
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function ArticleBody({ htmlPages }: { htmlPages: React.ReactNode[] }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const pageNum = pageParam && !isNaN(Number(pageParam)) ? Math.max(1, Number(pageParam)) : 1;
  const currentPage = Math.min(pageNum, htmlPages.length);

  return (
    <>
      {htmlPages[currentPage - 1]}
      {htmlPages.length > 1 && (
        <nav className="pagination">
          {currentPage > 1 && (
            <a href={`?page=${currentPage - 1}`}>前へ</a>
          )}
          <span style={{ margin: '0 1em' }}>ページ {currentPage} / {htmlPages.length}</span>
          {currentPage < htmlPages.length && (
            <a href={`?page=${currentPage + 1}`}>次へ</a>
          )}
        </nav>
      )}
    </>
  );
}
