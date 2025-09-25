import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderOpen, Download, Upload, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';
import { storageAdapter } from '@/utils/storageAdapter';
import { toast } from 'sonner';

const FileSystemManager: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isUsingFileSystem, setIsUsingFileSystem] = useState(false);
  const [storageLocation, setStorageLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSupported(storageAdapter.isFileSystemSupported());
    setIsUsingFileSystem(storageAdapter.isUsingFileSystem());
    setStorageLocation(storageAdapter.getStorageLocation());
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
        toast.error('Sélection du dossier annulée ou impossible');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la configuration du stockage');
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Cette application nécessite un navigateur compatible avec File System Access API (Chrome/Edge 86+).
              L'API n'est pas supportée par votre navigateur actuel.
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
          Configuration du Stockage sur Disque Dur
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
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Dossier de stockage requis
            </Badge>
          )}
        </div>

        {!isSupported && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Mode navigateur détecté :</strong> L'application fonctionne en mode de développement 
              avec stockage temporaire. Les données sont sauvées localement mais pourraient être perdues.
              Pour un stockage permanent, utilisez la version exécutable (.exe).
            </AlertDescription>
          </Alert>
        )}

        {isSupported && !isUsingFileSystem && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuration optionnelle :</strong> Vous pouvez sélectionner un dossier de stockage 
              pour sauvegarder vos données directement sur le disque dur, ou continuer avec le stockage local temporaire.
            </AlertDescription>
          </Alert>
        )}

        {storageLocation && isUsingFileSystem && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Dossier de stockage configuré :</p>
            <p className="text-sm text-muted-foreground font-mono">{storageLocation}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Toutes les données sont stockées directement sur votre disque dur
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleSelectDirectory}
            disabled={isLoading}
            variant={isUsingFileSystem ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            {isUsingFileSystem ? 'Changer le dossier' : 'Choisir un dossier'}
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || !isUsingFileSystem}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter les données
          </Button>

          <Button
            variant="outline"
            onClick={handleImport}
            disabled={isLoading || !isUsingFileSystem}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importer des données
          </Button>
        </div>

          <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isSupported ? (
              <>
                <strong>Application Desktop :</strong> En mode développement, l'application utilise un stockage local temporaire. 
                Dans la version exécutable (.exe), toutes les données sont stockées directement sur votre disque dur.
              </>
            ) : (
              <>
                <strong>Mode Développement :</strong> Les données sont stockées temporairement dans le navigateur.
                Pour un stockage permanent, utilisez la version exécutable de l'application.
              </>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FileSystemManager;