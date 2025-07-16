'use client';

import React from 'react';
import { createPortal } from 'react-dom';

type ImageModalProps = { 
  src: string; 
  alt?: string; 
  category: string; 
  article: string; 
};

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, category, article }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const isLocal = src && !src.startsWith('http') && !src.startsWith('/');

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isModalOpen]);

  const modalContent = isModalOpen && mounted ? (
    <div
      onClick={handleModalClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        cursor: 'pointer'
      }}
    >
      <img
        src={finalSrc}
        alt={alt ?? ''}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px',
          cursor: 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={() => setIsModalOpen(false)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ×
      </button>
    </div>
  ) : null;

  return (
    <>
      <img 
        src={finalSrc} 
        alt={alt ?? ''} 
        onClick={handleImageClick}
        style={{
          maxWidth: '100%',
          height: 'auto',
          cursor: 'pointer',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
      />
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};

export default ImageModal;
