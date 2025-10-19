import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'QlipMemoDB';
const STORE_NAME = 'audioStore';
const DB_VERSION = 1;

// IndexedDB initialization
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export function useIndexedDB() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Audio loading on mounting
  useEffect(() => {
    loadAudio();
  }, []);

  // Saving audio to IndexedDB
  const saveAudio = useCallback(async (blob: Blob) => {
    try {
      setIsLoading(true);
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await store.put(blob, 'currentAudio');
      
      // Creating URL for immediate playback
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving audio to IndexedDB:', error);
      setIsLoading(false);
    }
  }, []);

  // Loading audio from IndexedDB
  const loadAudio = useCallback(async () => {
    try {
      setIsLoading(true);
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get('currentAudio');
      
      return new Promise<void>((resolve) => {
        request.onsuccess = () => {
          const blob = request.result as Blob | undefined;
          if (blob) {
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
          }
          setIsLoading(false);
          resolve();
        };
        
        request.onerror = () => {
          console.error('Error loading audio from IndexedDB');
          setIsLoading(false);
          resolve();
        };
      });
    } catch (error) {
      console.error('Error accessing IndexedDB:', error);
      setIsLoading(false);
    }
  }, []);

  // Deleting audio from IndexedDB
  const clearAudio = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      await store.delete('currentAudio');
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
    } catch (error) {
      console.error('Error clearing audio from IndexedDB:', error);
    }
  }, [audioUrl]);

  return {
    audioUrl,
    saveAudio,
    loadAudio,
    clearAudio,
    isLoading,
  };
}
