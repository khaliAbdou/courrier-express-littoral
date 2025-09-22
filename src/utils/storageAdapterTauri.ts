import { IncomingMail, OutgoingMail } from '@/types/mail';
import { MailStorageData } from '@/types/fileSystemAccess';
import { tauriBridge } from './tauriBridge';

class TauriStorageAdapter {
  private storageLocation: string | null = null;
  private isInitialized = false;
  private backupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // En mode développement, Tauri n'est pas disponible
    if (!tauriBridge.isTauri()) {
      console.log('Mode développement détecté - Tauri non disponible');
      console.log('L\'application sera pleinement fonctionnelle uniquement après compilation avec Tauri');
      return;
    }
    
    // Récupérer le dossier de stockage sauvegardé
    const savedLocation = localStorage.getItem('tauri-storage-location');
    if (savedLocation) {
      this.storageLocation = savedLocation;
      this.isInitialized = true;
      console.log('Dossier de stockage récupéré:', savedLocation);
    }
    
    console.log('Application Tauri prête');
  }

  async enableFileSystemStorage(): Promise<boolean> {
    if (!tauriBridge.isTauri()) {
      console.warn('Fonctionnalité disponible uniquement après compilation avec Tauri');
      return false;
    }
    
    try {
      const selectedPath = await tauriBridge.selectDirectory();
      if (selectedPath) {
        this.storageLocation = selectedPath;
        this.isInitialized = true;
        // Sauvegarder le chemin sélectionné
        localStorage.setItem('tauri-storage-location', selectedPath);
        this.startAutoBackup();
        console.log('Dossier de stockage Tauri configuré:', selectedPath);
        return true;
      }
      console.warn('Utilisateur a annulé la sélection du dossier');
      return false;
    } catch (error) {
      console.error('Erreur activation stockage Tauri:', error);
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

  private async loadData(): Promise<MailStorageData | null> {
    if (!this.isInitialized || !this.storageLocation) {
      return null;
    }

    try {
      const filePath = `${this.storageLocation}/courriers-data.json`;
      const content = await tauriBridge.readFile(filePath);
      return content ? JSON.parse(content) : null;
    } catch (error) {
      console.error('Erreur chargement données:', error);
      return null;
    }
  }

  private async saveData(data: MailStorageData): Promise<void> {
    if (!this.isInitialized || !this.storageLocation) {
      throw new Error('Stockage non initialisé - veuillez sélectionner un dossier');
    }

    try {
      const filePath = `${this.storageLocation}/courriers-data.json`;
      const success = await tauriBridge.writeFile(filePath, JSON.stringify(data, null, 2));
      if (!success) {
        throw new Error('Échec de l\'écriture du fichier');
      }
    } catch (error) {
      console.error('Erreur sauvegarde données:', error);
      throw new Error('Impossible de sauvegarder les données');
    }
  }

  // Sauvegarde un courrier entrant
  async saveIncomingMail(mail: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Stockage Tauri requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await this.loadData() || { 
        incomingMails: [], 
        outgoingMails: [], 
        version: '1.0.0', 
        lastModified: new Date().toISOString() 
      };
      
      data.incomingMails.push(mail);
      data.lastModified = new Date().toISOString();
      await this.saveData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du courrier entrant:', error);
      throw error;
    }
  }

  // Sauvegarde un courrier sortant
  async saveOutgoingMail(mail: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Stockage Tauri requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await this.loadData() || { 
        incomingMails: [], 
        outgoingMails: [], 
        version: '1.0.0', 
        lastModified: new Date().toISOString() 
      };
      
      data.outgoingMails.push(mail);
      data.lastModified = new Date().toISOString();
      await this.saveData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du courrier sortant:', error);
      throw error;
    }
  }

  // Met à jour un courrier entrant
  async updateIncomingMail(mailId: string, updatedMail: any): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Stockage Tauri requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await this.loadData();
      if (data) {
        const index = data.incomingMails.findIndex(mail => mail.id === mailId);
        if (index !== -1) {
          data.incomingMails[index] = { ...data.incomingMails[index], ...updatedMail };
          data.lastModified = new Date().toISOString();
          await this.saveData(data);
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
    if (!this.isInitialized) {
      throw new Error('Stockage Tauri requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await this.loadData();
      if (data) {
        const index = data.outgoingMails.findIndex(mail => mail.id === mailId);
        if (index !== -1) {
          data.outgoingMails[index] = { ...data.outgoingMails[index], ...updatedMail };
          data.lastModified = new Date().toISOString();
          await this.saveData(data);
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
    if (!this.isInitialized) {
      return [];
    }

    try {
      const data = await this.loadData();
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
    if (!this.isInitialized) {
      return [];
    }

    try {
      const data = await this.loadData();
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
    if (!this.isInitialized) {
      throw new Error('Stockage Tauri requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await this.loadData();
      if (data) {
        data.incomingMails = data.incomingMails.filter(mail => mail.id !== mailId);
        data.lastModified = new Date().toISOString();
        await this.saveData(data);
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
    if (!this.isInitialized) {
      throw new Error('Stockage Tauri requis - Veuillez configurer un dossier de stockage');
    }

    try {
      const data = await this.loadData();
      if (data) {
        data.outgoingMails = data.outgoingMails.filter(mail => mail.id !== mailId);
        data.lastModified = new Date().toISOString();
        await this.saveData(data);
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
      const data = await this.loadData() || {
        incomingMails: [],
        outgoingMails: [],
        version: '1.0.0',
        lastModified: new Date().toISOString()
      };

      if (this.isInitialized && this.storageLocation) {
        const exportPath = `${this.storageLocation}/export-courriers-${new Date().toISOString().split('T')[0]}.json`;
        const success = await tauriBridge.writeFile(exportPath, JSON.stringify(data, null, 2));
        return success;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return false;
    }
  }

  // Importe des données
  async importData(): Promise<boolean> {
    try {
      // Note: Pour l'import, nous pourrions utiliser une boîte de dialogue Tauri
      // Pour le moment, retourner false pour indiquer que cette fonctionnalité
      // nécessite une implémentation supplémentaire dans le backend Rust
      console.warn('Import de données non encore implémenté avec Tauri');
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  // Vérifie si le système de fichiers est utilisé
  isUsingFileSystem(): boolean {
    return this.isInitialized;
  }

  // Vérifie si le système de fichiers est supporté
  isFileSystemSupported(): boolean {
    return tauriBridge.isTauri();
  }

  // Obtient l'emplacement de stockage
  getStorageLocation(): string {
    return this.storageLocation || 'Non configuré';
  }

  // Vérifie si le stockage est prêt
  isStorageReady(): boolean {
    return this.isInitialized;
  }

  // Alias pour compatibilité
  isUsable(): boolean {
    return this.isInitialized && this.storageLocation !== null;
  }
}

export const tauriStorageAdapter = new TauriStorageAdapter();