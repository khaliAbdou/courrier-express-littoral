import { tauriStorageAdapter } from './storageAdapterTauri';
import { localStorageAdapter } from './storageAdapterLocal';

// Détecter l'environnement et utiliser l'adaptateur approprié
function getStorageAdapter() {
  // Vérifier si nous sommes dans un environnement Tauri
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    return tauriStorageAdapter;
  }
  
  // Fallback vers localStorage pour l'environnement web
  return localStorageAdapter;
}

export const storageAdapter = getStorageAdapter();