// Interface pour l'API Electron
interface ElectronAPI {
  selectDirectory: () => Promise<string | null>;
  readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  listFiles: (dirPath: string) => Promise<{ success: boolean; files?: string[]; error?: string }>;
  checkLicense: () => Promise<{ valid: boolean; daysRemaining: number }>;
  platform: string;
  versions: any;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

class ElectronBridge {
  // Vérifie si nous sommes dans un environnement Electron
  isElectron(): boolean {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }

  // Vérifie la plateforme
  getPlatform(): string {
    if (this.isElectron()) {
      return window.electronAPI!.platform;
    }
    return navigator.platform;
  }

  // Sélectionne un dossier via Electron
  async selectDirectory(): Promise<string | null> {
    if (!this.isElectron()) {
      console.warn('selectDirectory non disponible hors Electron');
      return null;
    }

    try {
      return await window.electronAPI!.selectDirectory();
    } catch (error) {
      console.error('Erreur sélection dossier Electron:', error);
      return null;
    }
  }

  // Lit un fichier via Electron
  async readFile(filePath: string): Promise<string | null> {
    if (!this.isElectron()) {
      console.warn('readFile non disponible hors Electron');
      return null;
    }

    try {
      const result = await window.electronAPI!.readFile(filePath);
      return result.success ? (result.data || null) : null;
    } catch (error) {
      console.error('Erreur lecture fichier Electron:', error);
      return null;
    }
  }

  // Écrit un fichier via Electron
  async writeFile(filePath: string, content: string): Promise<boolean> {
    if (!this.isElectron()) {
      console.warn('writeFile non disponible hors Electron');
      return false;
    }

    try {
      const result = await window.electronAPI!.writeFile(filePath, content);
      return result.success;
    } catch (error) {
      console.error('Erreur écriture fichier Electron:', error);
      return false;
    }
  }

  // Liste les fichiers d'un dossier via Electron
  async listFiles(dirPath: string): Promise<string[]> {
    if (!this.isElectron()) {
      console.warn('listFiles non disponible hors Electron');
      return [];
    }

    try {
      const result = await window.electronAPI!.listFiles(dirPath);
      return result.success ? (result.files || []) : [];
    } catch (error) {
      console.error('Erreur listage fichiers Electron:', error);
      return [];
    }
  }

  // Vérifie la licence via Electron
  async checkLicense(): Promise<{ valid: boolean; daysRemaining: number }> {
    if (!this.isElectron()) {
      console.warn('checkLicense non disponible hors Electron');
      return { valid: true, daysRemaining: 90 }; // Mode développement
    }

    try {
      return await window.electronAPI!.checkLicense();
    } catch (error) {
      console.error('Erreur vérification licence Electron:', error);
      return { valid: false, daysRemaining: 0 };
    }
  }

  // Obtient les versions des composants
  getVersions(): any {
    if (this.isElectron()) {
      return window.electronAPI!.versions;
    }
    return {
      node: 'N/A',
      chrome: 'N/A',
      electron: 'N/A'
    };
  }

  // Détermine le mode de stockage optimal
  getOptimalStorageMode(): 'electron' | 'filesystem' | 'fallback' {
    if (this.isElectron()) {
      return 'electron';
    }
    
    if ('showDirectoryPicker' in window) {
      return 'filesystem';
    }
    
    return 'fallback';
  }
}

export const electronBridge = new ElectronBridge();