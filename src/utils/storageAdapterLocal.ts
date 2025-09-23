import { IncomingMail, OutgoingMail } from '@/types/mail';

export class LocalStorageAdapter {
  private readonly INCOMING_MAILS_KEY = 'mail-app-incoming-mails';
  private readonly OUTGOING_MAILS_KEY = 'mail-app-outgoing-mails';
  
  constructor() {}

  // Méthodes pour les courriers entrants
  async saveIncomingMail(mail: IncomingMail): Promise<void> {
    try {
      const existingMails = await this.getAllIncomingMails();
      const updatedMails = [...existingMails, mail];
      localStorage.setItem(this.INCOMING_MAILS_KEY, JSON.stringify(updatedMails));
    } catch (error) {
      console.error('Erreur sauvegarde courrier entrant:', error);
      throw error;
    }
  }

  async updateIncomingMail(mailId: string, updatedMail: IncomingMail): Promise<boolean> {
    try {
      const existingMails = await this.getAllIncomingMails();
      const mailIndex = existingMails.findIndex(mail => mail.id === mailId);
      
      if (mailIndex === -1) {
        return false;
      }

      existingMails[mailIndex] = { ...existingMails[mailIndex], ...updatedMail };
      localStorage.setItem(this.INCOMING_MAILS_KEY, JSON.stringify(existingMails));
      return true;
    } catch (error) {
      console.error('Erreur mise à jour courrier entrant:', error);
      return false;
    }
  }

  async getAllIncomingMails(): Promise<IncomingMail[]> {
    try {
      const data = localStorage.getItem(this.INCOMING_MAILS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur récupération courriers entrants:', error);
      return [];
    }
  }

  async deleteIncomingMail(mailId: string): Promise<boolean> {
    try {
      const existingMails = await this.getAllIncomingMails();
      const filteredMails = existingMails.filter(mail => mail.id !== mailId);
      
      if (filteredMails.length === existingMails.length) {
        return false; // Aucun mail trouvé avec cet ID
      }

      localStorage.setItem(this.INCOMING_MAILS_KEY, JSON.stringify(filteredMails));
      return true;
    } catch (error) {
      console.error('Erreur suppression courrier entrant:', error);
      return false;
    }
  }

  // Méthodes pour les courriers sortants
  async saveOutgoingMail(mail: OutgoingMail): Promise<void> {
    try {
      const existingMails = await this.getAllOutgoingMails();
      const updatedMails = [...existingMails, mail];
      localStorage.setItem(this.OUTGOING_MAILS_KEY, JSON.stringify(updatedMails));
    } catch (error) {
      console.error('Erreur sauvegarde courrier sortant:', error);
      throw error;
    }
  }

  async updateOutgoingMail(mailId: string, updatedMail: OutgoingMail): Promise<boolean> {
    try {
      const existingMails = await this.getAllOutgoingMails();
      const mailIndex = existingMails.findIndex(mail => mail.id === mailId);
      
      if (mailIndex === -1) {
        return false;
      }

      existingMails[mailIndex] = { ...existingMails[mailIndex], ...updatedMail };
      localStorage.setItem(this.OUTGOING_MAILS_KEY, JSON.stringify(existingMails));
      return true;
    } catch (error) {
      console.error('Erreur mise à jour courrier sortant:', error);
      return false;
    }
  }

  async getAllOutgoingMails(): Promise<OutgoingMail[]> {
    try {
      const data = localStorage.getItem(this.OUTGOING_MAILS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur récupération courriers sortants:', error);
      return [];
    }
  }

  async deleteOutgoingMail(mailId: string): Promise<boolean> {
    try {
      const existingMails = await this.getAllOutgoingMails();
      const filteredMails = existingMails.filter(mail => mail.id !== mailId);
      
      if (filteredMails.length === existingMails.length) {
        return false; // Aucun mail trouvé avec cet ID
      }

      localStorage.setItem(this.OUTGOING_MAILS_KEY, JSON.stringify(filteredMails));
      return true;
    } catch (error) {
      console.error('Erreur suppression courrier sortant:', error);
      return false;
    }
  }

  // Méthodes utilitaires
  async exportData(): Promise<boolean> {
    try {
      const incomingMails = await this.getAllIncomingMails();
      const outgoingMails = await this.getAllOutgoingMails();
      
      const exportData = {
        incomingMails,
        outgoingMails,
        exportDate: new Date().toISOString()
      };

      // Créer un blob et déclencher le téléchargement
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `courriers-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Erreur export données:', error);
      return false;
    }
  }

  async importData(): Promise<boolean> {
    // Placeholder pour l'import - pourrait être implémenté avec un input file
    console.log('Import non implémenté pour localStorage');
    return false;
  }

  // Méthodes de vérification
  isUsingFileSystem(): boolean {
    return false;
  }

  isFileSystemSupported(): boolean {
    return false;
  }

  getStorageLocation(): string {
    return 'localStorage';
  }

  isStorageReady(): boolean {
    return true;
  }

  isUsable(): boolean {
    return true;
  }

  async enableFileSystemStorage(): Promise<boolean> {
    return false; // Pas applicable pour localStorage
  }
}

export const localStorageAdapter = new LocalStorageAdapter();