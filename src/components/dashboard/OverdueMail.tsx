
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { IncomingMail } from "@/types/mail";

interface OverdueMailProps {
  overdueEmails: IncomingMail[];
}

const OverdueMail: React.FC<OverdueMailProps> = ({ overdueEmails }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-agency-blue flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          Courriers en Retard ({overdueEmails.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {overdueEmails.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun courrier en retard</p>
        ) : (
          <div className="space-y-3">
            {overdueEmails.slice(0, 5).map((mail) => (
              <div key={mail.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <div>
                  <p className="font-medium text-gray-900">{mail.subject}</p>
                  <p className="text-sm text-gray-500">
                    {mail.senderName} • {mail.date ? new Date(mail.date).toLocaleDateString('fr-FR') : 'Date non définie'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    En retard
                  </span>
                </div>
              </div>
            ))}
            {overdueEmails.length > 5 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Et {overdueEmails.length - 5} autres courriers en retard
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueMail;
