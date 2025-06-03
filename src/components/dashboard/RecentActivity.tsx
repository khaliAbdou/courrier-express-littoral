
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";
import { IncomingMail, OutgoingMail } from "@/types/mail";

// Fonctions pour récupérer les courriers du localStorage
function getAllIncomingMails(): IncomingMail[] {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
    responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
  }));
}

function getAllOutgoingMails(): OutgoingMail[] {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
  }));
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
    <Card>
      <CardHeader>
        <CardTitle className="text-agency-blue">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  activity.type === 'incoming' ? "bg-blue-100" : "bg-green-100"
                }`}>
                  {activity.type === 'incoming' ? (
                    <Mail className="h-4 w-4 text-agency-blue" />
                  ) : (
                    <Send className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{activity.subject}</p>
                  <p className="text-sm text-gray-500">
                    {activity.type === 'incoming' 
                      ? `De: ${activity.senderName}` 
                      : `À: ${activity.correspondent}`
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
