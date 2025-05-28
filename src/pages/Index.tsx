import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "@/components/layout/Navbar";
import OverdueMail from "@/components/dashboard/OverdueMail";
import DashboardStats from "@/components/dashboard/DashboardStats";
import MonthlyTrendChart from "@/components/dashboard/MonthlyTrendChart";
import MailTypeChart from "@/components/dashboard/MailTypeChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { useDashboardData } from "@/hooks/useDashboardData";
import { IncomingMail } from "@/types/mail";

// Fonction utilitaire pour lire les mails entrants du localStorage
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

function getOverdueMails(): IncomingMail[] {
  return getAllIncomingMails().filter((mail) => mail.status === "Overdue");
}

const Index: React.FC = () => {
  const { overdueMails: hookOverdueMails, stats } = useDashboardData();

  // Privilégie les mails du hook s'ils existent, sinon récupère localStorage
  const overdueMails = hookOverdueMails && hookOverdueMails.length > 0
    ? hookOverdueMails
    : getOverdueMails();

  const formattedDate = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const formattedDateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-0">Tableau de Bord</h1>
          <p className="text-gray-500">
            {formattedDateCapitalized}
          </p>
        </div>

        <DashboardStats {...stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyTrendChart />
          <MailTypeChart />
        </div>

        <OverdueMail overdueEmails={overdueMails} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>

      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ANOR - Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
