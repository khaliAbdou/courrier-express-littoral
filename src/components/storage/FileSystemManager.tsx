import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Plus, 
  Download, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Database
} from 'lucide-react';
import { 
  isFileSystemAccessSupported,
  openMailFile,
  createNewMailFile,
  getCurrentFileInfo
} from '@/utils/fileSystemStorage';
import { 
  migrateFromIndexedDB,
  getMigrationStatus,
  MigrationResult
} from '@/utils/dataMigration';
import { toast } from 'sonner';

interface FileSystemManagerProps {
  onFileChange?: () => void;
}

const FileSystemManager: React.FC<FileSystemManagerProps> = ({ onFileChange }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [fileInfo, setFileInfo] = useState({ hasFile: false, fileName: '' });
  const [migrationStatus, setMigrationStatus] = useState({
    hasIndexedDBData: false,
    hasFileSystemFile: false,
    needsMigration: false
  });
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    checkSupport();
    updateStatus();
  }, []);

  const checkSupport = () => {
    setIsSupported(isFileSystemAccessSupported());
  };

  const updateStatus = async () => {
    const info = getCurrentFileInfo();
    setFileInfo({
      hasFile: info.hasFile,
      fileName: info.fileName || ''
    });
    
    const status = await getMigrationStatus();
    setMigrationStatus(status);
  };

  const handleOpenFile = async () => {
    try {
      const success = await openMailFile();
      if (success) {
        toast.success('Fichier ouvert avec succès');
        await updateStatus();
        onFileChange?.();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ouverture du fichier');
    }
  };

  const handleCreateFile = async () => {
    try {
      const success = await createNewMailFile();
      if (success) {
        toast.success('Nouveau fichier créé');
        await updateStatus();
        onFileChange?.();
      }
    } catch (error) {
      toast.error('Erreur lors de la création du fichier');
    }
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const result: MigrationResult = await migrateFromIndexedDB();
      
      if (result.success) {
        toast.success(
          `Migration réussie: ${result.incomingCount} courriers entrants et ${result.outgoingCount} courriers sortants migrés`
        );
        await updateStatus();
        onFileChange?.();
      } else {
        toast.error(`Migration échouée: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      toast.error('Erreur lors de la migration');
    } finally {
      setIsMigrating(false);
    }
  };

  if (!isSupported) {
    return (
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Votre navigateur ne supporte pas l'API File System Access. 
          Les données continueront d'être stockées localement dans le navigateur.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current File Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Fichier de données
          </CardTitle>
          <CardDescription>
            Gérez vos données de courrier avec des fichiers locaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {fileInfo.hasFile ? (
                <>
                  <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3" />
                    Fichier ouvert
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {fileInfo.fileName}
                  </span>
                </>
              ) : (
                <Badge variant="secondary">Aucun fichier ouvert</Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleOpenFile}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Ouvrir un fichier
            </Button>
            
            <Button 
              onClick={handleCreateFile}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau fichier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Migration Section */}
      {migrationStatus.needsMigration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Migration des données
            </CardTitle>
            <CardDescription>
              Des données existantes ont été détectées dans le stockage local
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Vous avez des données de courrier stockées localement. 
                Vous pouvez les migrer vers un fichier pour les conserver et les partager.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleMigration}
              disabled={isMigrating}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isMigrating ? 'Migration en cours...' : 'Migrer les données'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Avec le stockage fichier, vos données sont sauvegardées dans un fichier local 
          que vous contrôlez entièrement. Vous pouvez le sauvegarder, le partager ou le déplacer.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FileSystemManager;