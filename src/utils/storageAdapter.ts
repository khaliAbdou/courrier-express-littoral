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
    // Application Electron - Vérifier la disponibilité de l'API sans forcer l'activation
    if (!fileSystemStorage.isSupported()) {
      console.error('Cette application nécessite un navigateur compatible avec File System Access API (Chrome/Edge 86+)');
      return;
    }
    
    if (!fileSystemStorage.isUsable()) {
      console.warn('File System Access API détecté mais non utilisable dans ce contexte');
      return;
    }
    
    // Ne pas tenter d'activer automatiquement - laisser l'utilisateur choisir
    console.log('Application prête - Stockage filesystem disponible');
  }

  async enableFileSystemStorage(): Promise<boolean> {
    try {
      const success = await fileSystemStorage.requestAccess();
      if (success) {
        this.isFileSystemEnabled = true;
        this.startAutoBackup();
        console.log('Stockage filesystem activé avec succès');
        return true;
      }
      console.warn('Utilisateur a annulé la sélection du dossier');
      return false;
    } catch (error) {
      console.error('Erreur activation stockage filesystem:', error);
      // Ne pas lancer d'erreur - permettre à l'utilisateur de réessayer
      return false;
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
    if (!this.isFileSystemEnabled) {
      throw new Error('Stockage filesystem requis - Veuillez configurer un dossier de stockage');
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
    if (!this.isFileSystemEnabled) {
      throw new Error('Stockage filesystem requis - Veuillez configurer un dossier de stockage');
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
    if (!this.isFileSystemEnabled) {
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
    if (!this.isFileSystemEnabled) {
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
      
      // Utiliser le stockage sur disque
      const diskData = await fileSystemStorage.loadData();
      data = diskData || {
        incomingMails: [],
        outgoingMails: [],
        version: '1.0.0',
        lastModified: new Date().toISOString()
      };

      // Export avec File System API si disponible
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
              
              // Sauvegarder avec filesystem si disponible
              if (this.isFileSystemEnabled) {
                await fileSystemStorage.saveData(data);
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
    return this.isFileSystemEnabled;
  }
}

export const storageAdapter = new StorageAdapter();