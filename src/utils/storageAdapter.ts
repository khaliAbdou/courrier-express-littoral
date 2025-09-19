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
    
    // Vérifier si l'API File System Access est supportée
    if (!fileSystemStorage.isSupported()) {
      console.warn('File System Access API non supporté');
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
      throw new Error('Stockage non disponible - veuillez configurer un dossier de stockage');
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
      throw new Error('Stockage non disponible - veuillez configurer un dossier de stockage');
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
      throw new Error('Stockage non disponible');
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
      throw new Error('Stockage non disponible');
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
      return [];
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
      return [];
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
      return false;
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
      return false;
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
    if (!this.storageReady) {
      await this.initializeFileSystemStorage();
    }
    
    if (!this.storageReady) {
      return false;
    }

    try {
      const data = await fileSystemStorage.loadData();
      if (!data) {
        // Créer des données vides si aucune donnée n'existe
        const emptyData: MailStorageData = {
          incomingMails: [],
          outgoingMails: [],
          version: '1.0.0',
          lastModified: new Date().toISOString()
        };
        return await fileSystemStorage.exportData(emptyData);
      }

      return await fileSystemStorage.exportData(data);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return false;
    }
  }

  // Importe des données
  async importData(): Promise<boolean> {
    try {
      const data = await fileSystemStorage.importData();
      if (!data) return false;

      // Sauvegarder les données importées
      await fileSystemStorage.saveData(data);
      this.storageReady = true;

      return true;
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