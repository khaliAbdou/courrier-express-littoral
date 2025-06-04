
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, X } from 'lucide-react';
import { IncomingMail } from '@/types/mail';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

function getAllIncomingMails(): IncomingMail[] {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  try {
    return JSON.parse(existing).map((mail: any) => ({
      ...mail,
      date: mail.date ? new Date(mail.date) : undefined,
      responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
    }));
  } catch {
    return [];
  }
}

const OverdueAlerts: React.FC = () => {
  const [overdueMails, setOverdueMails] = useState<IncomingMail[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    const mails = getAllIncomingMails();
    const now = new Date();
    
    const overdue = mails.filter(mail => {
      if (mail.status === 'Completed' || mail.status === 'Overdue') return false;
      if (!mail.date) return false;
      
      const daysSinceReceived = differenceInDays(now, mail.date);
      return daysSinceReceived > 7; // Considéré en retard après 7 jours
    });
    
    const filteredOverdue = overdue.filter(mail => 
      !dismissedAlerts.includes(mail.id || '')
    );
    
    setOverdueMails(filteredOverdue);
  }, [dismissedAlerts]);

  const dismissAlert = (mailId: string) => {
    setDismissedAlerts(prev => [...prev, mailId]);
    toast.success('Alerte masquée');
  };

  if (overdueMails.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Courriers en Retard ({overdueMails.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {overdueMails.map((mail) => (
          <div key={mail.id} className="flex items-center justify-between bg-white p-3 rounded border border-red-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="destructive" className="text-xs">
                  Retard: {differenceInDays(new Date(), mail.date)} jours
                </Badge>
                <span className="font-medium text-sm">{mail.chronoNumber}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{mail.subject}</p>
              <p className="text-xs text-gray-500">
                Reçu le: {format(mail.date, 'dd/MM/yyyy')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(mail.id || '')}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OverdueAlerts;
