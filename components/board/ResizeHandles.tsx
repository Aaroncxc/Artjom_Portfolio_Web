'use client';

import { useCallback, useRef } from 'react';

interface ResizeHandlesProps {
  onResize: (deltaWidth: number, deltaHeight: number, corner: string) => void;
  onResizeEnd: () => void;
}

export function ResizeHandles({ onResize, onResizeEnd }: ResizeHandlesProps) {
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentCorner = useRef('');

  const handleMouseDown = useCallback((e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    isDragging.current = true;
    currentCorner.current = corner;
    startPos.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = moveEvent.clientX - startPos.current.x;
      const deltaY = moveEvent.clientY - startPos.current.y;
      
      startPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      
      onResize(deltaX, deltaY, currentCorner.current);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      onResizeEnd();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [onResize, onResizeEnd]);

  const corners = [
    { id: 'nw', className: '-top-1.5 -left-1.5 cursor-nwse-resize' },
    { id: 'ne', className: '-top-1.5 -right-1.5 cursor-nesw-resize' },
    { id: 'sw', className: '-bottom-1.5 -left-1.5 cursor-nesw-resize' },
    { id: 'se', className: '-bottom-1.5 -right-1.5 cursor-nwse-resize' },
  ];

  return (
    <>
      {corners.map((corner) => (
        <div
          key={corner.id}
          className={`absolute w-3 h-3 bg-[#4FD1C5] rounded-full border-2 border-white shadow-md z-10 ${corner.className}`}
          onMouseDown={(e) => handleMouseDown(e, corner.id)}
        />
      ))}
    </>
  );
}
