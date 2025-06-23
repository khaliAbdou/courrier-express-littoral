
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StatisticsOverview from "@/components/statistics/StatisticsOverview";
import EnhancedCharts from "@/components/statistics/EnhancedCharts";
import PerformanceMetrics from "@/components/statistics/PerformanceMetrics";
import StatisticsExport from "@/components/statistics/StatisticsExport";
import AdvancedFilters from "@/components/statistics/AdvancedFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatisticsData } from "@/hooks/useStatisticsData";

const StatisticsPage: React.FC = () => {
  const { data, loading, chartData, performanceData } = useStatisticsData();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  // Extraction des services uniques depuis les données
  const availableServices = React.useMemo(() => {
    if (!data?.incomingMails) return [];
    const services = new Set<string>();
    data.incomingMails.forEach(mail => {
      if (mail.recipientService) {
        services.add(mail.recipientService);
      }
    });
    return Array.from(services);
  }, [data?.incomingMails]);

  // Extraction des années uniques
  const availableYears = React.useMemo(() => {
    if (!data?.incomingMails) return [];
    const years = new Set<number>();
    data.incomingMails.forEach(mail => {
      if (mail.date) {
        years.add(new Date(mail.date).getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [data?.incomingMails]);

  // Mois disponibles
  const availableMonths = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const handleFilterChange = (filters: {
    services: string[];
    years: number[];
    months: string[];
  }) => {
    setSelectedServices(filters.services);
    setSelectedYears(filters.years);
    setSelectedMonths(filters.months);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="page-container flex-1 flex items-center justify-center">
          <div>Chargement des statistiques...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="page-container flex-1">
        <h1 className="page-title">Statistiques et Rapports</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid gap-6">
              <AdvancedFilters
                availableServices={availableServices}
                availableYears={availableYears}
                availableMonths={availableMonths}
                onFilterChange={handleFilterChange}
              />
              <StatisticsOverview 
                data={data} 
                selectedServices={selectedServices}
                selectedYears={selectedYears}
                selectedMonths={selectedMonths}
              />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-0">
            <EnhancedCharts 
              chartData={chartData}
              selectedServices={selectedServices}
              selectedYears={selectedYears}
              selectedMonths={selectedMonths}
            />
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <PerformanceMetrics 
              data={performanceData}
              selectedServices={selectedServices}
              selectedYears={selectedYears}
              selectedMonths={selectedMonths}
            />
          </TabsContent>

          <TabsContent value="export" className="mt-0">
            <StatisticsExport 
              data={data}
              selectedServices={selectedServices}
              selectedYears={selectedYears}
              selectedMonths={selectedMonths}
            />
          </TabsContent>
        </Tabs>
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

export default StatisticsPage;
