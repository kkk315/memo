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
          <div className="pagination-wrapper">
            {/* 先頭ボタン */}
            {currentPage > 1 ? (
              <a href="?page=1" className="pagination-btn pagination-btn-compact">
                ⏮
              </a>
            ) : (
              <span className="pagination-btn pagination-btn-compact pagination-disabled">
                ⏮
              </span>
            )}
            
            {/* 前へボタン */}
            {currentPage > 1 ? (
              <a href={`?page=${currentPage - 1}`} className="pagination-btn pagination-btn-compact">
                ◀
              </a>
            ) : (
              <span className="pagination-btn pagination-btn-compact pagination-disabled">
                ◀
              </span>
            )}
            
            {/* ページ番号ボタン */}
            <div className="pagination-numbers">
              {Array.from({ length: htmlPages.length }, (_, i) => i + 1).map(pageNum => (
                pageNum === currentPage ? (
                  <span key={pageNum} className="pagination-btn pagination-btn-compact pagination-current-num">
                    {pageNum}
                  </span>
                ) : (
                  <a key={pageNum} href={`?page=${pageNum}`} className="pagination-btn pagination-btn-compact">
                    {pageNum}
                  </a>
                )
              ))}
            </div>
            
            {/* 次へボタン */}
            {currentPage < htmlPages.length ? (
              <a href={`?page=${currentPage + 1}`} className="pagination-btn pagination-btn-compact">
                ▶
              </a>
            ) : (
              <span className="pagination-btn pagination-btn-compact pagination-disabled">
                ▶
              </span>
            )}
            
            {/* 最後ボタン */}
            {currentPage < htmlPages.length ? (
              <a href={`?page=${htmlPages.length}`} className="pagination-btn pagination-btn-compact">
                ⏭
              </a>
            ) : (
              <span className="pagination-btn pagination-btn-compact pagination-disabled">
                ⏭
              </span>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
