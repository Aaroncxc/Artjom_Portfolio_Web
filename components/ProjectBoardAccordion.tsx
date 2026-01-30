'use client';

import React from 'react';

interface ProjectBoardAccordionProps {
  slug: string;
}

export function ProjectBoardAccordion({ slug }: ProjectBoardAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);

  const handleClick = () => {
    console.log('=== BOARD CLICK ===');
    console.log('Slug:', slug);
    console.log('Was open:', isOpen);
    console.log('Now will be:', !isOpen);
    setClickCount(c => c + 1);
    setIsOpen(prev => !prev);
  };

  return (
    <div className="mt-6" style={{ position: 'relative', zIndex: 5 }}>
      {/* Header Button */}
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(28, 28, 28, 0.08)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(28, 28, 28, 0.04)',
          fontFamily: 'inherit',
          fontSize: '16px',
        }}
      >
        <span style={{ color: '#1C1C1C', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📌</span>
          Board / References 
          <span style={{ fontSize: '12px', color: 'rgba(28,28,28,0.4)' }}>(clicks: {clickCount})</span>
        </span>
        <span style={{ 
          color: 'rgba(28,28,28,0.5)', 
          fontSize: '14px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>
          ▼
        </span>
      </button>

      {/* Content Panel */}
      {isOpen && (
        <div
          style={{
            marginTop: '12px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '20px',
            border: '1px solid rgba(28, 28, 28, 0.06)',
            minHeight: '280px',
            boxShadow: '0 4px 24px rgba(28, 28, 28, 0.05)',
          }}
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📎</div>
            <div style={{ color: '#1C1C1C', fontWeight: 500, fontSize: '18px', marginBottom: '8px' }}>
              Board geöffnet!
            </div>
            <div style={{ color: 'rgba(28,28,28,0.5)', fontSize: '14px' }}>
              Projekt: {slug}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
