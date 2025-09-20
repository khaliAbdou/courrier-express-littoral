import { IncomingMail, OutgoingMail } from '@/types/mail';
import { MailStorageData } from '@/types/fileSystemAccess';
import { fileSystemStorage } from './fileSystemStorage';

class StorageAdapter {
  private static instance: StorageAdapter | null = null;
  private initialized: boolean = false;
  private storageReady: boolean = false;

  constructor() {
    // Le système utilisera uniquement le stockage sur disque
  }

  static getInstance(): StorageAdapter {
    if (!StorageAdapter.instance) {
      StorageAdapter.instance = new StorageAdapter();
    }
    return StorageAdapter.instance;
  }

  // Initialise le stockage sur système de fichiers
  async initializeFileSystemStorage(): Promise<boolean> {
    if (this.initialized) return this.storageReady;
    
    this.initialized = true;
    
    // Vérifier si l'API File System Access est supportée et utilisable
    if (!fileSystemStorage.isSupported() || !fileSystemStorage.isUsable()) {
      console.warn('File System Access API non supporté ou non utilisable, utilisation du localStorage');
      this.storageReady = false;
      return false;
    }

    // Vérifier si un dossier est déjà configuré
    if (fileSystemStorage.hasStorageDirectory()) {
      this.storageReady = true;
      return true;
    }

    // Sinon, demander à l'utilisateur de sélectionner un dossier
    const success = await fileSystemStorage.selectStorageDirectory();
    this.storageReady = success;
    return success;
  }

  // Active le stockage sur système de fichiers
  async enableFileSystemStorage(): Promise<boolean> {
    const success = await fileSystemStorage.selectStorageDirectory();
    this.storageReady = success;
    return success;
  }

  // Sauvegarde un courrier entrant
  async saveIncomingMail(mail: any): Promise<void> {
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_incomingMails');
        const mails = stored ? JSON.parse(stored) : [];
        mails.push(mail);
        localStorage.setItem('mailApp_incomingMails', JSON.stringify(mails));
        return;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde dans localStorage:', error);
        throw error;
      }
    }

    try {
      const data = await fileSystemStorage.loadData() || { 
        incomingMails: [], 
        outgoingMails: [], 
        version: '1.0.0', 
        lastModified: new Date().toISOString() 
      };
      
      data.incomingMails.push(mail);
      data.lastModified = new Date().toISOString();
      await fileSystemStorage.saveData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du courrier entrant:', error);
      throw error;
    }
  }

  // Sauvegarde un courrier sortant
  async saveOutgoingMail(mail: any): Promise<void> {
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_outgoingMails');
        const mails = stored ? JSON.parse(stored) : [];
        mails.push(mail);
        localStorage.setItem('mailApp_outgoingMails', JSON.stringify(mails));
        return;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde dans localStorage:', error);
        throw error;
      }
    }

    try {
      const data = await fileSystemStorage.loadData() || { 
        incomingMails: [], 
        outgoingMails: [], 
        version: '1.0.0', 
        lastModified: new Date().toISOString() 
      };
      
      data.outgoingMails.push(mail);
      data.lastModified = new Date().toISOString();
      await fileSystemStorage.saveData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du courrier sortant:', error);
      throw error;
    }
  }

  // Met à jour un courrier entrant
  async updateIncomingMail(mailId: string, updatedMail: any): Promise<boolean> {
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_incomingMails');
        const mails = stored ? JSON.parse(stored) : [];
        const index = mails.findIndex((mail: any) => mail.id === mailId);
        if (index !== -1) {
          mails[index] = { ...mails[index], ...updatedMail };
          localStorage.setItem('mailApp_incomingMails', JSON.stringify(mails));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erreur lors de la mise à jour dans localStorage:', error);
        return false;
      }
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
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_outgoingMails');
        const mails = stored ? JSON.parse(stored) : [];
        const index = mails.findIndex((mail: any) => mail.id === mailId);
        if (index !== -1) {
          mails[index] = { ...mails[index], ...updatedMail };
          localStorage.setItem('mailApp_outgoingMails', JSON.stringify(mails));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erreur lors de la mise à jour dans localStorage:', error);
        return false;
      }
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
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_incomingMails');
        const mails = stored ? JSON.parse(stored) : [];
        return mails.map((mail: any) => ({
          ...mail,
          date: mail.date ? new Date(mail.date) : undefined,
          issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
          responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération depuis localStorage:', error);
        return [];
      }
    }

    try {
      const data = await fileSystemStorage.loadData();
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
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_outgoingMails');
        const mails = stored ? JSON.parse(stored) : [];
        return mails.map((mail: any) => ({
          ...mail,
          date: mail.date ? new Date(mail.date) : undefined,
          issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération depuis localStorage:', error);
        return [];
      }
    }

    try {
      const data = await fileSystemStorage.loadData();
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
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_incomingMails');
        const mails = stored ? JSON.parse(stored) : [];
        const filteredMails = mails.filter((mail: any) => mail.id !== mailId);
        localStorage.setItem('mailApp_incomingMails', JSON.stringify(filteredMails));
        return true;
      } catch (error) {
        console.error('Erreur lors de la suppression dans localStorage:', error);
        return false;
      }
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
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      // Mode fallback avec localStorage
      try {
        const stored = localStorage.getItem('mailApp_outgoingMails');
        const mails = stored ? JSON.parse(stored) : [];
        const filteredMails = mails.filter((mail: any) => mail.id !== mailId);
        localStorage.setItem('mailApp_outgoingMails', JSON.stringify(filteredMails));
        return true;
      } catch (error) {
        console.error('Erreur lors de la suppression dans localStorage:', error);
        return false;
      }
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
      
      if (this.storageReady) {
        // Utiliser le stockage sur disque
        const diskData = await fileSystemStorage.loadData();
        data = diskData || {
          incomingMails: [],
          outgoingMails: [],
          version: '1.0.0',
          lastModified: new Date().toISOString()
        };
      } else {
        // Utiliser le localStorage en fallback
        const incomingStored = localStorage.getItem('mailApp_incomingMails');
        const outgoingStored = localStorage.getItem('mailApp_outgoingMails');
        
        data = {
          incomingMails: incomingStored ? JSON.parse(incomingStored) : [],
          outgoingMails: outgoingStored ? JSON.parse(outgoingStored) : [],
          version: '1.0.0',
          lastModified: new Date().toISOString()
        };
      }

      // Export classique avec téléchargement direct si l'API File System n'est pas disponible
      if (this.storageReady && fileSystemStorage.isSupported() && fileSystemStorage.isUsable()) {
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
      if (this.storageReady && fileSystemStorage.isSupported() && fileSystemStorage.isUsable()) {
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
              
              // Sauvegarder dans localStorage
              if (data.incomingMails) {
                localStorage.setItem('mailApp_incomingMails', JSON.stringify(data.incomingMails));
              }
              if (data.outgoingMails) {
                localStorage.setItem('mailApp_outgoingMails', JSON.stringify(data.outgoingMails));
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
    return this.storageReady;
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
    return this.storageReady;
  }
}

export const storageAdapter = StorageAdapter.getInstance();