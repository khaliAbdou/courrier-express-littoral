import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderOpen, Download, Upload, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';
import { storageAdapter } from '@/utils/storageAdapter';
import { fileSystemStorage } from '@/utils/fileSystemStorage';
import { toast } from 'sonner';

const FileSystemManager: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isUsable, setIsUsable] = useState(false);
  const [isUsingFileSystem, setIsUsingFileSystem] = useState(false);
  const [storageLocation, setStorageLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      const supported = storageAdapter.isFileSystemSupported();
      setIsSupported(supported);
      
      if (supported) {
        const usable = await fileSystemStorage.isUsable();
        setIsUsable(usable);
      }
      
      setIsUsingFileSystem(storageAdapter.isUsingFileSystem());
      setStorageLocation(storageAdapter.getStorageLocation());
    };
    
    checkAvailability();
  }, []);

  const handleSelectDirectory = async () => {
    setIsLoading(true);
    try {
      const success = await storageAdapter.enableFileSystemStorage();
      if (success) {
        setIsUsingFileSystem(true);
        setStorageLocation(storageAdapter.getStorageLocation());
        toast.success('Dossier de stockage configuré avec succès !');
      } else {
        toast.error('Impossible de configurer le dossier de stockage');
      }
    } catch (error) {
      toast.error('Erreur lors de la configuration du stockage');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const success = await storageAdapter.exportData();
      if (success) {
        toast.success('Données exportées avec succès !');
      } else {
        toast.error('Erreur lors de l\'export des données');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'export');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const success = await storageAdapter.importData();
      if (success) {
        toast.success('Données importées avec succès !');
        // Forcer le rechargement de la page pour actualiser les données
        window.location.reload();
      } else {
        toast.error('Erreur lors de l\'import des données');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'import');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Stockage sur Disque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Votre navigateur ne supporte pas l'API File System Access. 
              Cette fonctionnalité nécessite Chrome 86+ ou Edge 86+.
              Les données sont stockées localement dans le navigateur.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Gestion du Stockage sur Disque
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Statut :</span>
          {isUsingFileSystem ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Stockage sur disque activé
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Stockage navigateur uniquement
            </Badge>
          )}
        </div>

        {storageLocation && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Dossier de stockage :</p>
            <p className="text-sm text-muted-foreground">{storageLocation}</p>
          </div>
        )}

        {!isUsable && isSupported && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Le stockage sur disque n'est pas disponible dans l'environnement de prévisualisation.
              Cette fonctionnalité sera disponible lorsque vous déploierez votre application.
              En attendant, les données sont stockées localement dans le navigateur.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleSelectDirectory}
            disabled={isLoading || !isUsable}
            className="flex items-center gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            {isUsingFileSystem ? 'Changer le dossier' : 'Choisir un dossier'}
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || !isUsable}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter les données
          </Button>

          <Button
            variant="outline"
            onClick={handleImport}
            disabled={isLoading || !isUsable}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importer des données
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Stockage sur disque :</strong> Vos données seront sauvegardées dans le dossier que vous choisissez.
            Vous gardez le contrôle total de vos fichiers et pouvez les sauvegarder ou les partager facilement.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FileSystemManager;