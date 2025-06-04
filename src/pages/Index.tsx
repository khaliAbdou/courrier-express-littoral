
import React from "react";
import Navbar from "@/components/layout/Navbar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import MonthlyTrendChart from "@/components/dashboard/MonthlyTrendChart";
import MailTypeChart from "@/components/dashboard/MailTypeChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import OverdueMail from "@/components/dashboard/OverdueMail";
import OverdueAlerts from "@/components/alerts/OverdueAlerts";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const { stats, overdueMails } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="page-container flex-1">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/b5287aa5-72f8-436b-95be-6d1a0e22b700.png" 
            alt="ANOR Logo" 
            className="mx-auto mb-6 h-24 w-auto"
          />
          <h1 className="text-4xl font-bold text-agency-blue mb-4">
            Courrier Express Littoral
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Système de gestion intelligente des courriers pour l'Antenne du Littoral de l'ANOR
          </p>
        </div>

        {/* Alertes des courriers en retard */}
        <div className="mb-8">
          <OverdueAlerts />
        </div>

        {/* Dashboard Stats and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <DashboardStats 
              totalIncoming={stats.totalIncoming}
              totalOutgoing={stats.totalOutgoing}
              pending={stats.pending}
              processed={stats.processed}
            />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Monthly Trend Chart and Mail Type Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MonthlyTrendChart />
          <MailTypeChart />
        </div>

        {/* Recent Activity and Overdue Mail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RecentActivity />
          <OverdueMail overdueEmails={overdueMails} />
        </div>
      </div>

      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} ANOR - Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
