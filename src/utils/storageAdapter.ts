import { IncomingMail, OutgoingMail } from '@/types/mail';
import { db } from './database';
import { fileSystemStorage } from './fileSystemStorage';
import { MailStorageData } from '@/types/fileSystemAccess';

export class StorageAdapter {
  private static instance: StorageAdapter;
  private useFileSystem = false;

  private constructor() {
    // Vérifier si l'utilisateur a configuré le stockage sur disque
    this.useFileSystem = fileSystemStorage.isSupported() && fileSystemStorage.hasStorageDirectory();
  }

  static getInstance(): StorageAdapter {
    if (!StorageAdapter.instance) {
      StorageAdapter.instance = new StorageAdapter();
    }
    return StorageAdapter.instance;
  }

  // Configuration du type de stockage
  async enableFileSystemStorage(): Promise<boolean> {
    if (!fileSystemStorage.isSupported()) {
      return false;
    }
    
    const success = await fileSystemStorage.selectStorageDirectory();
    if (success) {
      this.useFileSystem = true;
      // Migrer les données existantes de IndexedDB vers le système de fichiers
      await this.migrateToFileSystem();
    }
    return success;
  }

  // Migration des données d'IndexedDB vers le système de fichiers
  private async migrateToFileSystem(): Promise<void> {
    try {
      const incomingMails = await db.incomingMails.toArray();
      const outgoingMails = await db.outgoingMails.toArray();
      
      const data: MailStorageData = {
        incomingMails,
        outgoingMails,
        version: '1.0',
        lastModified: new Date().toISOString()
      };

      await fileSystemStorage.saveData(data);
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
    }
  }

  // Sauvegarde d'un courrier entrant
  async saveIncomingMail(mail: any): Promise<void> {
    if (this.useFileSystem) {
      await this.saveToFileSystem();
    }
    
    // Toujours sauvegarder aussi en IndexedDB comme fallback
    const mailWithStatus = { ...mail, status: "Processing" };
    await db.incomingMails.add(mailWithStatus);
    
    if (this.useFileSystem) {
      await this.syncToFileSystem();
    }
  }

  // Sauvegarde d'un courrier sortant
  async saveOutgoingMail(mail: any): Promise<void> {
    if (this.useFileSystem) {
      await this.saveToFileSystem();
    }
    
    // Toujours sauvegarder aussi en IndexedDB comme fallback
    await db.outgoingMails.add(mail);
    
    if (this.useFileSystem) {
      await this.syncToFileSystem();
    }
  }

  // Mise à jour d'un courrier entrant
  async updateIncomingMail(mailId: string, updatedMail: any): Promise<boolean> {
    try {
      const result = await db.incomingMails.update(mailId, updatedMail);
      
      if (this.useFileSystem) {
        await this.syncToFileSystem();
      }
      
      return result > 0;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du courrier entrant:", error);
      return false;
    }
  }

  // Mise à jour d'un courrier sortant
  async updateOutgoingMail(mailId: string, updatedMail: any): Promise<boolean> {
    try {
      const result = await db.outgoingMails.update(mailId, updatedMail);
      
      if (this.useFileSystem) {
        await this.syncToFileSystem();
      }
      
      return result > 0;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du courrier sortant:", error);
      return false;
    }
  }

  // Récupération de tous les courriers entrants
  async getAllIncomingMails(): Promise<IncomingMail[]> {
    try {
      const mails = await db.incomingMails.toArray();
      return mails.map((mail: any) => ({
        ...mail,
        date: mail.date ? new Date(mail.date) : undefined,
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
        responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des courriers entrants:", error);
      return [];
    }
  }

  // Récupération de tous les courriers sortants
  async getAllOutgoingMails(): Promise<OutgoingMail[]> {
    try {
      const mails = await db.outgoingMails.toArray();
      return mails.map((mail: any) => ({
        ...mail,
        date: mail.date ? new Date(mail.date) : undefined,
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des courriers sortants:", error);
      return [];
    }
  }

  // Suppression d'un courrier entrant
  async deleteIncomingMail(mailId: string): Promise<boolean> {
    try {
      await db.incomingMails.delete(mailId);
      
      if (this.useFileSystem) {
        await this.syncToFileSystem();
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du courrier entrant:", error);
      return false;
    }
  }

  // Suppression d'un courrier sortant
  async deleteOutgoingMail(mailId: string): Promise<boolean> {
    try {
      await db.outgoingMails.delete(mailId);
      
      if (this.useFileSystem) {
        await this.syncToFileSystem();
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du courrier sortant:", error);
      return false;
    }
  }

  // Synchronisation avec le système de fichiers
  private async syncToFileSystem(): Promise<void> {
    if (!this.useFileSystem) return;

    try {
      const incomingMails = await db.incomingMails.toArray();
      const outgoingMails = await db.outgoingMails.toArray();
      
      const data: MailStorageData = {
        incomingMails,
        outgoingMails,
        version: '1.0',
        lastModified: new Date().toISOString()
      };

      await fileSystemStorage.saveData(data);
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    }
  }

  private async saveToFileSystem(): Promise<void> {
    // Cette méthode est appelée avant la sauvegarde en IndexedDB
    // pour préparer la synchronisation
  }

  // Export des données
  async exportData(): Promise<boolean> {
    try {
      const incomingMails = await this.getAllIncomingMails();
      const outgoingMails = await this.getAllOutgoingMails();
      
      const data: MailStorageData = {
        incomingMails,
        outgoingMails,
        version: '1.0',
        lastModified: new Date().toISOString()
      };

      return await fileSystemStorage.exportData(data);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return false;
    }
  }

  // Import des données
  async importData(): Promise<boolean> {
    try {
      const data = await fileSystemStorage.importData();
      if (!data) return false;

      // Importer dans IndexedDB
      await db.incomingMails.clear();
      await db.outgoingMails.clear();
      
      if (data.incomingMails) {
        await db.incomingMails.bulkAdd(data.incomingMails);
      }
      
      if (data.outgoingMails) {
        await db.outgoingMails.bulkAdd(data.outgoingMails);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  // Getters pour l'état
  isUsingFileSystem(): boolean {
    return this.useFileSystem;
  }

  isFileSystemSupported(): boolean {
    return fileSystemStorage.isSupported();
  }

  getStorageLocation(): string | null {
    return fileSystemStorage.getStorageDirectoryName();
  }
}

export const storageAdapter = StorageAdapter.getInstance();