
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Clock } from "lucide-react";
import { IncomingMail, OutgoingMail } from "@/types/mail";

// Fonctions pour récupérer les courriers du localStorage
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
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers entrants:", error);
    return [];
  }
}

function getAllOutgoingMails(): OutgoingMail[] {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  try {
    return JSON.parse(existing).map((mail: any) => ({
      ...mail,
      date: mail.date ? new Date(mail.date) : undefined,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers sortants:", error);
    return [];
  }
}

const RecentActivity: React.FC = () => {
  const incomingMails = getAllIncomingMails();
  const outgoingMails = getAllOutgoingMails();
  
  // Combine et trie les activités récentes
  const recentActivities = [
    ...incomingMails.map(mail => ({
      type: 'incoming' as const,
      subject: mail.subject,
      date: mail.date,
      senderName: mail.senderName,
    })),
    ...outgoingMails.map(mail => ({
      type: 'outgoing' as const,
      subject: mail.subject,
      date: mail.date,
      correspondent: mail.correspondent,
    }))
  ]
    .filter(activity => activity.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 4);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-agency-blue flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Aucune activité récente</p>
            <p className="text-gray-400 text-xs mt-1">Les nouveaux courriers apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div 
                key={`${activity.type}-${i}`} 
                className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  activity.type === 'incoming' ? "bg-blue-100 hover:bg-blue-200" : "bg-green-100 hover:bg-green-200"
                }`}>
                  {activity.type === 'incoming' ? (
                    <Mail className="h-4 w-4 text-agency-blue" />
                  ) : (
                    <Send className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate" title={activity.subject}>
                    {activity.subject || 'Objet non défini'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.type === 'incoming' 
                      ? `De: ${activity.senderName || 'Expéditeur inconnu'}` 
                      : `À: ${activity.correspondent || 'Correspondant inconnu'}`
                    } • {activity.date ? new Date(activity.date).toLocaleDateString('fr-FR') : 'Date non définie'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
