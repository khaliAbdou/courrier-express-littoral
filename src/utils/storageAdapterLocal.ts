import { IncomingMail, OutgoingMail } from '@/types/mail';
import { MailStorageData } from '@/types/fileSystemAccess';

class LocalStorageAdapter {
  private readonly STORAGE_KEY = 'anor-mail-data';
  private readonly CONFIG_KEY = 'anor-app-config';

  // Sauvegarde un courrier entrant
  async saveIncomingMail(mail: any): Promise<void> {
    try {
      const data = this.loadData();
      data.incomingMails.push(mail);
      data.lastModified = new Date().toISOString();
      this.saveData(data);
    } catch (error) {
      console.error('Erreur sauvegarde courrier entrant (localStorage):', error);
      throw error;
    }
  }

  // Sauvegarde un courrier sortant
  async saveOutgoingMail(mail: any): Promise<void> {
    try {
      const data = this.loadData();
      data.outgoingMails.push(mail);
      data.lastModified = new Date().toISOString();
      this.saveData(data);
    } catch (error) {
      console.error('Erreur sauvegarde courrier sortant (localStorage):', error);
      throw error;
    }
  }

  // Met à jour un courrier entrant
  async updateIncomingMail(mailId: string, updatedMail: any): Promise<boolean> {
    try {
      const data = this.loadData();
      const index = data.incomingMails.findIndex(mail => mail.id === mailId);
      if (index !== -1) {
        data.incomingMails[index] = { ...data.incomingMails[index], ...updatedMail };
        data.lastModified = new Date().toISOString();
        this.saveData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur mise à jour courrier entrant (localStorage):', error);
      return false;
    }
  }

  // Met à jour un courrier sortant
  async updateOutgoingMail(mailId: string, updatedMail: any): Promise<boolean> {
    try {
      const data = this.loadData();
      const index = data.outgoingMails.findIndex(mail => mail.id === mailId);
      if (index !== -1) {
        data.outgoingMails[index] = { ...data.outgoingMails[index], ...updatedMail };
        data.lastModified = new Date().toISOString();
        this.saveData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur mise à jour courrier sortant (localStorage):', error);
      return false;
    }
  }

  // Récupère tous les courriers entrants
  async getAllIncomingMails(): Promise<IncomingMail[]> {
    try {
      const data = this.loadData();
      return data.incomingMails.map((mail: any) => ({
        ...mail,
        date: mail.date ? new Date(mail.date) : undefined,
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
        responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
      }));
    } catch (error) {
      console.error('Erreur récupération courriers entrants (localStorage):', error);
      return [];
    }
  }

  // Récupère tous les courriers sortants
  async getAllOutgoingMails(): Promise<OutgoingMail[]> {
    try {
      const data = this.loadData();
      return data.outgoingMails.map((mail: any) => ({
        ...mail,
        date: mail.date ? new Date(mail.date) : undefined,
        issueDate: mail.issueDate ? new Date(mail.issueDate) : undefined,
      }));
    } catch (error) {
      console.error('Erreur récupération courriers sortants (localStorage):', error);
      return [];
    }
  }

  // Supprime un courrier entrant
  async deleteIncomingMail(mailId: string): Promise<boolean> {
    try {
      const data = this.loadData();
      data.incomingMails = data.incomingMails.filter(mail => mail.id !== mailId);
      data.lastModified = new Date().toISOString();
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Erreur suppression courrier entrant (localStorage):', error);
      return false;
    }
  }

  // Supprime un courrier sortant
  async deleteOutgoingMail(mailId: string): Promise<boolean> {
    try {
      const data = this.loadData();
      data.outgoingMails = data.outgoingMails.filter(mail => mail.id !== mailId);
      data.lastModified = new Date().toISOString();
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Erreur suppression courrier sortant (localStorage):', error);
      return false;
    }
  }

  // Exporte toutes les données
  async exportData(): Promise<boolean> {
    try {
      const data = this.loadData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-courriers-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Erreur export (localStorage):', error);
      return false;
    }
  }

  // Importe des données
  async importData(): Promise<boolean> {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      return new Promise((resolve) => {
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const data = JSON.parse(event.target?.result as string);
                this.saveData(data);
                resolve(true);
              } catch {
                resolve(false);
              }
            };
            reader.readAsText(file);
          } else {
            resolve(false);
          }
        };
        input.click();
      });
    } catch (error) {
      console.error('Erreur import (localStorage):', error);
      return false;
    }
  }

  // Activation du stockage (toujours disponible)
  async enableFileSystemStorage(): Promise<boolean> {
    return true; // localStorage toujours disponible
  }

  // Vérifie si le système de fichiers est utilisé
  isUsingFileSystem(): boolean {
    return true; // localStorage toujours actif
  }

  // Vérifie si le système de fichiers est supporté
  isFileSystemSupported(): boolean {
    return typeof Storage !== 'undefined';
  }

  // Obtient l'emplacement de stockage
  getStorageLocation(): string {
    return 'Navigateur (localStorage)';
  }

  // Vérifie si le stockage est prêt
  isStorageReady(): boolean {
    return true;
  }

  // Alias pour compatibilité
  isUsable(): boolean {
    return typeof Storage !== 'undefined';
  }

  // Méthodes privées
  private loadData(): MailStorageData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur chargement localStorage:', error);
    }
    
    // Données par défaut
    return {
      incomingMails: [],
      outgoingMails: [],
      version: '1.0.0',
      lastModified: new Date().toISOString()
    };
  }

  private saveData(data: MailStorageData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur sauvegarde localStorage:', error);
      throw new Error('Impossible de sauvegarder - espace de stockage insuffisant');
    }
  }
}

export const localStorageAdapter = new LocalStorageAdapter();