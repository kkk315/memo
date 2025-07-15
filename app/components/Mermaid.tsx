"use client";
import React, { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  children: string;
}

const Mermaid: React.FC<MermaidProps> = ({ children }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initMermaid = async () => {
      if (!elementRef.current || !mounted) return;

      try {
        elementRef.current.innerHTML = '';
        
        const mermaid = (await import('mermaid')).default;
        const id = `mermaid-${Date.now()}`;

        // Mermaidを初期化（一度だけ）
        if (!isInitialized) {
          mermaid.initialize({
            startOnLoad: false
          });
          setIsInitialized(true);
        }

        const cleanedContent = children.trim();
        if (!cleanedContent) {
          throw new Error('Empty content');
        }

        const { svg, bindFunctions } = await mermaid.render(id, cleanedContent);

        if (elementRef.current && mounted) {
          elementRef.current.innerHTML = svg;
          
          if (bindFunctions) {
            bindFunctions(elementRef.current);
          }
          
          setError(null);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error';
        setError(errorMessage);

        if (elementRef.current && mounted) {
          elementRef.current.innerHTML = `
            <div style="
              border: 2px dashed #ff6b6b;
              padding: 20px;
              border-radius: 8px;
              background: #ffe0e0;
              color: #d63031;
              text-align: center;
            ">
              <h4>Error</h4>
              <p>${errorMessage}</p>
            </div>
          `;
        }
      }
    };

    initMermaid();

    return () => {
      mounted = false;
    };
  }, [children, isInitialized]);

  return (
    <div className="mermaid-container">
      <div
        ref={elementRef}
        style={{
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        {!error && (
          <div style={{ color: '#6c757d', fontSize: '14px' }}>
            � Loading Mermaid chart...
          </div>
        )}
      </div>
    </div>
  );
};

export default Mermaid;
