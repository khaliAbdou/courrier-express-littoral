import { tauriStorageAdapter } from './storageAdapterTauri';
import { localStorageAdapter } from './storageAdapterLocal';
import { tauriBridge } from './tauriBridge';

// Détecte et utilise l'adaptateur approprié
function getStorageAdapter() {
  if (tauriBridge.isTauri()) {
    return tauriStorageAdapter;
  }
  return localStorageAdapter;
}

export const storageAdapter = getStorageAdapter();