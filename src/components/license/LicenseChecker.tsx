import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ShieldAlert, 
  Clock, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { licenseManager } from '@/utils/licenseManager';
import { toast } from 'sonner';

interface LicenseCheckerProps {
  onLicenseValid?: (isValid: boolean) => void;
}

const LicenseChecker: React.FC<LicenseCheckerProps> = ({ onLicenseValid }) => {
  const [licenseData, setLicenseData] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = async () => {
    setIsLoading(true);
    try {
      const result = await licenseManager.checkLicenseStatus();
      setLicenseData(result.license);
      setDaysRemaining(result.daysRemaining);
      
      if (onLicenseValid) {
        onLicenseValid(result.isValid);
      }
      
      // Afficher les alertes selon le statut
      if (result.license?.status === 'expired') {
        setShowExpiredModal(true);
        toast.error('Votre licence a expiré. Veuillez la renouveler pour continuer.');
      } else if (result.license?.status === 'trial' && result.daysRemaining <= 7) {
        toast.warning(`Il ne vous reste que ${result.daysRemaining} jours d'essai.`);
      } else if (result.license?.status === 'trial' && result.daysRemaining <= 30) {
        toast.info(`Période d'essai : ${result.daysRemaining} jours restants.`);
      }
    } catch (error) {
      console.error('Erreur vérification licence:', error);
      toast.error('Erreur lors de la vérification de la licence');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!licenseData) return 'text-gray-500';
    
    switch (licenseData.status) {
      case 'active':
        return 'text-green-600';
      case 'trial':
        return daysRemaining <= 7 ? 'text-orange-600' : 'text-blue-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressValue = () => {
    if (!licenseData || licenseData.status !== 'trial') return 100;
    
    const totalDays = licenseData.maxTrialDays;
    const remainingDays = daysRemaining;
    return Math.max(0, (remainingDays / totalDays) * 100);
  };

  const getProgressColor = () => {
    const progress = getProgressValue();
    if (progress <= 20) return 'bg-red-500';
    if (progress <= 40) return 'bg-orange-500';
    if (progress <= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Vérification de la licence...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showExpiredModal && licenseData?.status === 'expired') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96 border-red-500">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <ShieldAlert className="h-6 w-6" />
              Licence Expirée
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Votre licence a expiré.</strong>
                <br />
                Pour continuer à utiliser cette application, veuillez renouveler votre licence.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Prix :</strong> {licenseManager.getLicensePrice().toLocaleString()} FCFA / an</p>
              <p><strong>Contact :</strong> support@anor-littoral.fr</p>
            </div>
            
            <div className="mt-6 flex gap-2">
              <Button 
                onClick={() => window.location.href = '/settings'} 
                className="flex-1"
              >
                Activer une licence
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowExpiredModal(false)}
              >
                Fermer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Widget de statut compact pour la navbar ou sidebar
  return (
    <div className="flex items-center gap-2 text-sm">
      <Shield className={`h-4 w-4 ${getStatusColor()}`} />
      <span className={getStatusColor()}>
        {licenseData?.status === 'active' && 'Licence Active'}
        {licenseData?.status === 'trial' && `Essai: ${daysRemaining}j`}
        {licenseData?.status === 'expired' && 'Expiré'}
        {!licenseData && 'Non configuré'}
      </span>
      
      {licenseData?.status === 'trial' && (
        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${getProgressValue()}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default LicenseChecker;