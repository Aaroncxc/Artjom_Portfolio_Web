export type BoardItemType = 'image' | 'video' | 'audio';

export interface BoardItem {
  id: string;
  type: BoardItemType;
  src: string;
  fileName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  // For audio, width/height are fixed card dimensions
}

export interface BoardData {
  version: 1;
  slug: string;
  items: BoardItem[];
  lastModified: string;
}

export interface BoardViewState {
  panX: number;
  panY: number;
  zoom: number;
}

export const DEFAULT_VIEW_STATE: BoardViewState = {
  panX: 0,
  panY: 0,
  zoom: 1,
};

export const ZOOM_BOUNDS = {
  min: 0.1,
  max: 5,
};

export const DEFAULT_ITEM_SIZES: Record<BoardItemType, { width: number; height: number }> = {
  image: { width: 300, height: 200 },
  video: { width: 400, height: 225 },
  audio: { width: 280, height: 80 },
};

export function createEmptyBoard(slug: string): BoardData {
  return {
    version: 1,
    slug,
    items: [],
    lastModified: new Date().toISOString(),
  };
}

export function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getFileType(fileName: string): BoardItemType | null {
  const ext = fileName.toLowerCase().split('.').pop();
  if (!ext) return null;
  
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
  
  return null;
}
