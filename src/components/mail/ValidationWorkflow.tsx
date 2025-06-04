
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Send, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ValidationStatus } from '@/types/mailExtended';

interface ValidationWorkflowProps {
  mailId: string;
  currentStatus: ValidationStatus;
  needsValidation: boolean;
  onStatusChange?: (status: ValidationStatus) => void;
}

const ValidationWorkflow: React.FC<ValidationWorkflowProps> = ({
  mailId,
  currentStatus,
  needsValidation,
  onStatusChange
}) => {
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusInfo = (status: ValidationStatus) => {
    switch (status) {
      case 'draft':
        return { 
          label: 'Brouillon', 
          icon: <User className="h-4 w-4" />, 
          variant: 'secondary' as const,
          color: 'text-gray-600'
        };
      case 'pending_validation':
        return { 
          label: 'En attente de validation', 
          icon: <Clock className="h-4 w-4" />, 
          variant: 'default' as const,
          color: 'text-blue-600'
        };
      case 'validated':
        return { 
          label: 'Validé', 
          icon: <CheckCircle className="h-4 w-4" />, 
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'rejected':
        return { 
          label: 'Rejeté', 
          icon: <XCircle className="h-4 w-4" />, 
          variant: 'destructive' as const,
          color: 'text-red-600'
        };
    }
  };

  const handleSubmitForValidation = async () => {
    setIsSubmitting(true);
    try {
      // Sauvegarder l'historique de validation
      const validationHistory = {
        id: Date.now().toString(),
        mailId,
        action: 'submit' as const,
        userId: 'current_user',
        timestamp: new Date(),
        comments: comments || undefined
      };

      const historyKey = `validation_history_${mailId}`;
      const existing = localStorage.getItem(historyKey);
      const history = existing ? JSON.parse(existing) : [];
      history.push(validationHistory);
      localStorage.setItem(historyKey, JSON.stringify(history));

      onStatusChange?.('pending_validation');
      setComments('');
      toast.success('Courrier soumis pour validation');
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    }
    setIsSubmitting(false);
  };

  const handleValidate = async () => {
    setIsSubmitting(true);
    try {
      const validationHistory = {
        id: Date.now().toString(),
        mailId,
        action: 'validate' as const,
        userId: 'validator_user',
        timestamp: new Date(),
        comments: comments || undefined
      };

      const historyKey = `validation_history_${mailId}`;
      const existing = localStorage.getItem(historyKey);
      const history = existing ? JSON.parse(existing) : [];
      history.push(validationHistory);
      localStorage.setItem(historyKey, JSON.stringify(history));

      onStatusChange?.('validated');
      setComments('');
      toast.success('Courrier validé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error('Veuillez indiquer la raison du rejet');
      return;
    }

    setIsSubmitting(true);
    try {
      const validationHistory = {
        id: Date.now().toString(),
        mailId,
        action: 'reject' as const,
        userId: 'validator_user',
        timestamp: new Date(),
        comments: comments
      };

      const historyKey = `validation_history_${mailId}`;
      const existing = localStorage.getItem(historyKey);
      const history = existing ? JSON.parse(existing) : [];
      history.push(validationHistory);
      localStorage.setItem(historyKey, JSON.stringify(history));

      onStatusChange?.('rejected');
      setComments('');
      toast.success('Courrier rejeté');
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
    setIsSubmitting(false);
  };

  const statusInfo = getStatusInfo(currentStatus);

  if (!needsValidation) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Send className="h-4 w-4" />
          Validation Hiérarchique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>

        <Textarea
          placeholder="Commentaires (optionnel)..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />

        <div className="flex gap-2">
          {currentStatus === 'draft' && (
            <Button 
              onClick={handleSubmitForValidation}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Soumettre pour validation
            </Button>
          )}

          {currentStatus === 'pending_validation' && (
            <>
              <Button 
                onClick={handleValidate}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Valider
              </Button>
              <Button 
                variant="destructive"
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </Button>
            </>
          )}

          {currentStatus === 'rejected' && (
            <Button 
              onClick={handleSubmitForValidation}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Soumettre à nouveau
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationWorkflow;
