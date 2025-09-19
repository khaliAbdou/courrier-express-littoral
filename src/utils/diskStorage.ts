// Système de stockage unifié sur disque dur
// Remplace localStorage et autres systèmes de stockage web

import { fileSystemStorage } from './fileSystemStorage';

interface StorageData {
  [key: string]: any;
}

class DiskStorage {
  private readonly STORAGE_FILE = 'app-storage.json';
  private cache: StorageData = {};
  private initialized = false;

  // Initialise le stockage
  async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const data = await this.loadFromDisk();
      this.cache = data || {};
      this.initialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du stockage:', error);
      this.cache = {};
      this.initialized = true;
    }
  }

  // Charge les données depuis le disque
  private async loadFromDisk(): Promise<StorageData | null> {
    if (!fileSystemStorage.isSupported()) {
      return null;
    }

    try {
      // Utiliser le même directoryHandle que fileSystemStorage
      const directoryHandle = (fileSystemStorage as any).directoryHandle;
      if (!directoryHandle) return null;

      const fileHandle = await directoryHandle.getFileHandle(this.STORAGE_FILE);
      const file = await fileHandle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    } catch (error) {
      // Fichier n'existe pas encore, c'est normal
      return null;
    }
  }

  // Sauvegarde les données sur le disque
  private async saveToDisk(): Promise<void> {
    if (!fileSystemStorage.isSupported()) {
      console.warn('File System Access API non supporté');
      return;
    }

    try {
      const directoryHandle = (fileSystemStorage as any).directoryHandle;
      if (!directoryHandle) {
        console.warn('Aucun dossier de stockage configuré');
        return;
      }

      const fileHandle = await directoryHandle.getFileHandle(this.STORAGE_FILE, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(this.cache, null, 2));
      await writable.close();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde sur disque:', error);
    }
  }

  // API compatible avec localStorage
  async getItem(key: string): Promise<string | null> {
    await this.init();
    return this.cache[key] || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.init();
    this.cache[key] = value;
    await this.saveToDisk();
  }

  async removeItem(key: string): Promise<void> {
    await this.init();
    delete this.cache[key];
    await this.saveToDisk();
  }

  async clear(): Promise<void> {
    this.cache = {};
    await this.saveToDisk();
  }

  // Méthodes utilitaires pour objets JSON
  async getObject<T>(key: string): Promise<T | null> {
    const item = await this.getItem(key);
    if (!item) return null;
    
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  async setObject(key: string, value: any): Promise<void> {
    await this.setItem(key, JSON.stringify(value));
  }
}

export const diskStorage = new DiskStorage();

// Wrapper pour compatibilité avec l'ancien système localStorage
export const storageCompat = {
  getItem: (key: string) => diskStorage.getItem(key),
  setItem: (key: string, value: string) => diskStorage.setItem(key, value),
  removeItem: (key: string) => diskStorage.removeItem(key),
  clear: () => diskStorage.clear(),
  
  // Méthodes synchrones pour compatibilité (à éviter dans les nouveaux développements)
  getItemSync: (key: string): string | null => {
    // Fallback temporaire - à remplacer par les méthodes async
    const item = localStorage.getItem(key);
    return item;
  },
  
  setItemSync: (key: string, value: string): void => {
    // Fallback temporaire - à remplacer par les méthodes async
    localStorage.setItem(key, value);
  }
};