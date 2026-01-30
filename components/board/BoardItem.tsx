'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { BoardItem as BoardItemType } from '@/lib/boardTypes';
import { ResizeHandles } from './ResizeHandles';

interface BoardItemProps {
  item: BoardItemType;
  isSelected: boolean;
  isEditMode: boolean;
  zoom: number;
  onSelect: () => void;
  onMove: (deltaX: number, deltaY: number) => void;
  onResize: (deltaWidth: number, deltaHeight: number, corner: string) => void;
  onMoveEnd: () => void;
}

export function BoardItem({
  item,
  isSelected,
  isEditMode,
  zoom,
  onSelect,
  onMove,
  onResize,
  onMoveEnd,
}: BoardItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    e.stopPropagation();
    onSelect();
    
    // Only start drag on left click
    if (e.button !== 0) return;
    
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = (moveEvent.clientX - startPos.current.x) / zoom;
      const deltaY = (moveEvent.clientY - startPos.current.y) / zoom;
      
      startPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      onMove(deltaX, deltaY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      onMoveEnd();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isEditMode, zoom, onSelect, onMove, onMoveEnd]);

  const handleResize = useCallback((deltaWidth: number, deltaHeight: number, corner: string) => {
    onResize(deltaWidth / zoom, deltaHeight / zoom, corner);
  }, [zoom, onResize]);

  const transitionStyle = prefersReducedMotion ? 'none' : undefined;

  const renderContent = () => {
    switch (item.type) {
      case 'image':
        return (
          <img
            src={item.src}
            alt={item.fileName}
            className="w-full h-full object-cover rounded-lg pointer-events-none select-none"
            draggable={false}
          />
        );

      case 'video':
        return (
          <video
            src={item.src}
            controls
            className="w-full h-full object-contain rounded-lg bg-black"
            style={{ pointerEvents: isEditMode && isSelected ? 'none' : 'auto' }}
          />
        );

      case 'audio':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.2)]">
            <div className="text-xs text-[rgba(255,255,255,0.7)] mb-2 truncate w-full text-center">
              {item.fileName}
            </div>
            <audio
              src={item.src}
              controls
              className="w-full h-8"
              style={{ pointerEvents: isEditMode && isSelected ? 'none' : 'auto' }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={itemRef}
      className={`absolute select-none ${isEditMode ? 'cursor-move' : ''}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex,
        transition: transitionStyle,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (!isEditMode) return;
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Selection border */}
      {isSelected && isEditMode && (
        <div className="absolute inset-0 border-2 border-[#4FD1C5] rounded-lg pointer-events-none shadow-[0_0_0_1px_rgba(79,209,197,0.3)]" />
      )}

      {/* Content */}
      <div className="w-full h-full overflow-hidden rounded-lg shadow-lg">
        {renderContent()}
      </div>

      {/* Resize handles (edit mode + selected + not audio) */}
      {isEditMode && isSelected && item.type !== 'audio' && (
        <ResizeHandles
          onResize={handleResize}
          onResizeEnd={onMoveEnd}
        />
      )}
    </div>
  );
}
