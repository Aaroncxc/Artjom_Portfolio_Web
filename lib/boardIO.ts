import { BoardData, createEmptyBoard } from './boardTypes';

const STORAGE_KEY_PREFIX = 'multikunst-board-';

/**
 * Get localStorage key for a board
 */
function getStorageKey(slug: string): string {
  return `${STORAGE_KEY_PREFIX}${slug}`;
}

/**
 * Load board data from localStorage first, then fallback to /public/boards/<slug>.json
 * Returns empty board if not found
 */
export async function loadBoard(slug: string): Promise<BoardData> {
  // First, try to load from localStorage
  try {
    const stored = localStorage.getItem(getStorageKey(slug));
    if (stored) {
      const data = JSON.parse(stored) as BoardData;
      console.log(`Board loaded from localStorage for ${slug}`);
      return data;
    }
  } catch (error) {
    console.warn('Failed to load board from localStorage:', error);
  }

  // Fallback to fetching from /public/boards/
  try {
    const response = await fetch(`/boards/${slug}.json`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.log(`Board not found for ${slug}, creating empty board`);
      return createEmptyBoard(slug);
    }
    
    const data = await response.json();
    return data as BoardData;
  } catch (error) {
    console.error(`Failed to load board for ${slug}:`, error);
    return createEmptyBoard(slug);
  }
}

/**
 * Save board data to localStorage
 */
export function saveBoard(board: BoardData): void {
  try {
    const key = getStorageKey(board.slug);
    localStorage.setItem(key, JSON.stringify(board));
    console.log(`Board saved to localStorage for ${board.slug}`);
  } catch (error) {
    console.error('Failed to save board to localStorage:', error);
    // localStorage might be full, try to notify user
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Speicher voll! Einige Bilder könnten nicht gespeichert werden.');
    }
  }
}

/**
 * Export board data as JSON file download
 */
export function exportBoard(board: BoardData): void {
  const dataStr = JSON.stringify(board, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${board.slug}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Import board data from a JSON file
 */
export function importBoard(file: File): Promise<BoardData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as BoardData;
        
        // Validate structure
        if (!data.version || !data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid board file structure');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse board file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Convert a dropped file to a data URL for embedding
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get natural dimensions of an image from a data URL
 */
export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Calculate display dimensions while preserving aspect ratio
 * Fits the image within maxWidth/maxHeight bounds
 */
export function fitImageDimensions(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number = 400,
  maxHeight: number = 400
): { width: number; height: number } {
  const aspectRatio = naturalWidth / naturalHeight;
  
  let width = naturalWidth;
  let height = naturalHeight;
  
  // Scale down if larger than max bounds
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  // Ensure minimum size
  if (width < 50) {
    width = 50;
    height = width / aspectRatio;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
}
