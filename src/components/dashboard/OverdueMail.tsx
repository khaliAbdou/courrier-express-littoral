
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, User, CheckCircle } from "lucide-react";
import { IncomingMail } from "@/types/mail";

interface OverdueMailProps {
  overdueEmails: IncomingMail[];
}

const OverdueMail: React.FC<OverdueMailProps> = ({ overdueEmails }) => {
  return (
    <Card className="mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-agency-blue flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          Courriers en Retard ({overdueEmails.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {overdueEmails.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-gray-500 font-medium">Excellent ! Aucun courrier en retard</p>
            <p className="text-gray-400 text-sm mt-1">Tous les courriers sont traités dans les délais</p>
          </div>
        ) : (
          <div className="space-y-3">
            {overdueEmails.slice(0, 5).map((mail, index) => (
              <div 
                key={mail.id} 
                className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-400 hover:bg-red-100 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{mail.subject || 'Objet non défini'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{mail.senderName || 'Expéditeur inconnu'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{mail.date ? new Date(mail.date).toLocaleDateString('fr-FR') : 'Date non définie'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    En retard
                  </span>
                </div>
              </div>
            ))}
            {overdueEmails.length > 5 && (
              <div className="text-center mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">
                  Et {overdueEmails.length - 5} autres courrier{overdueEmails.length - 5 > 1 ? 's' : ''} en retard
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Consultez la liste complète des courriers entrants
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueMail;
