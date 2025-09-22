import { useState, useEffect } from 'react';
import { configManager, AppConfig } from '@/utils/configManager';

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const loadedConfig = await configManager.loadConfig();
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Erreur chargement configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    if (!config) return false;
    
    try {
      const updatedConfig = { ...config, ...newConfig };
      await configManager.saveConfig(updatedConfig);
      setConfig(updatedConfig);
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde configuration:', error);
      return false;
    }
  };

  // Valeurs par défaut si config pas encore chargée
  const safeConfig = config || {
    serviceName: 'Service Technique - Antenne du Littoral',
    logoPath: '/lovable-uploads/b5287aa5-72f8-436b-95be-6d1a0e22b700.png',
    customLogo: null,
    defaultSettings: {
      theme: 'light' as const,
      language: 'fr' as const,
      autoSave: true,
      backupFrequency: 5
    }
  };

  return {
    config: safeConfig,
    isLoading,
    updateConfig
  };
};