import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { IncomingMail } from '@/types/mail';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { getAllIncomingMails } from '@/utils/incomingMailDB'; // Utilise IndexedDB

const OverdueAlerts: React.FC = () => {
  const [overdueMails, setOverdueMails] = useState<IncomingMail[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    const fetchMails = async () => {
      const mails = await getAllIncomingMails();
      const now = new Date();

      const overdue = mails.filter(mail => {
        if (mail.status === 'Completed' || mail.status === 'Overdue') return false;
        if (!mail.date) return false;

        const dateValue = typeof mail.date === 'string' ? new Date(mail.date) : mail.date;
        const daysSinceReceived = differenceInDays(now, dateValue);
        return daysSinceReceived > 7; // Considéré en retard après 7 jours
      });

      const filteredOverdue = overdue.filter(mail =>
        !dismissedAlerts.includes(String(mail.id ?? ''))
      );

      setOverdueMails(filteredOverdue);
    };

    fetchMails();
  }, [dismissedAlerts]);

  const dismissAlert = (mailId: string | number | undefined) => {
    setDismissedAlerts(prev => [...prev, String(mailId ?? '')]);
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
        {overdueMails.map((mail) => {
          const dateValue = typeof mail.date === 'string' ? new Date(mail.date) : mail.date;
          return (
            <div key={String(mail.id ?? '')} className="flex items-center justify-between bg-white p-3 rounded border border-red-200">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive" className="text-xs">
                    Retard: {dateValue ? differenceInDays(new Date(), dateValue) : '?'} jours
                  </Badge>
                  <span className="font-medium text-sm">{mail.chronoNumber}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{mail.subject}</p>
                <p className="text-xs text-gray-500">
                  Reçu le: {dateValue ? format(dateValue, 'dd/MM/yyyy') : 'N/A'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(mail.id)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
};

export default OverdueAlerts;
