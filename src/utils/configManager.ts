import { fileSystemStorage } from './fileSystemStorage';

export interface AppConfig {
  serviceName: string;
  logoPath: string;
  customLogo: string | null;
  bureaus: {
    [key: string]: {
      name: string;
      employees: string[];
    };
  };
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
  bureaus: {
    normalisation: {
      name: 'Normalisation',
      employees: ['Jean Dupont', 'Marie Martin']
    },
    promotion: {
      name: 'Promotion', 
      employees: ['Kome Ntengue', 'Amougou Noelle']
    },
    controle: {
      name: 'Contrôle Qualité',
      employees: ['Pierre Durand', 'Sophie Lambert']
    },
    pecae: {
      name: 'PECAE',
      employees: ['Michel Bernard', 'Julie Moreau']
    },
    certification: {
      name: 'Certification Produits Locaux',
      employees: ['Ngam Giovanni', 'Ondoa Magalie']
    }
  },
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
      if (fileSystemStorage.isUsable()) {
        const configData = await fileSystemStorage.readFile(this.configFile);
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
      if (fileSystemStorage.isUsable()) {
        await fileSystemStorage.writeFile(this.configFile, JSON.stringify(config, null, 2));
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

  async updateBureauEmployees(bureauKey: string, employees: string[]): Promise<void> {
    const config = await this.loadConfig();
    if (config.bureaus[bureauKey]) {
      config.bureaus[bureauKey].employees = employees;
      await this.saveConfig(config);
    }
  }

  async addEmployee(bureauKey: string, employeeName: string): Promise<void> {
    const config = await this.loadConfig();
    if (config.bureaus[bureauKey] && !config.bureaus[bureauKey].employees.includes(employeeName)) {
      config.bureaus[bureauKey].employees.push(employeeName);
      await this.saveConfig(config);
    }
  }

  async removeEmployee(bureauKey: string, employeeName: string): Promise<void> {
    const config = await this.loadConfig();
    if (config.bureaus[bureauKey]) {
      config.bureaus[bureauKey].employees = config.bureaus[bureauKey].employees.filter(
        emp => emp !== employeeName
      );
      await this.saveConfig(config);
    }
  }

  async getAllEmployees(): Promise<string[]> {
    const config = await this.loadConfig();
    const employees: string[] = [];
    
    Object.values(config.bureaus).forEach(bureau => {
      employees.push(...bureau.employees);
    });
    
    return [...new Set(employees)].sort();
  }

  async getEmployeesByBureau(): Promise<Record<string, string[]>> {
    const config = await this.loadConfig();
    const result: Record<string, string[]> = {};
    
    Object.entries(config.bureaus).forEach(([key, bureau]) => {
      result[bureau.name] = bureau.employees;
    });
    
    return result;
  }
}

export const configManager = new ConfigManager();