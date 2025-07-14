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
      // 型アサーションで型エラーを回避
      (mermaid.render as any)('mermaid-graph', children).then((res: { svg: string }) => {
        if (ref.current) ref.current.innerHTML = res.svg;
      });
    }
  }, [children]);

  return <div ref={ref} />;
};

export default Mermaid;
