"use client";
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  children: string;
}

const Mermaid: React.FC<MermaidProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ startOnLoad: true });
      // mermaidのrender関数を適切に型定義
      const renderMermaid = async () => {
        try {
          const { svg } = await mermaid.render('mermaid-graph', children);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (ref.current) {
            ref.current.innerHTML = '<p>Mermaid chart could not be rendered</p>';
          }
        }
      };
      renderMermaid();
    }
  }, [children]);

  return <div ref={ref} />;
};

export default Mermaid;
