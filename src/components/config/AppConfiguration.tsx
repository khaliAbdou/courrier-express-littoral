import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Building, 
  Users, 
  ImageIcon, 
  Plus, 
  Trash2, 
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
  const [selectedBureau, setSelectedBureau] = useState<string>('');
  const [newEmployee, setNewEmployee] = useState('');

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

  const addEmployee = async () => {
    if (!newEmployee.trim() || !selectedBureau) {
      toast.error('Veuillez sélectionner un bureau et saisir un nom');
      return;
    }

    setIsSaving(true);
    try {
      await configManager.addEmployee(selectedBureau, newEmployee.trim());
      const updatedConfig = await configManager.loadConfig();
      setConfig(updatedConfig);
      setNewEmployee('');
      toast.success('Employé ajouté');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setIsSaving(false);
    }
  };

  const removeEmployee = async (bureauKey: string, employeeName: string) => {
    setIsSaving(true);
    try {
      await configManager.removeEmployee(bureauKey, employeeName);
      const updatedConfig = await configManager.loadConfig();
      setConfig(updatedConfig);
      toast.success('Employé supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
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

          <Separator />

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

      {/* Gestion des bureaux et employés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Bureaux et Employés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ajout d'employé */}
          <div className="space-y-3">
            <Label>Ajouter un Employé</Label>
            <div className="flex gap-2">
              <select
                value={selectedBureau}
                onChange={(e) => setSelectedBureau(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Sélectionner un bureau</option>
                {Object.entries(config.bureaus).map(([key, bureau]) => (
                  <option key={key} value={key}>{bureau.name}</option>
                ))}
              </select>
              
              <Input
                value={newEmployee}
                onChange={(e) => setNewEmployee(e.target.value)}
                placeholder="Nom de l'employé"
                onKeyDown={(e) => e.key === 'Enter' && addEmployee()}
              />
              
              <Button 
                onClick={addEmployee}
                disabled={isSaving || !newEmployee.trim() || !selectedBureau}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Liste des bureaux et employés */}
          <div className="space-y-4">
            {Object.entries(config.bureaus).map(([bureauKey, bureau]) => (
              <div key={bureauKey} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <h4 className="font-semibold">{bureau.name}</h4>
                  <Badge variant="secondary">{bureau.employees.length} employé{bureau.employees.length > 1 ? 's' : ''}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                  {bureau.employees.map((employee, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <span className="text-sm">{employee}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmployee(bureauKey, employee)}
                        disabled={isSaving}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {bureau.employees.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      Aucun employé assigné
                    </p>
                  )}
                </div>
              </div>
            ))}
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