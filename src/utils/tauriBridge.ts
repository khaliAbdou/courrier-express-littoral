// Bridge Tauri - Version compatible pour développement et production
// Pas d'imports directs de Tauri pour éviter les erreurs en mode développement

// Déclaration globale pour Tauri (disponible uniquement en production)
declare global {
  interface Window {
    __TAURI__?: {
      invoke: (cmd: string, args?: any) => Promise<any>;
    };
  }
}

export interface TauriAPI {
  selectDirectory(): Promise<string | null>;
  readFile(filePath: string): Promise<string | null>;
  writeFile(filePath: string, content: string): Promise<boolean>;
  listFiles(dirPath: string): Promise<string[]>;
  checkLicense(): Promise<{ valid: boolean; daysRemaining: number }>;
  platform: string;
  versions: any;
}

// Fonction invoke sécurisée pour éviter les erreurs d'import
const invoke = async (cmd: string, args?: any): Promise<any> => {
  if (typeof window !== 'undefined' && window.__TAURI__?.invoke) {
    try {
      return await window.__TAURI__.invoke(cmd, args);
    } catch (error) {
      console.error(`Erreur Tauri invoke ${cmd}:`, error);
      throw error;
    }
  }
  throw new Error('Tauri non disponible - Application en mode développement');
};

class TauriBridge {
  private _platform: string | null = null;
  private _versions: any = null;

  /**
   * Vérifie si l'application s'exécute dans Tauri
   */
  isTauri(): boolean {
    return typeof window !== 'undefined' && 
           window.__TAURI__ !== undefined && 
           typeof window.__TAURI__.invoke === 'function';
  }

  /**
   * Obtient la plateforme système
   */
  async getPlatform(): Promise<string> {
    if (!this.isTauri()) {
      return navigator.platform;
    }

    if (!this._platform) {
      try {
        // Utiliser invoke pour obtenir la plateforme
        this._platform = await invoke('get_platform') || navigator.platform;
      } catch (error) {
        console.error('Erreur obtention plateforme:', error);
        this._platform = navigator.platform;
      }
    }

    return this._platform;
  }

  /**
   * Ouvre un sélecteur de dossier
   */
  async selectDirectory(): Promise<string | null> {
    if (!this.isTauri()) {
      console.warn('Tauri non disponible - Mode développement détecté');
      return null;
    }

    try {
      const selected = await invoke('select_directory');
      return selected || null;
    } catch (error) {
      console.error('Erreur sélection dossier:', error);
      return null;
    }
  }

  /**
   * Lit le contenu d'un fichier
   */
  async readFile(filePath: string): Promise<string | null> {
    if (!this.isTauri()) {
      throw new Error('Tauri requis pour la lecture de fichier');
    }

    try {
      const content = await invoke('read_file', { filePath });
      return content;
    } catch (error) {
      console.error('Erreur lecture fichier:', error);
      return null;
    }
  }

  /**
   * Écrit du contenu dans un fichier
   */
  async writeFile(filePath: string, content: string): Promise<boolean> {
    if (!this.isTauri()) {
      throw new Error('Tauri requis pour l\'écriture de fichier');
    }

    try {
      await invoke('write_file', { filePath, content });
      return true;
    } catch (error) {
      console.error('Erreur écriture fichier:', error);
      return false;
    }
  }

  /**
   * Liste les fichiers d'un dossier
   */
  async listFiles(dirPath: string): Promise<string[]> {
    if (!this.isTauri()) {
      throw new Error('Tauri requis pour lister les fichiers');
    }

    try {
      const files = await invoke('list_files', { dirPath });
      return files;
    } catch (error) {
      console.error('Erreur liste fichiers:', error);
      return [];
    }
  }

  /**
   * Vérifie le statut de la licence
   */
  async checkLicense(): Promise<{ valid: boolean; daysRemaining: number }> {
    if (!this.isTauri()) {
      return { valid: true, daysRemaining: 90 };
    }

    try {
      const license = await invoke('check_license');
      return license;
    } catch (error) {
      console.error('Erreur vérification licence:', error);
      return { valid: false, daysRemaining: 0 };
    }
  }

  /**
   * Obtient les versions de l'application
   */
  async getVersions(): Promise<any> {
    if (!this.isTauri()) {
      return {
        tauri: 'N/A',
        app: 'N/A'
      };
    }

    if (!this._versions) {
      try {
        const appVersion = await invoke('get_app_version');
        this._versions = {
          tauri: '1.5.0',
          app: appVersion || '1.0.0'
        };
      } catch (error) {
        console.error('Erreur obtention versions:', error);
        this._versions = {
          tauri: 'N/A',
          app: 'N/A'
        };
      }
    }

    return this._versions;
  }

  /**
   * Détermine le mode de stockage optimal
   */
  getOptimalStorageMode(): 'tauri' | 'fallback' {
    if (this.isTauri()) {
      return 'tauri';
    }
    return 'fallback';
  }
}

export const tauriBridge = new TauriBridge();