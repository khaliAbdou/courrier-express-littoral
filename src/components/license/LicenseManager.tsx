import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Clock, 
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { licenseManager } from '@/utils/licenseManager';
import { toast } from 'sonner';

const LicenseManagerComponent: React.FC = () => {
  const [licenseData, setLicenseData] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [activationKey, setActivationKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showActivation, setShowActivation] = useState(false);

  useEffect(() => {
    loadLicenseData();
  }, []);

  const loadLicenseData = async () => {
    try {
      const result = await licenseManager.checkLicenseStatus();
      setLicenseData(result.license);
      setDaysRemaining(result.daysRemaining);
      
      if (result.license?.status === 'expired') {
        toast.error('Votre licence a expiré. Veuillez la renouveler.');
      } else if (result.license?.status === 'trial' && result.daysRemaining <= 7) {
        toast.warning(`Il ne vous reste que ${result.daysRemaining} jours d'essai.`);
      }
    } catch (error) {
      console.error('Erreur chargement licence:', error);
      toast.error('Erreur lors du chargement de la licence');
    }
  };

  const handleActivation = async () => {
    if (!activationKey.trim()) {
      toast.error('Veuillez saisir une clé d\'activation');
      return;
    }

    setIsLoading(true);
    try {
      const result = await licenseManager.activateLicense(activationKey);
      if (result.success) {
        toast.success(result.message);
        setShowActivation(false);
        setActivationKey('');
        await loadLicenseData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'activation');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoKey = () => {
    const key = licenseManager.generateActivationKey();
    setActivationKey(key);
    toast.info('Clé de démonstration générée (ne fonctionne pas en production)');
  };

  const getStatusIcon = () => {
    if (!licenseData) return <Shield className="h-5 w-5" />;
    
    switch (licenseData.status) {
      case 'active':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'trial':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'expired':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getStatusBadge = () => {
    if (!licenseData) return null;
    
    switch (licenseData.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Licence Active</Badge>;
      case 'trial':
        return <Badge variant="secondary">Version d'Essai</Badge>;
      case 'expired':
        return <Badge variant="destructive">Licence Expirée</Badge>;
      default:
        return null;
    }
  };

  const getProgressValue = () => {
    if (!licenseData || licenseData.status !== 'trial') return 100;
    
    const totalDays = licenseData.maxTrialDays;
    const remainingDays = daysRemaining;
    return Math.max(0, (remainingDays / totalDays) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Statut de la licence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Statut de la Licence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">État actuel :</span>
            {getStatusBadge()}
          </div>

          {licenseData && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Temps restant :</span>
                  <span className="font-medium">
                    {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
                  </span>
                </div>
                
                {licenseData.status === 'trial' && (
                  <Progress value={getProgressValue()} className="h-2" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Activation :</span>
                  <p className="font-medium">{formatDate(licenseData.activationDate)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Expiration :</span>
                  <p className="font-medium">{formatDate(licenseData.expirationDate)}</p>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">ID Utilisateur :</span>
                <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                  {licenseData.userId}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Informations tarifaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informations Licence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Version d'Essai</h4>
              <p className="text-2xl font-bold text-blue-700">GRATUIT</p>
              <p className="text-sm text-blue-600">{licenseManager.getTrialDuration()} jours</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Licence Complète</h4>
              <p className="text-2xl font-bold text-green-700">
                {licenseManager.getLicensePrice().toLocaleString()} FCFA
              </p>
              <p className="text-sm text-green-600">Par utilisateur / an</p>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Fonctionnalités complètes :</strong> Stockage illimité, rapports avancés, 
              configuration personnalisée, support technique prioritaire.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Activation de licence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Activation de Licence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showActivation ? (
            <Button 
              onClick={() => setShowActivation(true)}
              className="w-full"
              disabled={licenseData?.status === 'active'}
            >
              {licenseData?.status === 'active' ? 'Licence Déjà Active' : 'Activer une Licence'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Clé d'Activation :</label>
                <Input
                  type="text"
                  placeholder="ANOR-XXXX-XXXX-XXXX-XXXX"
                  value={activationKey}
                  onChange={(e) => setActivationKey(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format requis : ANOR-XXXX-XXXX-XXXX-XXXX
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleActivation}
                  disabled={isLoading || !activationKey.trim()}
                  className="flex-1"
                >
                  {isLoading ? 'Activation...' : 'Activer'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowActivation(false)}
                >
                  Annuler
                </Button>
              </div>

              <Button 
                variant="ghost" 
                onClick={generateDemoKey}
                className="w-full text-xs"
              >
                Générer clé de démonstration (développement uniquement)
              </Button>
            </div>
          )}

          <Alert>
            <AlertDescription className="text-sm">
              Pour obtenir une clé d'activation, contactez notre équipe commerciale ou 
              visitez notre site web. La licence est valable 1 an à compter de l'activation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseManagerComponent;