import React, { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedFilters from "@/components/statistics/AdvancedFilters";
import StatisticsExport from "@/components/statistics/StatisticsExport";
import EnhancedCharts from "@/components/statistics/EnhancedCharts";
import PerformanceMetrics from "@/components/statistics/PerformanceMetrics";
import { MailType, MailStats, IncomingMail, OutgoingMail } from "@/types/mail";

// Fonctions utilitaires pour lire les courriers du localStorage
function getAllIncomingMails() {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
  }));
}
function getAllOutgoingMails() {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
  }));
}

// Tableau des noms de mois (français)
const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Préparer les statistiques mensuelles et annuelles à partir des courriers stockés
function computeMonthlyStats(incomings: any[], outgoings: any[]): MailStats[] {
  // Objet : { [year-month]: { ... } }
  const statsMap: { [key: string]: MailStats } = {};

  incomings.forEach((mail) => {
    if (!mail.date) return;
    const d = new Date(mail.date);
    const year = d.getFullYear();
    const monthIdx = d.getMonth();
    const month = monthNames[monthIdx];
    const key = `${year}-${month}`;

    if (!statsMap[key]) {
      statsMap[key] = {
        month,
        year,
        incomingCount: 0,
        outgoingCount: 0,
        byType: {
          Administrative: 0,
          Technical: 0,
          Commercial: 0,
          Financial: 0,
          Other: 0
        }
      };
    }
    statsMap[key].incomingCount += 1;
    const type = mail.mailType || "Other";
    statsMap[key].byType[type] = (statsMap[key].byType[type] || 0) + 1;
  });

  outgoings.forEach((mail) => {
    if (!mail.date) return;
    const d = new Date(mail.date);
    const year = d.getFullYear();
    const monthIdx = d.getMonth();
    const month = monthNames[monthIdx];
    const key = `${year}-${month}`;

    if (!statsMap[key]) {
      statsMap[key] = {
        month,
        year,
        incomingCount: 0,
        outgoingCount: 0,
        byType: {
          Administrative: 0,
          Technical: 0,
          Commercial: 0,
          Financial: 0,
          Other: 0
        }
      };
    }
    statsMap[key].outgoingCount += 1;
    // Pour outgoing, on ne connaît pas forcément le type, donc on n'incrémente pas byType
  });

  // Trie par année puis par mois
  return Object.values(statsMap).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
  });
}

const StatisticsPage: React.FC = () => {
  const incomingMails = getAllIncomingMails();
  const outgoingMails = getAllOutgoingMails();
  const monthlyStats = useMemo(() => computeMonthlyStats(incomingMails, outgoingMails), [incomingMails, outgoingMails]);

  // États pour les filtres avancés
  const [filters, setFilters] = useState({
    month: "all",
    year: "all",
    mailType: "all",
    status: "all",
    service: "all",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    medium: "all",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Données dynamiques
  const years = Array.from(new Set(monthlyStats.map((s) => s.year))).sort((a, b) => b - a);
  const availableServices = Array.from(new Set(incomingMails.map(m => m.recipientService))).filter(Boolean);

  // Données filtrées
  const filteredStats = useMemo(() => {
    return monthlyStats.filter(stat => {
      if (appliedFilters.year !== "all" && stat.year.toString() !== appliedFilters.year) return false;
      if (appliedFilters.month !== "all" && stat.month !== appliedFilters.month) return false;
      return true;
    });
  }, [monthlyStats, appliedFilters]);

  // Métriques de performance
  const performanceMetrics = useMemo(() => {
    const totalMails = incomingMails.length;
    const completedMails = incomingMails.filter(m => m.status === "Completed").length;
    const overdueMails = incomingMails.filter(m => m.status === "Overdue").length;
    const pendingMails = incomingMails.filter(m => m.status === "Pending" || m.status === "Processing").length;
    
    return {
      averageResponseTime: Math.round(Math.random() * 10 + 3), // Simulé
      processingEfficiency: totalMails > 0 ? Math.round((completedMails / totalMails) * 100) : 0,
      overdueRate: totalMails > 0 ? Math.round((overdueMails / totalMails) * 100) : 0,
      completionRate: totalMails > 0 ? Math.round((completedMails / totalMails) * 100) : 0,
      monthlyGrowth: Math.round((Math.random() - 0.5) * 20), // Simulé
      totalProcessed: completedMails,
      pendingCount: pendingMails,
      priorityItems: Math.round(pendingMails * 0.3), // Simulé
    };
  }, [incomingMails]);

  // Données pour les graphiques
  const chartData = useMemo(() => {
    const barChartData = prepareBarChartData(filteredStats);
    const comparisonData = barChartData.map(item => ({
      ...item,
      total: item["Courriers Entrants"] + item["Courriers Départs"],
      efficiency: Math.round(Math.random() * 100), // Simulé
    }));

    return {
      monthlyData: barChartData,
      comparisonData,
      typeData: [], // À implémenter selon les besoins
    };
  }, [filteredStats]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      month: "all",
      year: "all",
      mailType: "all",
      status: "all",
      service: "all",
      dateFrom: undefined,
      dateTo: undefined,
      medium: "all",
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const prepareBarChartData = (stats: MailStats[]) => {
    return stats.map((stat) => ({
      name: `${stat.month} ${stat.year}`,
      "Courriers Entrants": stat.incomingCount,
      "Courriers Départs": stat.outgoingCount,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="page-container flex-1">
        <h1 className="page-title">Statistiques Avancées</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="detailed">Analyse détaillée</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              availableYears={years}
              availableServices={availableServices}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredStats.map((stat) => (
                <Card key={`${stat.year}-${stat.month}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{stat.month} {stat.year}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stat.incomingCount}</p>
                        <p className="text-sm text-gray-600">Entrants</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stat.outgoingCount}</p>
                        <p className="text-sm text-gray-600">Sortants</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <EnhancedCharts 
              monthlyData={chartData.monthlyData}
              typeData={chartData.typeData}
              comparisonData={chartData.comparisonData}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics metrics={performanceMetrics} />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <StatisticsExport data={filteredStats} filters={appliedFilters} />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default StatisticsPage;
