import { IncomingMail, OutgoingMail } from '@/types/mail';
import { MailStorageData } from '@/types/fileSystemAccess';
import { fileSystemStorage } from './fileSystemStorage';

class StorageAdapter {
  private isFileSystemEnabled = false;
  private backupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Vérifier la disponibilité de l'API File System Access
    if (fileSystemStorage.isSupported() && fileSystemStorage.isUsable()) {
      console.log('Application prête - Stockage filesystem disponible');
      // Activer automatiquement le stockage filesystem
      await this.enableAutoFileSystemStorage();
    } else {
      console.log('Mode fallback - Utilisation de localStorage + téléchargement');
      // En mode fallback, charger les données existantes depuis localStorage
      this.loadFromLocalStorageFallback();
    }
  }

  // Active automatiquement le stockage filesystem avec un dossier prédéfini
  private async enableAutoFileSystemStorage() {
    try {
      // Vérifier s'il y a déjà un dossier configuré
      const existingLocation = fileSystemStorage.getStorageDirectoryName();
      if (existingLocation) {
        this.isFileSystemEnabled = true;
        this.startAutoBackup();
        console.log('Dossier de stockage déjà configuré:', existingLocation);
        return;
      }

      // Pour la version desktop, utiliser un dossier par défaut
      // Pour le développement, utiliser localStorage uniquement
      if (window.navigator.userAgent.includes('Electron')) {
        // Mode Electron - demander l'accès au filesystem
        const success = await fileSystemStorage.requestAccess();
        if (success) {
          this.isFileSystemEnabled = true;
          this.startAutoBackup();
          await this.migrateFromLocalStorage();
          console.log('Stockage filesystem activé automatiquement');
        }
      }
    } catch (error) {
      console.warn('Impossible d\'activer le stockage filesystem automatiquement:', error);
      // Continuer en mode localStorage
    }
  }

  // Méthode pour charger les données depuis localStorage en mode fallback
  private loadFromLocalStorageFallback() {
    try {
      const storedData = localStorage.getItem('mail-data');
      if (storedData) {
        const data = JSON.parse(storedData) as MailStorageData;
        console.log('Données chargées depuis localStorage:', data.incomingMails?.length || 0, 'courriers entrants,', data.outgoingMails?.length || 0, 'courriers sortants');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données localStorage:', error);
    }
  }

  async enableFileSystemStorage(): Promise<boolean> {
    // Cette méthode est maintenant legacy - le stockage est activé automatiquement
    // Retourner true car le stockage est toujours disponible (filesystem ou localStorage)
    return true;
  }

  // Migre les données de localStorage vers le filesystem
  private async migrateFromLocalStorage() {
    try {
      const storedData = localStorage.getItem('mail-data');
      if (storedData && this.isFileSystemEnabled) {
        const data = JSON.parse(storedData) as MailStorageData;
        await fileSystemStorage.saveData(data);
        console.log('Migration des données localStorage vers filesystem terminée');
      }
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
    }
  }

  private startAutoBackup() {
    // Sauvegarde automatique toutes les 5 minutes
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }
    
    this.backupInterval = setInterval(async () => {
      try {
        await this.exportData();
      } catch (error) {
        console.error('Erreur sauvegarde automatique:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Sauvegarde un courrier entrant
  async saveIncomingMail(mail: any): Promise<void> {
    try {
      let data: MailStorageData;

      if (this.isFileSystemEnabled) {
        // Mode filesystem
        data = await fileSystemStorage.loadData() || { 
          incomingMails: [], 
          outgoingMails: [], 
          version: '1.0.0', 
          lastModified: new Date().toISOString() 
        };
      } else {
        // Mode fallback localStorage
        const storedData = localStorage.getItem('mail-data');
        data = storedData ? JSON.parse(storedData) : {
          incomingMails: [], 
          outgoingMails: [], 
          version: '1.0.0', 
          lastModified: new Date().toISOString()
        };
      }
      
      data.incomingMails.push(mail);
      data.lastModified = new Date().toISOString();

      if (this.isFileSystemEnabled) {
        await fileSystemStorage.saveData(data);
      } else {
        localStorage.setItem('mail-data', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du courrier entrant:', error);
      throw error;
    }
  }

  // Sauvegarde un courrier sortant
  async saveOutgoingMail(mail: any): Promise<void> {
    try {
      let data: MailStorageData;

      if (this.isFileSystemEnabled) {
        // Mode filesystem
        data = await fileSystemStorage.loadData() || { 
          incomingMails: [], 
          outgoingMails: [], 
          version: '1.0.0', 
          lastModified: new Date().toISOString() 
        };
      } else {
        // Mode fallback localStorage
        const storedData = localStorage.getItem('mail-data');
        data = storedData ? JSON.parse(storedData) : {
          incomingMails: [], 
          outgoingMails: [], 
          version: '1.0.0', 
          lastModified: new Date().toISOString()
        };
      }
      
      data.outgoingMails.push(mail);
      data.lastModified = new Date().toISOString();

      if (this.isFileSystemEnabled) {
        await fileSystemStorage.saveData(data);
      } else {
        localStorage.setItem('mail-data', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du courrier sortant:', error);
      throw error;
    }
  }

  // Met à jour un courrier entrant
  async updateIncomingMail(mailId: string, updatedMail: any): Promise<boolean> {
    if (!this.isFileSystemEnabled) {
      throw new Error('Stockage filesystem requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await fileSystemStorage.loadData();
      if (data) {
        const index = data.incomingMails.findIndex(mail => mail.id === mailId);
        if (index !== -1) {
          data.incomingMails[index] = { ...data.incomingMails[index], ...updatedMail };
          data.lastModified = new Date().toISOString();
          await fileSystemStorage.saveData(data);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du courrier entrant:', error);
      return false;
    }
  }

  // Met à jour un courrier sortant
  async updateOutgoingMail(mailId: string, updatedMail: any): Promise<boolean> {
    if (!this.isFileSystemEnabled) {
      throw new Error('Stockage filesystem requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await fileSystemStorage.loadData();
      if (data) {
        const index = data.outgoingMails.findIndex(mail => mail.id === mailId);
        if (index !== -1) {
          data.outgoingMails[index] = { ...data.outgoingMails[index], ...updatedMail };
          data.lastModified = new Date().toISOString();
          await fileSystemStorage.saveData(data);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du courrier sortant:', error);
      return false;
    }
  }

  // Récupère tous les courriers entrants
  async getAllIncomingMails(): Promise<IncomingMail[]> {
    try {
      let data: MailStorageData | null = null;

      if (this.isFileSystemEnabled) {
        data = await fileSystemStorage.loadData();
      } else {
        // Mode fallback localStorage
        const storedData = localStorage.getItem('mail-data');
        data = storedData ? JSON.parse(storedData) : null;
      }

      const mails = data?.incomingMails || [];
      
      return mails.map((mail: any) => ({
        ...mail,
        date: mail.date ? new Date(mail.date) : undefined,
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
        responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des courriers entrants:', error);
      return [];
    }
  }

  // Récupère tous les courriers sortants
  async getAllOutgoingMails(): Promise<OutgoingMail[]> {
    try {
      let data: MailStorageData | null = null;

      if (this.isFileSystemEnabled) {
        data = await fileSystemStorage.loadData();
      } else {
        // Mode fallback localStorage
        const storedData = localStorage.getItem('mail-data');
        data = storedData ? JSON.parse(storedData) : null;
      }

      const mails = data?.outgoingMails || [];
      
      return mails.map((mail: any) => ({
        ...mail,
        date: mail.date ? new Date(mail.date) : undefined,
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des courriers sortants:', error);
      return [];
    }
  }

  // Supprime un courrier entrant
  async deleteIncomingMail(mailId: string): Promise<boolean> {
    if (!this.isFileSystemEnabled) {
      throw new Error('Stockage filesystem requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await fileSystemStorage.loadData();
      if (data) {
        data.incomingMails = data.incomingMails.filter(mail => mail.id !== mailId);
        data.lastModified = new Date().toISOString();
        await fileSystemStorage.saveData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression du courrier entrant:', error);
      return false;
    }
  }

  // Supprime un courrier sortant
  async deleteOutgoingMail(mailId: string): Promise<boolean> {
    if (!this.isFileSystemEnabled) {
      throw new Error('Stockage filesystem requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await fileSystemStorage.loadData();
      if (data) {
        data.outgoingMails = data.outgoingMails.filter(mail => mail.id !== mailId);
        data.lastModified = new Date().toISOString();
        await fileSystemStorage.saveData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression du courrier sortant:', error);
      return false;
    }
  }

  // Exporte toutes les données
  async exportData(): Promise<boolean> {
    try {
      let data: MailStorageData;
      
      if (this.isFileSystemEnabled) {
        // Mode filesystem
        const diskData = await fileSystemStorage.loadData();
        data = diskData || {
          incomingMails: [],
          outgoingMails: [],
          version: '1.0.0',
          lastModified: new Date().toISOString()
        };
      } else {
        // Mode fallback localStorage
        const storedData = localStorage.getItem('mail-data');
        data = storedData ? JSON.parse(storedData) : {
          incomingMails: [],
          outgoingMails: [],
          version: '1.0.0',
          lastModified: new Date().toISOString()
        };
      }

      // Export avec File System API si disponible et utilisable
      if (this.isFileSystemEnabled && fileSystemStorage.isSupported() && fileSystemStorage.isUsable()) {
        return await fileSystemStorage.exportData(data);
      } else {
        // Fallback : téléchargement direct
        this.downloadJSON(data, `courriers-export-${new Date().toISOString().split('T')[0]}.json`);
        return true;
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return false;
    }
  }

  // Méthode helper pour télécharger du JSON
  private downloadJSON(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importe des données
  async importData(): Promise<boolean> {
    try {
      // Utiliser l'API File System si disponible et utilisable
      if (this.isFileSystemEnabled && fileSystemStorage.isSupported() && fileSystemStorage.isUsable()) {
        const data = await fileSystemStorage.importData();
        if (!data) return false;
        await fileSystemStorage.saveData(data);
        return true;
      } else {
        // Fallback : input file classique
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
              resolve(false);
              return;
            }

            try {
              const text = await file.text();
              const data = JSON.parse(text) as MailStorageData;
              
              // Sauvegarder les données
              if (this.isFileSystemEnabled) {
                await fileSystemStorage.saveData(data);
              } else {
                localStorage.setItem('mail-data', JSON.stringify(data));
              }
              
              resolve(true);
            } catch (error) {
              console.error('Erreur lors de l\'import:', error);
              resolve(false);
            }
          };
          input.click();
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  // Vérifie si le système de fichiers est utilisé
  isUsingFileSystem(): boolean {
    return this.isFileSystemEnabled;
  }

  // Vérifie si le système de fichiers est supporté
  isFileSystemSupported(): boolean {
    return fileSystemStorage.isSupported();
  }

  // Obtient l'emplacement de stockage
  getStorageLocation(): string | null {
    return fileSystemStorage.getStorageDirectoryName();
  }

  // Vérifie si le stockage est prêt
  isStorageReady(): boolean {
    // Le stockage est prêt soit en mode filesystem, soit en mode fallback
    return this.isFileSystemEnabled || !fileSystemStorage.isUsable();
  }
}

export const storageAdapter = new StorageAdapter();