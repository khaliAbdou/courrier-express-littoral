import React, { useMemo } from "react";
import { IncomingMail } from "@/types/mail";
import { AlertCircle } from "lucide-react";
import MailTable from "../mail/MailTable";

// Fonction utilitaire pour lire les courriers entrants du localStorage
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

const OverdueMail: React.FC = () => {
  // On utilise useMemo pour éviter une lecture à chaque render
  const overdueEmails = useMemo(() => {
    return getAllIncomingMails().filter((mail) => mail.status === "Overdue");
  }, []);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-5 w-5 text-agency-red mr-2" />
        <h2 className="text-xl font-bold text-agency-red">
          Courriers en retard ({overdueEmails.length})
        </h2>
      </div>

      {overdueEmails.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-sm text-agency-red">
              Ces courriers nécessitent une attention immédiate. Veuillez les traiter dès que possible.
            </p>
          </div>
          <MailTable mails={overdueEmails} type="incoming" />
        </div>
      ) : (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
          <p>Aucun courrier en retard. Tout est à jour !</p>
        </div>
      )}
    </div>
  );
};

export default OverdueMail;
