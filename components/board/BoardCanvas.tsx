'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  BoardData,
  BoardItem as BoardItemType,
  BoardViewState,
  DEFAULT_VIEW_STATE,
  ZOOM_BOUNDS,
  DEFAULT_ITEM_SIZES,
  generateItemId,
  getFileType,
  createEmptyBoard,
} from '@/lib/boardTypes';
import { loadBoard, exportBoard, importBoard, fileToDataUrl } from '@/lib/boardIO';
import { BoardItem } from './BoardItem';

interface BoardCanvasProps {
  slug: string;
  isEditMode: boolean;
}

export function BoardCanvas({ slug, isEditMode }: BoardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [board, setBoard] = useState<BoardData>(() => createEmptyBoard(slug));
  const [viewState, setViewState] = useState<BoardViewState>(DEFAULT_VIEW_STATE);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Pan state
  const isPanning = useRef(false);
  const isSpaceDown = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });

  // Load board on mount
  useEffect(() => {
    setIsLoading(true);
    loadBoard(slug).then((data) => {
      setBoard(data);
      setIsLoading(false);
    });
  }, [slug]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        isSpaceDown.current = true;
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
        }
      }
      
      if (e.code === 'Escape') {
        setSelectedItemId(null);
      }
      
      // Delete selected item
      if (isEditMode && selectedItemId && (e.code === 'Delete' || e.code === 'Backspace')) {
        deleteSelectedItem();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpaceDown.current = false;
        if (containerRef.current) {
          containerRef.current.style.cursor = isEditMode ? 'default' : 'grab';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEditMode, selectedItemId]);

  // Wheel zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom factor
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.min(ZOOM_BOUNDS.max, Math.max(ZOOM_BOUNDS.min, viewState.zoom * (1 + delta)));
    const zoomRatio = newZoom / viewState.zoom;

    // Adjust pan to zoom toward mouse position
    const newPanX = mouseX - (mouseX - viewState.panX) * zoomRatio;
    const newPanY = mouseY - (mouseY - viewState.panY) * zoomRatio;

    setViewState({
      zoom: newZoom,
      panX: newPanX,
      panY: newPanY,
    });
  }, [viewState]);

  // Attach wheel listener with passive: false
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Start pan on space+left click, middle click, or left click in view mode
    const shouldPan = isSpaceDown.current || e.button === 1 || (!isEditMode && e.button === 0);
    
    if (shouldPan) {
      e.preventDefault();
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOffset.current = { x: viewState.panX, y: viewState.panY };
      
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
    }
    
    // Deselect when clicking canvas background
    if (isEditMode && e.target === canvasRef.current) {
      setSelectedItemId(null);
    }
  }, [isEditMode, viewState.panX, viewState.panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    
    const deltaX = e.clientX - panStart.current.x;
    const deltaY = e.clientY - panStart.current.y;
    
    setViewState(prev => ({
      ...prev,
      panX: panOffset.current.x + deltaX,
      panY: panOffset.current.y + deltaY,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = isSpaceDown.current ? 'grab' : (isEditMode ? 'default' : 'grab');
    }
  }, [isEditMode]);

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, [isEditMode]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const container = containerRef.current;
    if (!container || files.length === 0) return;

    const rect = container.getBoundingClientRect();
    const dropX = (e.clientX - rect.left - viewState.panX) / viewState.zoom;
    const dropY = (e.clientY - rect.top - viewState.panY) / viewState.zoom;

    const maxZIndex = board.items.reduce((max, item) => Math.max(max, item.zIndex), 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const type = getFileType(file.name);
      
      if (!type) {
        console.warn(`Unsupported file type: ${file.name}`);
        continue;
      }

      try {
        const dataUrl = await fileToDataUrl(file);
        const size = DEFAULT_ITEM_SIZES[type];
        
        const newItem: BoardItemType = {
          id: generateItemId(),
          type,
          src: dataUrl,
          fileName: file.name,
          x: dropX + i * 20,
          y: dropY + i * 20,
          width: size.width,
          height: size.height,
          zIndex: maxZIndex + 1 + i,
        };

        setBoard(prev => ({
          ...prev,
          items: [...prev.items, newItem],
          lastModified: new Date().toISOString(),
        }));
        
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error(`Failed to process file: ${file.name}`, error);
      }
    }
  }, [isEditMode, viewState, board.items]);

  // Item manipulation
  const handleItemMove = useCallback((itemId: string, deltaX: number, deltaY: number) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, x: item.x + deltaX, y: item.y + deltaY }
          : item
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleItemResize = useCallback((itemId: string, deltaWidth: number, deltaHeight: number, corner: string) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== itemId) return item;
        
        let newX = item.x;
        let newY = item.y;
        let newWidth = item.width;
        let newHeight = item.height;
        
        // Handle resize based on corner
        if (corner.includes('e')) {
          newWidth = Math.max(50, item.width + deltaWidth);
        }
        if (corner.includes('w')) {
          const widthChange = Math.min(deltaWidth, item.width - 50);
          newWidth = item.width - widthChange;
          newX = item.x + widthChange;
        }
        if (corner.includes('s')) {
          newHeight = Math.max(50, item.height + deltaHeight);
        }
        if (corner.includes('n')) {
          const heightChange = Math.min(deltaHeight, item.height - 50);
          newHeight = item.height - heightChange;
          newY = item.y + heightChange;
        }
        
        return { ...item, x: newX, y: newY, width: newWidth, height: newHeight };
      }),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const deleteSelectedItem = useCallback(() => {
    if (!selectedItemId) return;
    
    setBoard(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== selectedItemId),
      lastModified: new Date().toISOString(),
    }));
    setSelectedItemId(null);
    setHasUnsavedChanges(true);
  }, [selectedItemId]);

  const bringToFront = useCallback(() => {
    if (!selectedItemId) return;
    
    const maxZIndex = board.items.reduce((max, item) => Math.max(max, item.zIndex), 0);
    
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === selectedItemId
          ? { ...item, zIndex: maxZIndex + 1 }
          : item
      ),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId, board.items]);

  const sendToBack = useCallback(() => {
    if (!selectedItemId) return;
    
    const minZIndex = board.items.reduce((min, item) => Math.min(min, item.zIndex), 0);
    
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === selectedItemId
          ? { ...item, zIndex: minZIndex - 1 }
          : item
      ),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId, board.items]);

  const resetView = useCallback(() => {
    setViewState(DEFAULT_VIEW_STATE);
  }, []);

  const handleSave = useCallback(() => {
    const updatedBoard = {
      ...board,
      lastModified: new Date().toISOString(),
    };
    exportBoard(updatedBoard);
    setHasUnsavedChanges(false);
  }, [board]);

  const handleImport = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const importedBoard = await importBoard(file);
        setBoard({
          ...importedBoard,
          slug, // Keep current slug
        });
        setHasUnsavedChanges(true);
        setSelectedItemId(null);
      } catch (error) {
        console.error('Failed to import board:', error);
        alert('Failed to import board file');
      }
    };
    
    input.click();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="w-full h-[500px] rounded-[28px] bg-[rgba(255,255,255,0.06)] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] flex items-center justify-center">
        <div className="text-[rgba(255,255,255,0.5)] text-sm">Loading board...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Edit mode toolbar */}
      {isEditMode && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.1)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)]">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#4FD1C5] text-[#0B0F1A] hover:bg-[#38B2AC] transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleImport}
              className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              Import
            </button>
            <div className="w-px h-5 bg-[rgba(255,255,255,0.2)] mx-1" />
            <button
              onClick={bringToFront}
              disabled={!selectedItemId}
              className="px-2 py-1.5 text-xs rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Bring to Front"
            >
              ↑ Front
            </button>
            <button
              onClick={sendToBack}
              disabled={!selectedItemId}
              className="px-2 py-1.5 text-xs rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Send to Back"
            >
              ↓ Back
            </button>
            <button
              onClick={deleteSelectedItem}
              disabled={!selectedItemId}
              className="px-2 py-1.5 text-xs rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Delete"
            >
              Delete
            </button>
            <div className="w-px h-5 bg-[rgba(255,255,255,0.2)] mx-1" />
            <button
              onClick={resetView}
              className="px-2 py-1.5 text-xs rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              title="Reset View"
            >
              Reset
            </button>
          </div>
          
          {/* Unsaved indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[rgba(255,200,0,0.15)] border border-[rgba(255,200,0,0.3)]">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs text-yellow-300">Unsaved</span>
            </div>
          )}
        </div>
      )}

      {/* View mode hint */}
      {!isEditMode && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.08)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] text-xs text-[rgba(255,255,255,0.5)]">
          Pan/Zoom enabled
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute top-4 right-4 z-20 px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.08)] backdrop-blur-sm text-xs text-[rgba(255,255,255,0.5)] font-mono">
        {Math.round(viewState.zoom * 100)}%
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className={`w-full h-[500px] rounded-[28px] overflow-hidden bg-[rgba(255,255,255,0.06)] backdrop-blur-xl border transition-colors ${
          isDragOver
            ? 'border-[#4FD1C5] bg-[rgba(79,209,197,0.1)]'
            : 'border-[rgba(255,255,255,0.12)]'
        }`}
        style={{
          cursor: isEditMode ? 'default' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Transformable canvas */}
        <div
          ref={canvasRef}
          className="relative w-full h-full"
          style={{
            transform: `translate(${viewState.panX}px, ${viewState.panY}px) scale(${viewState.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Grid pattern (subtle) */}
          <div
            className="absolute inset-[-5000px] pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Items */}
          {board.items.map((item) => (
            <BoardItem
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              isEditMode={isEditMode}
              zoom={viewState.zoom}
              onSelect={() => setSelectedItemId(item.id)}
              onMove={(dx, dy) => handleItemMove(item.id, dx, dy)}
              onResize={(dw, dh, corner) => handleItemResize(item.id, dw, dh, corner)}
              onMoveEnd={() => setHasUnsavedChanges(true)}
            />
          ))}
        </div>

        {/* Drop overlay */}
        {isDragOver && isEditMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(79,209,197,0.1)] pointer-events-none">
            <div className="px-6 py-4 rounded-2xl bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[#4FD1C5] text-[#4FD1C5]">
              Drop files here
            </div>
          </div>
        )}

        {/* Empty state */}
        {board.items.length === 0 && !isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-[rgba(255,255,255,0.3)]">
              <div className="text-4xl mb-2">📎</div>
              <div className="text-sm">
                {isEditMode ? 'Drop images, videos, or audio files here' : 'No references yet'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
