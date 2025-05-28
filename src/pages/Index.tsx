
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

// Mock data for demonstration
const mockOverdueMails: IncomingMail[] = [
  {
    id: "1",
    chronoNumber: "ARR-2023-0001",
    date: new Date(2023, 4, 15),
    medium: "Email",
    subject: "Demande d'attestation de conformité",
    mailType: "Administrative",
    responseDate: undefined,
    senderName: "Entreprise ABC",
    senderAddress: "123 Rue des Entreprises, Douala",
    recipientService: "Service Qualité",
    observations: "Urgent - Délai dépassé",
    status: "Overdue",
  },
  {
    id: "2",
    chronoNumber: "ARR-2023-0003",
    date: new Date(2023, 5, 1),
    medium: "Physical",
    subject: "Réclamation qualité produit",
    mailType: "Technical",
    responseDate: undefined,
    senderName: "Client XYZ",
    senderAddress: "456 Avenue du Commerce, Douala",
    recipientService: "Service Client",
    status: "Overdue",
  },
];

const Index: React.FC = () => {
  const { overdueMails, stats } = useDashboardData();
  
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
        
        <OverdueMail overdueEmails={overdueMails || mockOverdueMails} />
        
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
