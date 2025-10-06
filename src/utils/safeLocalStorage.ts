/**
 * Safe localStorage utilities with error handling and timeout protection
 */

export const safeLocalStorage = {
  /**
   * Safely get data from localStorage with error handling
   */
  getItem: (key: string): string | null => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage not available');
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  /**
   * Safely set data to localStorage with error handling
   */
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage not available');
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Safely remove data from localStorage
   */
  removeItem: (key: string): boolean => {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage not available');
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Safely parse JSON from localStorage
   */
  getJSON: <T = any>(key: string): T | null => {
    try {
      const data = safeLocalStorage.getItem(key);
      if (!data || data.trim() === '') {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage (${key}):`, error);
      // Clear corrupted data
      safeLocalStorage.removeItem(key);
      return null;
    }
  },

  /**
   * Safely stringify and save JSON to localStorage
   */
  setJSON: <T = any>(key: string, value: T): boolean => {
    try {
      const serialized = JSON.stringify(value);
      return safeLocalStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage (${key}):`, error);
      return false;
    }
  }
};

/**
 * Create a debounced function to prevent excessive localStorage writes
 */
export function createDebouncedSave<T>(
  key: string, 
  delay: number = 300
): (value: T) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (value: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      safeLocalStorage.setJSON(key, value);
    }, delay);
  };
}