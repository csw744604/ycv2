import { AppData } from '../types';
import { DEFAULT_DATA } from '../constants';

const STORAGE_KEY = 'youcai_edu_data';

// Simulate reading the JSON file
export const getAppData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsedData = JSON.parse(stored);
      
      // Data Migration: Ensure home.imageUrls exists
      if (parsedData.home && !parsedData.home.imageUrls) {
        if (parsedData.home.imageUrl) {
          parsedData.home.imageUrls = [parsedData.home.imageUrl];
          delete parsedData.home.imageUrl; // Cleanup old field
        } else {
          parsedData.home.imageUrls = DEFAULT_DATA.home.imageUrls;
        }
      }

      return parsedData;
    } catch (e) {
      console.error("Failed to parse data, resetting to default", e);
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
};

// Simulate writing to the JSON file
export const saveAppData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch a custom event so other components can react if needed (simple reactivity)
  window.dispatchEvent(new Event('dataUpdated'));
};

// Helper for file to Base64 (since we don't have a backend upload)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const resetToDefaults = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};