import { fileSystemStorage } from './fileSystemStorage';

interface LicenseData {
  activationDate: string;
  expirationDate: string;
  userId: string;
  status: 'trial' | 'active' | 'expired';
  trialDays: number;
  maxTrialDays: number;
}

class LicenseManager {
  private licenseKey = 'anor-license-data';
  private readonly TRIAL_DAYS = 90; // 3 mois
  private readonly LICENSE_PRICE = 80000; // FCFA

  async initializeLicense(): Promise<LicenseData> {
    const existingLicense = await this.getLicenseData();
    
    if (existingLicense) {
      return this.updateLicenseStatus(existingLicense);
    }

    // Nouvelle installation - démarrer la période d'essai
    const trialLicense: LicenseData = {
      activationDate: new Date().toISOString(),
      expirationDate: this.getTrialExpirationDate(),
      userId: this.generateUserId(),
      status: 'trial',
      trialDays: this.TRIAL_DAYS,
      maxTrialDays: this.TRIAL_DAYS
    };

    await this.saveLicenseData(trialLicense);
    return trialLicense;
  }

  async getLicenseData(): Promise<LicenseData | null> {
    try {
      if (fileSystemStorage.isUsable()) {
        const data = await fileSystemStorage.readFile('license.json');
        return data ? JSON.parse(data) : null;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async saveLicenseData(license: LicenseData): Promise<void> {
    try {
      if (fileSystemStorage.isUsable()) {
        await fileSystemStorage.writeFile('license.json', JSON.stringify(license, null, 2));
      }
    } catch (error) {
      console.error('Erreur sauvegarde licence:', error);
    }
  }

  async activateLicense(activationKey: string): Promise<{ success: boolean; message: string }> {
    if (!this.validateActivationKey(activationKey)) {
      return { success: false, message: 'Clé d\'activation invalide' };
    }

    const license = await this.getLicenseData();
    if (!license) {
      return { success: false, message: 'Aucune licence trouvée' };
    }

    const activatedLicense: LicenseData = {
      ...license,
      status: 'active',
      expirationDate: this.getFullLicenseExpirationDate(),
      activationDate: new Date().toISOString()
    };

    await this.saveLicenseData(activatedLicense);
    return { success: true, message: 'Licence activée avec succès!' };
  }

  async checkLicenseStatus(): Promise<{ isValid: boolean; license: LicenseData | null; daysRemaining: number }> {
    const license = await this.getLicenseData();
    
    if (!license) {
      const newLicense = await this.initializeLicense();
      return { 
        isValid: true, 
        license: newLicense, 
        daysRemaining: this.TRIAL_DAYS 
      };
    }

    const updatedLicense = this.updateLicenseStatus(license);
    const daysRemaining = this.getRemainingDays(updatedLicense);
    const isValid = updatedLicense.status !== 'expired';

    if (updatedLicense.status !== license.status) {
      await this.saveLicenseData(updatedLicense);
    }

    return { isValid, license: updatedLicense, daysRemaining };
  }

  private updateLicenseStatus(license: LicenseData): LicenseData {
    const now = new Date();
    const expiration = new Date(license.expirationDate);
    
    if (now > expiration) {
      return { ...license, status: 'expired' };
    }
    
    return license;
  }

  private getRemainingDays(license: LicenseData): number {
    const now = new Date();
    const expiration = new Date(license.expirationDate);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  private getTrialExpirationDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + this.TRIAL_DAYS);
    return date.toISOString();
  }

  private getFullLicenseExpirationDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1); // 1 an
    return date.toISOString();
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private validateActivationKey(key: string): boolean {
    // Format: ANOR-XXXX-XXXX-XXXX-XXXX
    const pattern = /^ANOR-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(key);
  }

  getLicensePrice(): number {
    return this.LICENSE_PRICE;
  }

  getTrialDuration(): number {
    return this.TRIAL_DAYS;
  }

  generateActivationKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'ANOR-';
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 3) key += '-';
    }
    
    return key;
  }
}

export const licenseManager = new LicenseManager();