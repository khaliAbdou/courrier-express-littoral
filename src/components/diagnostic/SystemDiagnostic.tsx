import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download, 
  RefreshCw,
  Info
} from 'lucide-react';
import { deploymentHelpers } from '@/utils/deploymentHelpers';
import { toast } from 'sonner';

const SystemDiagnostic: React.FC = () => {
  const [deploymentInfo, setDeploymentInfo] = useState<any>(null);
  const [compatibility, setCompatibility] = useState<any>(null);
  const [productionCheck, setProductionCheck] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setIsLoading(true);
    try {
      const [info, compat, prod] = await Promise.all([
        deploymentHelpers.getDeploymentInfo(),
        deploymentHelpers.checkSystemCompatibility(),
        deploymentHelpers.prepareForProduction()
      ]);
      
      setDeploymentInfo(info);
      setCompatibility(compat);
      setProductionCheck(prod);
    } catch (error) {
      toast.error('Erreur lors du diagnostic système');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportDiagnostic = async () => {
    setIsExporting(true);
    try {
      await deploymentHelpers.exportDiagnosticReport();
      toast.success('Rapport de diagnostic exporté');
    } catch (error) {
      toast.error('Erreur lors de l\'export du rapport');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return <Badge className="bg-green-100 text-green-800">OK</Badge>;
      case 'warning':
        return <Badge variant="secondary">Attention</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Diagnostic système en cours...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Informations Système
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Version</p>
            <p className="font-semibold">{deploymentInfo?.appVersion}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Plateforme</p>
            <p className="font-semibold">{deploymentInfo?.platform}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Environnement</p>
            <p className="font-semibold">
              {deploymentInfo?.isElectron ? 'Desktop' : 'Navigateur'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stockage</p>
            <p className="font-semibold capitalize">{deploymentInfo?.storageMode}</p>
          </div>
        </CardContent>
      </Card>

      {/* Compatibilité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Compatibilité Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-medium">Statut global :</span>
            {compatibility?.compatible ? (
              <Badge className="bg-green-100 text-green-800">Compatible</Badge>
            ) : (
              <Badge variant="destructive">Incompatible</Badge>
            )}
          </div>

          {compatibility?.issues?.length > 0 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Problèmes détectés :</strong>
                <ul className="list-disc list-inside mt-2">
                  {compatibility.issues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {compatibility?.recommendations?.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Recommandations :</strong>
                <ul className="list-disc list-inside mt-2">
                  {compatibility.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Préparation production */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Préparation Production
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <span className="font-medium">Prêt pour production :</span>
            {productionCheck?.ready ? (
              <Badge className="bg-green-100 text-green-800">OUI</Badge>
            ) : (
              <Badge variant="destructive">NON</Badge>
            )}
          </div>

          <div className="space-y-3">
            {productionCheck?.checklist?.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <span className="font-medium">{item.item}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.message && (
                    <span className="text-sm text-muted-foreground">{item.message}</span>
                  )}
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={runDiagnostic} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser le diagnostic
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportDiagnostic}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Export...' : 'Exporter le rapport'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDiagnostic;