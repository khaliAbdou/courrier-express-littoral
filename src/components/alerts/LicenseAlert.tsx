import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Shield, Clock, AlertTriangle } from 'lucide-react';
import { licenseManager } from '@/utils/licenseManager';
import { Link } from 'react-router-dom';

const LicenseAlert: React.FC = () => {
  const [licenseData, setLicenseData] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkLicenseStatus();
  }, []);

  const checkLicenseStatus = async () => {
    try {
      const result = await licenseManager.checkLicenseStatus();
      setLicenseData(result.license);
      setDaysRemaining(result.daysRemaining);
      
      // Afficher l'alerte si nécessaire
      const shouldShow = result.license?.status === 'trial' && result.daysRemaining <= 30;
      setShowAlert(shouldShow && !dismissed);
    } catch (error) {
      console.error('Erreur vérification licence:', error);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowAlert(false);
    // Sauvegarder la dismissal pour cette session
    sessionStorage.setItem('license-alert-dismissed', 'true');
  };

  useEffect(() => {
    // Vérifier si l'alerte a déjà été dismissée pour cette session
    const wasDismissed = sessionStorage.getItem('license-alert-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (!showAlert || !licenseData) {
    return null;
  }

  const getAlertVariant = () => {
    if (daysRemaining <= 7) return 'destructive';
    if (daysRemaining <= 14) return 'default';
    return 'default';
  };

  const getIcon = () => {
    if (daysRemaining <= 7) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getMessage = () => {
    if (daysRemaining <= 7) {
      return `Attention ! Il ne vous reste que ${daysRemaining} jour(s) d'essai. Votre accès sera bientôt limité.`;
    }
    if (daysRemaining <= 14) {
      return `Votre période d'essai se termine dans ${daysRemaining} jours. Pensez à activer votre licence.`;
    }
    return `Période d'essai : ${daysRemaining} jours restants sur ${licenseData.maxTrialDays}.`;
  };

  return (
    <Alert variant={getAlertVariant()} className="relative">
      {getIcon()}
      <AlertDescription className="pr-8">
        <div className="flex items-center justify-between">
          <div>
            <strong>{getMessage()}</strong>
            <div className="mt-2 flex gap-2">
              <Link to="/settings">
                <Button size="sm" variant={daysRemaining <= 7 ? "secondary" : "outline"}>
                  <Shield className="h-3 w-3 mr-1" />
                  Activer ma licence
                </Button>
              </Link>
              <span className="text-xs text-muted-foreground">
                Prix: {licenseManager.getLicensePrice().toLocaleString()} FCFA/an
              </span>
            </div>
          </div>
        </div>
      </AlertDescription>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-6 w-6 p-0"
        onClick={handleDismiss}
      >
        <X className="h-3 w-3" />
      </Button>
    </Alert>
  );
};

export default LicenseAlert;