import { storageAdapter } from './storageAdapter';

export interface AppConfig {
  serviceName: string;
  logoPath: string;
  customLogo: string | null;
  defaultSettings: {
    theme: 'light' | 'dark';
    language: 'fr' | 'en';
    autoSave: boolean;
    backupFrequency: number; // minutes
  };
}

const defaultConfig: AppConfig = {
  serviceName: 'ANOR - Service Technique',
  logoPath: '/lovable-uploads/b5287aa5-72f8-436b-95be-6d1a0e22b700.png',
  customLogo: null,
  defaultSettings: {
    theme: 'light',
    language: 'fr',
    autoSave: true,
    backupFrequency: 5
  }
};

class ConfigManager {
  private configFile = 'app-config.json';

  async loadConfig(): Promise<AppConfig> {
    try {
      if (storageAdapter.isUsable()) {
        // Pour Tauri, lire directement le fichier de config
        const filePath = `${storageAdapter.getStorageLocation()}/app-config.json`;
        const configData = await import('./tauriBridge').then(({ tauriBridge }) => 
          tauriBridge.readFile(filePath)
        );
        if (configData) {
          const parsed = JSON.parse(configData);
          return { ...defaultConfig, ...parsed };
        }
      }
      
      // Première utilisation - créer la config par défaut
      await this.saveConfig(defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Erreur chargement configuration:', error);
      return defaultConfig;
    }
  }

  async saveConfig(config: AppConfig): Promise<void> {
    try {
      if (storageAdapter.isUsable()) {
        // Pour Tauri, écrire directement le fichier de config
        const filePath = `${storageAdapter.getStorageLocation()}/app-config.json`;
        await import('./tauriBridge').then(({ tauriBridge }) => 
          tauriBridge.writeFile(filePath, JSON.stringify(config, null, 2))
        );
      }
    } catch (error) {
      console.error('Erreur sauvegarde configuration:', error);
      throw error;
    }
  }

  async updateServiceName(newName: string): Promise<void> {
    const config = await this.loadConfig();
    config.serviceName = newName;
    await this.saveConfig(config);
  }

  async updateCustomLogo(logoData: string): Promise<void> {
    const config = await this.loadConfig();
    config.customLogo = logoData;
    await this.saveConfig(config);
  }
}

export const configManager = new ConfigManager();