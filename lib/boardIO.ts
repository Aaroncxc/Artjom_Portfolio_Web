import { BoardData, createEmptyBoard } from './boardTypes';

/**
 * Load board data from /public/boards/<slug>.json
 * Returns empty board if not found
 */
export async function loadBoard(slug: string): Promise<BoardData> {
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
