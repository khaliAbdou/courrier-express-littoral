// Helpers pour récupérer les données via le storageAdapter unifié
import { storageAdapter } from './storageAdapter';
import { IncomingMail, OutgoingMail } from '@/types/mail';

// Récupération des courriers entrants depuis le stockage unifié
export async function getIncomingMailsFromStorage(): Promise<IncomingMail[]> {
  try {
    return await storageAdapter.getAllIncomingMails();
  } catch (error) {
    console.error('Erreur lors de la récupération des courriers entrants:', error);
    return [];
  }
}

// Récupération des courriers sortants depuis le stockage unifié
export async function getOutgoingMailsFromStorage(): Promise<OutgoingMail[]> {
  try {
    return await storageAdapter.getAllOutgoingMails();
  } catch (error) {
    console.error('Erreur lors de la récupération des courriers sortants:', error);
    return [];
  }
}

// Helper pour sauvegarder des données génériques sur disque
export async function saveGenericData(key: string, data: any): Promise<void> {
  try {
    // Utiliser le même système de fichiers pour les données génériques
    const existingData = await storageAdapter.getAllIncomingMails(); // Pour initialiser le stockage
    
    // Les données génériques peuvent être stockées dans un fichier séparé
    // ou dans un champ spécialisé du fichier principal
    console.log(`Sauvegarde de ${key}:`, data);
    
    // Pour l'instant, utiliser le localStorage comme fallback pour les données génériques
    // jusqu'à ce qu'on implémente un système de fichiers séparé pour ces données
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    // Fallback vers localStorage
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Helper pour récupérer des données génériques
export function getGenericData<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key}:`, error);
    return null;
  }
}