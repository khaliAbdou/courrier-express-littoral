import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  ImageIcon, 
  Save,
  Info
} from 'lucide-react';
import { configManager, type AppConfig } from '@/utils/configManager';
import { toast } from 'sonner';

const AppConfiguration: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setIsLoading(true);
    try {
      const loadedConfig = await configManager.loadConfig();
      setConfig(loadedConfig);
      setServiceName(loadedConfig.serviceName);
    } catch (error) {
      toast.error('Erreur lors du chargement de la configuration');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveServiceName = async () => {
    if (!serviceName.trim()) {
      toast.error('Le nom du service ne peut pas être vide');
      return;
    }

    setIsSaving(true);
    try {
      await configManager.updateServiceName(serviceName.trim());
      setConfig(prev => prev ? { ...prev, serviceName: serviceName.trim() } : null);
      toast.success('Nom du service mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast.error('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    setIsSaving(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const logoData = e.target?.result as string;
        await configManager.updateCustomLogo(logoData);
        setConfig(prev => prev ? { ...prev, customLogo: logoData } : null);
        toast.success('Logo mis à jour');
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erreur lors du téléchargement du logo');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Impossible de charger la configuration. Veuillez redémarrer l'application.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration générale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Générale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Nom du Service</Label>
            <div className="flex gap-2">
              <Input
                id="service-name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Nom de votre service..."
              />
              <Button 
                onClick={saveServiceName}
                disabled={isSaving || serviceName === config.serviceName}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Logo Personnalisé</Label>
            <div className="flex items-center gap-4">
              {config.customLogo ? (
                <img 
                  src={config.customLogo} 
                  alt="Logo personnalisé" 
                  className="h-16 w-16 object-contain border rounded"
                />
              ) : (
                <div className="h-16 w-16 border-2 border-dashed rounded flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button 
                    asChild 
                    variant="outline" 
                    disabled={isSaving}
                  >
                    <span>Choisir un logo</span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Formats acceptés : JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              <strong>Configuration personnalisée :</strong> Tous les paramètres sont sauvegardés 
              localement sur votre système. Vos modifications sont appliquées immédiatement 
              et conservées entre les redémarrages.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppConfiguration;