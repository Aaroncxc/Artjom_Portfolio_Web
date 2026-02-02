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
  ImageCrop,
} from '@/lib/boardTypes';
import { loadBoard, saveBoard, exportBoard, importBoard, fileToDataUrl, getImageDimensions, fitImageDimensions } from '@/lib/boardIO';
import { BoardItem } from './BoardItem';

interface BoardCanvasProps {
  slug: string;
  isEditMode: boolean;
}

export function BoardCanvas({ slug, isEditMode }: BoardCanvasProps) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainerElement(node);
  }, []);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [board, setBoard] = useState<BoardData>(() => createEmptyBoard(slug));
  const [viewState, setViewState] = useState<BoardViewState>(DEFAULT_VIEW_STATE);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cropModeItemId, setCropModeItemId] = useState<string | null>(null);
  const [textEditItemId, setTextEditItemId] = useState<string | null>(null);
  
  const isPanning = useRef(false);
  const isSpaceDown = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoading(true);
    loadBoard(slug).then((data) => {
      setBoard(data);
      setIsLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (!hasUnsavedChanges || isLoading) return;
    
    const timeout = setTimeout(() => {
      const updatedBoard = { ...board, lastModified: new Date().toISOString() };
      saveBoard(updatedBoard);
      setHasUnsavedChanges(false);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [board, hasUnsavedChanges, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        isSpaceDown.current = true;
        if (containerElement) containerElement.style.cursor = 'grab';
      }
      
      if (e.code === 'Escape') {
        if (textEditItemId) {
          setTextEditItemId(null);
        } else if (cropModeItemId) {
          setCropModeItemId(null);
        } else {
          setSelectedItemId(null);
        }
      }
      
      // Don't delete when editing text
      if (isEditMode && selectedItemId && !cropModeItemId && !textEditItemId && (e.code === 'Delete' || e.code === 'Backspace')) {
        deleteSelectedItem();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpaceDown.current = false;
        if (containerElement) {
          containerElement.style.cursor = isEditMode ? 'default' : 'grab';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEditMode, selectedItemId, cropModeItemId, textEditItemId, containerElement]);

  // Use ref to always have latest viewState in wheel handler
  const viewStateRef = useRef(viewState);
  useEffect(() => {
    viewStateRef.current = viewState;
  }, [viewState]);

  // Wheel zoom handler - uses containerElement state to ensure it runs when container is ready
  useEffect(() => {
    if (!containerElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = containerElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentView = viewStateRef.current;
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(ZOOM_BOUNDS.max, Math.max(ZOOM_BOUNDS.min, currentView.zoom * (1 + delta)));
      const zoomRatio = newZoom / currentView.zoom;

      setViewState({
        zoom: newZoom,
        panX: mouseX - (mouseX - currentView.panX) * zoomRatio,
        panY: mouseY - (mouseY - currentView.panY) * zoomRatio,
      });
    };

    containerElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => containerElement.removeEventListener('wheel', handleWheel);
  }, [containerElement]); // Re-run when container element is set

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const shouldPan = isSpaceDown.current || e.button === 1 || (!isEditMode && e.button === 0);
    
    if (shouldPan) {
      e.preventDefault();
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOffset.current = { x: viewState.panX, y: viewState.panY };
      if (containerElement) containerElement.style.cursor = 'grabbing';
    }
    
    if (isEditMode && e.target === canvasRef.current) {
      setSelectedItemId(null);
    }
  }, [isEditMode, viewState.panX, viewState.panY, containerElement]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setViewState(prev => ({
      ...prev,
      panX: panOffset.current.x + (e.clientX - panStart.current.x),
      panY: panOffset.current.y + (e.clientY - panStart.current.y),
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    if (containerElement) {
      containerElement.style.cursor = isSpaceDown.current ? 'grab' : (isEditMode ? 'default' : 'grab');
    }
  }, [isEditMode, containerElement]);

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
    if (!containerElement || files.length === 0) return;

    const rect = containerElement.getBoundingClientRect();
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
        
        let itemWidth: number;
        let itemHeight: number;
        let naturalWidth: number | undefined;
        let naturalHeight: number | undefined;
        
        if (type === 'image') {
          const dimensions = await getImageDimensions(dataUrl);
          naturalWidth = dimensions.width;
          naturalHeight = dimensions.height;
          const fitted = fitImageDimensions(naturalWidth, naturalHeight, 400, 400);
          itemWidth = fitted.width;
          itemHeight = fitted.height;
        } else {
          const size = DEFAULT_ITEM_SIZES[type];
          itemWidth = size.width;
          itemHeight = size.height;
        }
        
        const newItem: BoardItemType = {
          id: generateItemId(),
          type,
          src: dataUrl,
          fileName: file.name,
          x: dropX + i * 20,
          y: dropY + i * 20,
          width: itemWidth,
          height: itemHeight,
          zIndex: maxZIndex + 1 + i,
          ...(type === 'image' && {
            naturalWidth,
            naturalHeight,
            borderRadius: 0,
            aspectRatioLocked: true,
          }),
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
  }, [isEditMode, viewState, board.items, containerElement]);

  const handleItemMove = useCallback((itemId: string, deltaX: number, deltaY: number) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, x: item.x + deltaX, y: item.y + deltaY } : item
      ),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleItemResize = useCallback((itemId: string, deltaWidth: number, deltaHeight: number, corner: string) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== itemId) return item;
        
        let newX = item.x, newY = item.y, newWidth = item.width, newHeight = item.height;
        
        const aspectRatio = item.naturalWidth && item.naturalHeight 
          ? item.naturalWidth / item.naturalHeight 
          : item.width / item.height;
        const shouldLockRatio = item.aspectRatioLocked && item.type === 'image';
        
        if (shouldLockRatio && ['nw', 'ne', 'sw', 'se'].includes(corner)) {
          const absDeltaW = Math.abs(deltaWidth);
          const absDeltaH = Math.abs(deltaHeight);
          
          if (absDeltaW > absDeltaH) {
            if (corner.includes('e')) {
              newWidth = Math.max(50, item.width + deltaWidth);
            } else {
              const widthChange = Math.min(deltaWidth, item.width - 50);
              newWidth = item.width - widthChange;
              newX = item.x + widthChange;
            }
            newHeight = newWidth / aspectRatio;
          } else {
            if (corner.includes('s')) {
              newHeight = Math.max(50, item.height + deltaHeight);
            } else {
              const heightChange = Math.min(deltaHeight, item.height - 50);
              newHeight = item.height - heightChange;
              newY = item.y + heightChange;
            }
            newWidth = newHeight * aspectRatio;
          }
          
          if (corner === 'nw') {
            newX = item.x + item.width - newWidth;
            newY = item.y + item.height - newHeight;
          } else if (corner === 'ne') {
            newY = item.y + item.height - newHeight;
          } else if (corner === 'sw') {
            newX = item.x + item.width - newWidth;
          }
        } else {
          if (corner.includes('e')) newWidth = Math.max(50, item.width + deltaWidth);
          if (corner.includes('w')) {
            const widthChange = Math.min(deltaWidth, item.width - 50);
            newWidth = item.width - widthChange;
            newX = item.x + widthChange;
          }
          if (corner.includes('s')) newHeight = Math.max(50, item.height + deltaHeight);
          if (corner.includes('n')) {
            const heightChange = Math.min(deltaHeight, item.height - 50);
            newHeight = item.height - heightChange;
            newY = item.y + heightChange;
          }
        }
        
        return { ...item, x: newX, y: newY, width: Math.max(50, newWidth), height: Math.max(50, newHeight) };
      }),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleBorderRadiusChange = useCallback((itemId: string, radius: number) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, borderRadius: radius } : item),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleCropChange = useCallback((itemId: string, crop: ImageCrop) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, crop } : item),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const enterCropMode = useCallback((itemId: string) => {
    const item = board.items.find(i => i.id === itemId);
    if (item?.type === 'image') {
      setCropModeItemId(itemId);
      setSelectedItemId(itemId);
    }
  }, [board.items]);

  const exitCropMode = useCallback(() => {
    setCropModeItemId(null);
  }, []);

  // Handle double-click on items (crop for images, edit for text)
  const handleItemDoubleClick = useCallback((itemId: string) => {
    const item = board.items.find(i => i.id === itemId);
    if (!item) return;
    
    if (item.type === 'image') {
      setCropModeItemId(itemId);
      setSelectedItemId(itemId);
    } else if (item.type === 'text') {
      setTextEditItemId(itemId);
      setSelectedItemId(itemId);
    }
  }, [board.items]);

  const handleTextChange = useCallback((itemId: string, text: string) => {
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, text } : item),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const exitTextEditMode = useCallback(() => {
    setTextEditItemId(null);
  }, []);

  // Add a new text element
  const addTextElement = useCallback(() => {
    if (!containerElement) return;
    
    const rect = containerElement.getBoundingClientRect();
    const centerX = (rect.width / 2 - viewState.panX) / viewState.zoom;
    const centerY = (rect.height / 2 - viewState.panY) / viewState.zoom;
    
    const maxZIndex = board.items.reduce((max, item) => Math.max(max, item.zIndex), 0);
    const size = DEFAULT_ITEM_SIZES.text;
    
    const newItem: BoardItemType = {
      id: generateItemId(),
      type: 'text',
      src: '',
      fileName: '',
      x: centerX - size.width / 2,
      y: centerY - size.height / 2,
      width: size.width,
      height: size.height,
      zIndex: maxZIndex + 1,
      text: '',
      fontSize: 16,
      fontWeight: 'normal',
      textAlign: 'left',
      textColor: '#1c1c1c',
    };

    setBoard(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      lastModified: new Date().toISOString(),
    }));
    
    setSelectedItemId(newItem.id);
    setTextEditItemId(newItem.id);
    setHasUnsavedChanges(true);
  }, [viewState, board.items, containerElement]);

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
      items: prev.items.map(item => item.id === selectedItemId ? { ...item, zIndex: maxZIndex + 1 } : item),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId, board.items]);

  const sendToBack = useCallback(() => {
    if (!selectedItemId) return;
    const minZIndex = board.items.reduce((min, item) => Math.min(min, item.zIndex), 0);
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === selectedItemId ? { ...item, zIndex: minZIndex - 1 } : item),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId, board.items]);

  const rotateItem = useCallback(() => {
    if (!selectedItemId) return;
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== selectedItemId || item.type !== 'image') return item;
        return { ...item, rotation: ((item.rotation || 0) + 90) % 360 };
      }),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId]);

  const flipHorizontal = useCallback(() => {
    if (!selectedItemId) return;
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== selectedItemId || item.type !== 'image') return item;
        return { ...item, flipX: !item.flipX };
      }),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId]);

  const flipVertical = useCallback(() => {
    if (!selectedItemId) return;
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== selectedItemId || item.type !== 'image') return item;
        return { ...item, flipY: !item.flipY };
      }),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId]);

  const toggleAspectRatioLock = useCallback(() => {
    if (!selectedItemId) return;
    setBoard(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== selectedItemId || item.type !== 'image') return item;
        return { ...item, aspectRatioLocked: !item.aspectRatioLocked };
      }),
    }));
    setHasUnsavedChanges(true);
  }, [selectedItemId]);

  const resetView = useCallback(() => setViewState(DEFAULT_VIEW_STATE), []);

  const handleSave = useCallback(() => {
    const updatedBoard = { ...board, lastModified: new Date().toISOString() };
    saveBoard(updatedBoard);
    setBoard(updatedBoard);
    setHasUnsavedChanges(false);
  }, [board]);

  const handleExport = useCallback(() => {
    exportBoard({ ...board, lastModified: new Date().toISOString() });
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
        setBoard({ ...importedBoard, slug });
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
      <div className="w-full h-[500px] rounded-[20px] bg-[rgba(28,28,28,0.03)] border border-[rgba(28,28,28,0.08)] flex items-center justify-center">
        <div className="text-[rgba(28,28,28,0.4)] text-sm">Board wird geladen...</div>
      </div>
    );
  }

  const selectedItem = board.items.find(i => i.id === selectedItemId);

  return (
    <div className="relative">
      {/* Toolbar */}
      {isEditMode && !cropModeItemId && !textEditItemId && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Main toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-[rgba(28,28,28,0.1)] shadow-lg">
              <button onClick={handleSave} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent-cyan text-white hover:bg-[#38B2AC] transition-colors" title="Lokal speichern">Save</button>
              <button onClick={handleExport} className="px-3 py-1.5 text-xs font-medium rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.08)] transition-colors" title="Als JSON exportieren">Export</button>
              <button onClick={handleImport} className="px-3 py-1.5 text-xs font-medium rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.08)] transition-colors" title="JSON importieren">Import</button>
              <div className="w-px h-5 bg-[rgba(28,28,28,0.15)] mx-1" />
              <button onClick={addTextElement} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.08)] transition-colors" title="Text hinzufügen">📝 Text</button>
              <div className="w-px h-5 bg-[rgba(28,28,28,0.15)] mx-1" />
              <button onClick={bringToFront} disabled={!selectedItemId} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.08)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Nach vorne">↑ Vorne</button>
              <button onClick={sendToBack} disabled={!selectedItemId} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.08)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Nach hinten">↓ Hinten</button>
            <button onClick={deleteSelectedItem} disabled={!selectedItemId} className="px-2 py-1.5 text-xs rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Löschen">Löschen</button>
            <div className="w-px h-5 bg-[rgba(28,28,28,0.15)] mx-1" />
            {/* Pin Lock Button - always visible in main toolbar */}
            <button
              onClick={toggleAspectRatioLock}
              disabled={!selectedItem || selectedItem.type !== 'image'}
              className={`px-2 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                selectedItem?.type === 'image' && selectedItem.aspectRatioLocked 
                  ? 'bg-accent-cyan text-white' 
                  : 'text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.08)] disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
              title="Seitenverhältnis sperren (nur für Bilder)"
            >
              {selectedItem?.type === 'image' && selectedItem.aspectRatioLocked ? '🔒 Pin' : '🔓 Pin'}
            </button>
            <div className="w-px h-5 bg-[rgba(28,28,28,0.15)] mx-1" />
            <button onClick={resetView} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.08)] transition-colors" title="Ansicht zurücksetzen">Reset</button>
          </div>
            
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-amber-600">Speichert...</span>
              </div>
            )}
          </div>
          
          {/* Image tools toolbar - appears below main toolbar when image selected */}
          {selectedItem?.type === 'image' && (
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-50 to-cyan-50 backdrop-blur-md border border-accent-cyan/30 shadow-lg">
              <span className="text-xs font-medium text-accent-cyan mr-2">🖼️ Bild:</span>
              <button onClick={() => enterCropMode(selectedItemId!)} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-white/50 transition-colors" title="Bild zuschneiden">✂️ Zuschneiden</button>
              <button onClick={rotateItem} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-white/50 transition-colors" title="90° drehen">↻ Drehen</button>
              <button onClick={flipHorizontal} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-white/50 transition-colors" title="Horizontal spiegeln">↔ Flip H</button>
              <button onClick={flipVertical} className="px-2 py-1.5 text-xs rounded-lg text-[rgba(28,28,28,0.7)] hover:bg-white/50 transition-colors" title="Vertikal spiegeln">↕ Flip V</button>
              <div className="w-px h-5 bg-accent-cyan/30 mx-1" />
              <button
                onClick={toggleAspectRatioLock}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${selectedItem.aspectRatioLocked ? 'bg-accent-cyan text-white shadow-sm' : 'bg-white/60 text-[rgba(28,28,28,0.7)] hover:bg-white/80'}`}
                title="Seitenverhältnis sperren/entsperren"
              >
                {selectedItem.aspectRatioLocked ? '🔒 Gesperrt' : '🔓 Frei'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Crop mode toolbar */}
      {isEditMode && cropModeItemId && (
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-accent-cyan shadow-lg">
            <span className="text-xs font-medium text-accent-cyan">Zuschneidemodus</span>
            <div className="w-px h-5 bg-[rgba(28,28,28,0.15)]" />
            <span className="text-xs text-[rgba(28,28,28,0.5)]">Ziehe die Ecken • ESC zum Beenden</span>
            <button onClick={exitCropMode} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent-cyan text-white hover:bg-[#38B2AC] transition-colors">Fertig</button>
          </div>
        </div>
      )}

      {/* Text edit mode toolbar */}
      {isEditMode && textEditItemId && (
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-accent-cyan shadow-lg">
            <span className="text-xs font-medium text-accent-cyan">Textbearbeitung</span>
            <div className="w-px h-5 bg-[rgba(28,28,28,0.15)]" />
            <span className="text-xs text-[rgba(28,28,28,0.5)]">Tippe deinen Text • ESC zum Beenden</span>
            <button onClick={exitTextEditMode} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent-cyan text-white hover:bg-[#38B2AC] transition-colors">Fertig</button>
          </div>
        </div>
      )}

      {!isEditMode && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.08)] text-xs text-[rgba(28,28,28,0.5)]">
          Mausrad zum Zoomen • Ziehen zum Bewegen
        </div>
      )}

      <div className="absolute top-4 right-4 z-20 px-2 py-1 rounded-lg bg-white/80 backdrop-blur-sm border border-[rgba(28,28,28,0.08)] text-xs text-[rgba(28,28,28,0.5)] font-mono">
        {Math.round(viewState.zoom * 100)}%
      </div>

      <div
        ref={containerRef}
        className={`w-full h-[500px] rounded-[20px] overflow-hidden bg-[rgba(28,28,28,0.02)] border transition-colors ${isDragOver ? 'border-accent-cyan bg-[rgba(79,209,197,0.08)]' : 'border-[rgba(28,28,28,0.08)]'}`}
        style={{ cursor: isEditMode ? 'default' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          ref={canvasRef}
          className="relative w-full h-full"
          style={{ transform: `translate(${viewState.panX}px, ${viewState.panY}px) scale(${viewState.zoom})`, transformOrigin: '0 0' }}
        >
          <div
            className="absolute inset-[-5000px] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(28,28,28,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(28,28,28,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
          />

          {board.items.map((item) => (
            <BoardItem
              key={item.id}
              item={item}
              isSelected={item.id === selectedItemId}
              isEditMode={isEditMode}
              isCropMode={item.id === cropModeItemId}
              isTextEditMode={item.id === textEditItemId}
              zoom={viewState.zoom}
              onSelect={() => setSelectedItemId(item.id)}
              onMove={(dx, dy) => handleItemMove(item.id, dx, dy)}
              onResize={(dw, dh, corner) => handleItemResize(item.id, dw, dh, corner)}
              onMoveEnd={() => setHasUnsavedChanges(true)}
              onBorderRadiusChange={(radius) => handleBorderRadiusChange(item.id, radius)}
              onDoubleClick={() => handleItemDoubleClick(item.id)}
              onCropChange={(crop) => handleCropChange(item.id, crop)}
              onCropEnd={exitCropMode}
              onTextChange={(text) => handleTextChange(item.id, text)}
              onTextEditEnd={exitTextEditMode}
            />
          ))}
        </div>

        {isDragOver && isEditMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(79,209,197,0.08)] pointer-events-none">
            <div className="px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-dashed border-accent-cyan text-accent-cyan font-medium shadow-lg">
              Dateien hier ablegen
            </div>
          </div>
        )}

        {board.items.length === 0 && !isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-[rgba(28,28,28,0.3)]">
              <div className="text-4xl mb-2">📎</div>
              <div className="text-sm">{isEditMode ? 'Bilder, Videos oder Audio-Dateien hierher ziehen' : 'Noch keine Referenzen'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
