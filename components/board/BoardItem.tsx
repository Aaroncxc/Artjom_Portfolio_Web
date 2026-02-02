'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { BoardItem as BoardItemType, ImageCrop } from '@/lib/boardTypes';
import { ResizeHandles } from './ResizeHandles';

interface BoardItemProps {
  item: BoardItemType;
  isSelected: boolean;
  isEditMode: boolean;
  isCropMode: boolean;
  isTextEditMode: boolean;
  zoom: number;
  onSelect: () => void;
  onMove: (deltaX: number, deltaY: number) => void;
  onResize: (deltaWidth: number, deltaHeight: number, corner: string) => void;
  onMoveEnd: () => void;
  onBorderRadiusChange: (radius: number) => void;
  onDoubleClick: () => void;
  onCropChange: (crop: ImageCrop) => void;
  onCropEnd: () => void;
  onTextChange: (text: string) => void;
  onTextEditEnd: () => void;
}

export function BoardItem({
  item,
  isSelected,
  isEditMode,
  isCropMode,
  isTextEditMode,
  zoom,
  onSelect,
  onMove,
  onResize,
  onMoveEnd,
  onBorderRadiusChange,
  onDoubleClick,
  onCropChange,
  onCropEnd,
  onTextChange,
  onTextEditEnd,
}: BoardItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [localText, setLocalText] = useState(item.text || '');
  
  // Local state for border radius during drag
  const [localRadius, setLocalRadius] = useState(item.borderRadius || 0);
  
  // Crop state
  const [localCrop, setLocalCrop] = useState<ImageCrop>(
    item.crop || { x: 0, y: 0, width: 100, height: 100 }
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Sync local radius with item
  useEffect(() => {
    setLocalRadius(item.borderRadius || 0);
  }, [item.borderRadius]);

  // Sync and focus text when entering text edit mode
  useEffect(() => {
    if (isTextEditMode && item.type === 'text') {
      setLocalText(item.text || '');
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [isTextEditMode, item.type, item.text]);

  // Sync local crop with item when entering crop mode
  useEffect(() => {
    if (isCropMode) {
      setLocalCrop(item.crop || { x: 0, y: 0, width: 100, height: 100 });
    }
  }, [isCropMode, item.crop]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditMode || isCropMode || isTextEditMode) return;
    
    e.stopPropagation();
    onSelect();
    
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
  }, [isEditMode, isCropMode, isTextEditMode, zoom, onSelect, onMove, onMoveEnd]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;
    // Only allow double-click for images (crop) and text (edit)
    if (item.type !== 'image' && item.type !== 'text') return;
    e.stopPropagation();
    onDoubleClick();
  }, [isEditMode, item.type, onDoubleClick]);

  // Handle text blur (save on click outside)
  const handleTextBlur = useCallback(() => {
    if (item.type === 'text') {
      onTextChange(localText);
      onTextEditEnd();
    }
  }, [item.type, localText, onTextChange, onTextEditEnd]);

  // Handle text keydown (Enter to save, Escape to cancel)
  const handleTextKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setLocalText(item.text || '');
      onTextEditEnd();
    }
    // Shift+Enter for new line, Enter alone doesn't exit
  }, [item.text, onTextEditEnd]);

  const handleResize = useCallback((deltaWidth: number, deltaHeight: number, corner: string) => {
    onResize(deltaWidth / zoom, deltaHeight / zoom, corner);
  }, [zoom, onResize]);

  // Handle border radius drag - updates in real-time
  const localRadiusRef = useRef(localRadius);
  useEffect(() => {
    localRadiusRef.current = localRadius;
  }, [localRadius]);

  const handleRadiusDrag = useCallback((e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startRadius = item.borderRadius || 0;
    const maxRadius = Math.min(item.width, item.height) / 2;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Diagonal movement towards center increases radius
      const deltaX = (startX - moveEvent.clientX) / zoom;
      const deltaY = (startY - moveEvent.clientY) / zoom;
      const delta = (deltaX + deltaY) / 2;
      const newRadius = Math.max(0, Math.min(maxRadius, startRadius + delta));
      setLocalRadius(Math.round(newRadius));
    };

    const handleMouseUp = () => {
      onBorderRadiusChange(localRadiusRef.current);
      onMoveEnd();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isEditMode, zoom, item.borderRadius, item.width, item.height, onBorderRadiusChange, onMoveEnd]);

  // Crop handlers
  const localCropRef = useRef(localCrop);
  useEffect(() => {
    localCropRef.current = localCrop;
  }, [localCrop]);

  const handleCropDrag = useCallback((e: React.MouseEvent) => {
    if (!isCropMode) return;
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...localCrop };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((startX - moveEvent.clientX) / zoom / item.width) * 100;
      const deltaY = ((startY - moveEvent.clientY) / zoom / item.height) * 100;
      
      const newX = Math.max(0, Math.min(100 - startCrop.width, startCrop.x + deltaX));
      const newY = Math.max(0, Math.min(100 - startCrop.height, startCrop.y + deltaY));
      
      setLocalCrop({ ...startCrop, x: newX, y: newY });
    };

    const handleMouseUp = () => {
      onCropChange(localCropRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isCropMode, localCrop, zoom, item.width, item.height, onCropChange]);

  const handleCropResize = useCallback((corner: string) => (e: React.MouseEvent) => {
    if (!isCropMode) return;
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...localCrop };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / zoom / item.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / zoom / item.height) * 100;
      
      let newCrop = { ...startCrop };
      
      if (corner.includes('w')) {
        const newX = Math.max(0, Math.min(startCrop.x + startCrop.width - 10, startCrop.x + deltaX));
        newCrop.width = startCrop.width - (newX - startCrop.x);
        newCrop.x = newX;
      }
      if (corner.includes('e')) {
        newCrop.width = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + deltaX));
      }
      if (corner.includes('n')) {
        const newY = Math.max(0, Math.min(startCrop.y + startCrop.height - 10, startCrop.y + deltaY));
        newCrop.height = startCrop.height - (newY - startCrop.y);
        newCrop.y = newY;
      }
      if (corner.includes('s')) {
        newCrop.height = Math.max(10, Math.min(100 - startCrop.y, startCrop.height + deltaY));
      }
      
      setLocalCrop(newCrop);
    };

    const handleMouseUp = () => {
      onCropChange(localCropRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [isCropMode, localCrop, zoom, item.width, item.height, onCropChange]);

  const transitionStyle = prefersReducedMotion ? 'none' : undefined;
  const borderRadius = localRadius;

  const getImageTransform = () => {
    const transforms: string[] = [];
    if (item.rotation) {
      transforms.push(`rotate(${item.rotation}deg)`);
    }
    const scaleX = item.flipX ? -1 : 1;
    const scaleY = item.flipY ? -1 : 1;
    if (scaleX !== 1 || scaleY !== 1) {
      transforms.push(`scale(${scaleX}, ${scaleY})`);
    }
    return transforms.length > 0 ? transforms.join(' ') : undefined;
  };

  const renderContent = () => {
    switch (item.type) {
      case 'image':
        const crop = item.crop || { x: 0, y: 0, width: 100, height: 100 };
        const hasCrop = crop.x !== 0 || crop.y !== 0 || crop.width !== 100 || crop.height !== 100;
        
        // For cropped images, we scale and position
        let imageStyle: React.CSSProperties = {
          transform: getImageTransform(),
        };
        
        if (hasCrop) {
          const scaleX = 100 / crop.width;
          const scaleY = 100 / crop.height;
          const translateX = -crop.x * scaleX;
          const translateY = -crop.y * scaleY;
          
          imageStyle = {
            width: `${100 * scaleX}%`,
            height: `${100 * scaleY}%`,
            transform: `translate(${translateX}%, ${translateY}%)${getImageTransform() ? ' ' + getImageTransform() : ''}`,
            objectFit: 'cover',
          };
        }
        
        return (
          <img
            src={item.src}
            alt={item.fileName}
            className={`pointer-events-none select-none ${hasCrop ? '' : 'w-full h-full object-cover'}`}
            draggable={false}
            style={imageStyle}
          />
        );

      case 'video':
        return (
          <video
            src={item.src}
            controls
            className="w-full h-full object-contain bg-black"
            style={{ pointerEvents: isEditMode && isSelected ? 'none' : 'auto' }}
          />
        );

      case 'audio':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-white/90 backdrop-blur-md border border-[rgba(28,28,28,0.1)] shadow-sm">
            <div className="text-xs text-[rgba(28,28,28,0.6)] mb-2 truncate w-full text-center">
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

      case 'text':
        const fontWeightClass = {
          normal: 'font-normal',
          medium: 'font-medium',
          semibold: 'font-semibold',
          bold: 'font-bold',
        }[item.fontWeight || 'normal'];
        
        const textAlignClass = {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
        }[item.textAlign || 'left'];

        if (isTextEditMode) {
          return (
            <textarea
              ref={textareaRef}
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              onBlur={handleTextBlur}
              onKeyDown={handleTextKeyDown}
              className={`w-full h-full resize-none border-none outline-none bg-transparent p-2 ${fontWeightClass} ${textAlignClass}`}
              style={{
                fontSize: item.fontSize || 16,
                color: item.textColor || '#1c1c1c',
                backgroundColor: item.backgroundColor || 'transparent',
              }}
              placeholder="Text eingeben..."
            />
          );
        }

        return (
          <div
            className={`w-full h-full p-2 overflow-hidden ${fontWeightClass} ${textAlignClass}`}
            style={{
              fontSize: item.fontSize || 16,
              color: item.textColor || '#1c1c1c',
              backgroundColor: item.backgroundColor || 'transparent',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {item.text || (isEditMode ? 'Doppelklick zum Bearbeiten' : '')}
          </div>
        );

      default:
        return null;
    }
  };

  // Crop overlay
  const renderCropOverlay = () => {
    if (!isCropMode || item.type !== 'image') return null;
    
    const crop = localCrop;
    
    return (
      <div className="absolute inset-0 z-20">
        {/* Darkened areas */}
        <div className="absolute bg-black/50" style={{ top: 0, left: 0, right: 0, height: `${crop.y}%` }} />
        <div className="absolute bg-black/50" style={{ bottom: 0, left: 0, right: 0, height: `${100 - crop.y - crop.height}%` }} />
        <div className="absolute bg-black/50" style={{ top: `${crop.y}%`, left: 0, width: `${crop.x}%`, height: `${crop.height}%` }} />
        <div className="absolute bg-black/50" style={{ top: `${crop.y}%`, right: 0, width: `${100 - crop.x - crop.width}%`, height: `${crop.height}%` }} />
        
        {/* Crop area */}
        <div 
          className="absolute border-2 border-white cursor-move"
          style={{ top: `${crop.y}%`, left: `${crop.x}%`, width: `${crop.width}%`, height: `${crop.height}%` }}
          onMouseDown={handleCropDrag}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
          </div>
        </div>
        
        {/* Corner handles */}
        {['nw', 'ne', 'sw', 'se'].map(corner => {
          const top = corner.includes('n') ? crop.y : crop.y + crop.height;
          const left = corner.includes('w') ? crop.x : crop.x + crop.width;
          const cursor = corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize';
          return (
            <div
              key={corner}
              className="absolute w-3 h-3 bg-white rounded-full border-2 border-accent-cyan z-30 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${top}%`, left: `${left}%`, cursor }}
              onMouseDown={handleCropResize(corner)}
            />
          );
        })}
      </div>
    );
  };

  // Radius handle
  const renderRadiusHandle = () => {
    if (!isEditMode || !isSelected || item.type !== 'image' || isCropMode) return null;
    
    const handleOffset = Math.max(12, borderRadius);
    
    return (
      <div
        className="absolute w-4 h-4 z-20 cursor-pointer group"
        style={{ top: handleOffset, left: handleOffset }}
        onMouseDown={handleRadiusDrag}
        title={`Eckenradius: ${borderRadius}px - Ziehen zum Ändern`}
      >
        <div className="w-full h-full rounded-full bg-orange-400 border-2 border-white shadow-md hover:scale-110 transition-transform" />
      </div>
    );
  };

  return (
    <div
      ref={itemRef}
      className={`absolute select-none ${isEditMode && !isCropMode ? 'cursor-move' : ''}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: isCropMode ? 9999 : item.zIndex,
        transition: transitionStyle,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        if (!isEditMode) return;
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Selection border */}
      {isSelected && isEditMode && !isCropMode && (
        <div 
          className="absolute inset-0 border-2 border-[#4FD1C5] pointer-events-none shadow-[0_0_0_1px_rgba(79,209,197,0.3)]"
          style={{ borderRadius }}
        />
      )}
      
      {isCropMode && (
        <div className="absolute inset-0 border-2 border-accent-cyan pointer-events-none shadow-[0_0_12px_rgba(79,209,197,0.4)]" />
      )}

      {/* Content */}
      <div 
        className={`w-full h-full overflow-hidden ${item.type !== 'text' ? 'shadow-lg' : ''}`}
        style={{ borderRadius }}
      >
        {renderContent()}
      </div>

      {/* Crop overlay */}
      {renderCropOverlay()}

      {/* Radius handle */}
      {renderRadiusHandle()}

      {/* Resize handles */}
      {isEditMode && isSelected && item.type !== 'audio' && !isCropMode && (
        <ResizeHandles onResize={handleResize} onResizeEnd={onMoveEnd} />
      )}
      
      {/* Hint for images */}
      {isEditMode && isSelected && item.type === 'image' && !isCropMode && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] text-[rgba(28,28,28,0.5)] bg-white/80 rounded whitespace-nowrap">
          Doppelklick: Zuschneiden • Orange Punkt: Eckenradius ({borderRadius}px)
        </div>
      )}
      
      {/* Hint for text */}
      {isEditMode && isSelected && item.type === 'text' && !isTextEditMode && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] text-[rgba(28,28,28,0.5)] bg-white/80 rounded whitespace-nowrap">
          Doppelklick zum Bearbeiten
        </div>
      )}
    </div>
  );
}
