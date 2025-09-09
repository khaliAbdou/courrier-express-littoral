import { IncomingMail, OutgoingMail } from '@/types/mail';
import { MailStorageData } from '@/types/fileSystemAccess';

class FileSystemStorage {
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private readonly fileName = 'mail-data.json';

  // Vérifie si File System Access API est supporté
  isSupported(): boolean {
    return 'showDirectoryPicker' in window && 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
  }

  // Vérifie si l'API est utilisable (pas bloquée par iframe cross-origin)
  async isUsable(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      // Test rapide pour voir si l'API est bloquée
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 100);
        
        // Tenter d'utiliser l'API sans interaction utilisateur pour détecter les restrictions
        if (window.top !== window.self) {
          // Nous sommes dans un iframe
          clearTimeout(timeout);
          reject(new Error('Cross-origin iframe detected'));
        } else {
          clearTimeout(timeout);
          resolve(true);
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  // Sélectionne un dossier pour le stockage
  async selectStorageDirectory(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('File System Access API n\'est pas supporté par ce navigateur');
    }

    try {
      this.directoryHandle = await window.showDirectoryPicker!({
        mode: 'readwrite'
      });
      
      // Sauvegarder la référence du dossier dans localStorage
      localStorage.setItem('mailAppDirectoryHandle', JSON.stringify({
        name: this.directoryHandle.name,
        hasHandle: true
      }));

      return true;
    } catch (error) {
      console.error('Erreur lors de la sélection du dossier:', error);
      return false;
    }
  }

  // Sauvegarde les données dans un fichier
  async saveData(data: MailStorageData): Promise<boolean> {
    if (!this.directoryHandle) {
      throw new Error('Aucun dossier de stockage sélectionné');
    }

    try {
      const fileHandle = await this.directoryHandle.getFileHandle(this.fileName, { create: true });
      const writable = await fileHandle.createWritable();
      
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  // Charge les données depuis le fichier
  async loadData(): Promise<MailStorageData | null> {
    if (!this.directoryHandle) {
      return null;
    }

    try {
      const fileHandle = await this.directoryHandle.getFileHandle(this.fileName);
      const file = await fileHandle.getFile();
      const text = await file.text();
      
      return JSON.parse(text) as MailStorageData;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return null;
    }
  }

  // Exporte les données vers un fichier choisi par l'utilisateur
  async exportData(data: MailStorageData): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('File System Access API n\'est pas supporté par ce navigateur');
    }

    try {
      const fileHandle = await window.showSaveFilePicker!({
        suggestedName: `courriers-export-${new Date().toISOString().split('T')[0]}.json`,
        types: [{
          description: 'Fichiers JSON',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return false;
    }
  }

  // Importe les données depuis un fichier choisi par l'utilisateur
  async importData(): Promise<MailStorageData | null> {
    if (!this.isSupported()) {
      throw new Error('File System Access API n\'est pas supporté par ce navigateur');
    }

    try {
      const [fileHandle] = await window.showOpenFilePicker!({
        types: [{
          description: 'Fichiers JSON',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const file = await fileHandle.getFile();
      const text = await file.text();
      
      return JSON.parse(text) as MailStorageData;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return null;
    }
  }

  // Vérifie si un dossier est déjà configuré
  hasStorageDirectory(): boolean {
    const saved = localStorage.getItem('mailAppDirectoryHandle');
    return saved !== null && this.directoryHandle !== null;
  }

  // Obtient le nom du dossier actuel
  getStorageDirectoryName(): string | null {
    const saved = localStorage.getItem('mailAppDirectoryHandle');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.name;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const fileSystemStorage = new FileSystemStorage();