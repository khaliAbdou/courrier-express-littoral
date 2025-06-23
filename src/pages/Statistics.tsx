
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
  const { 
    incomingMails, 
    outgoingMails, 
    monthlyStats, 
    filteredStats,
    years,
    availableServices,
    performanceMetrics,
    filters,
    setFilters,
    handleApplyFilters,
    handleResetFilters,
    isLoading 
  } = useStatisticsData();
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const handleFilterChange = (filterData: {
    services: string[];
    years: number[];
    months: string[];
  }) => {
    setSelectedServices(filterData.services);
    setSelectedYears(filterData.years);
    setSelectedMonths(filterData.months);
  };

  if (isLoading) {
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
                availableYears={years}
                filters={filters}
                onFiltersChange={handleFilterChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
              <StatisticsOverview 
                filteredStats={filteredStats}
              />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-0">
            <EnhancedCharts 
              monthlyStats={monthlyStats}
            />
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <PerformanceMetrics 
              metrics={performanceMetrics}
            />
          </TabsContent>

          <TabsContent value="export" className="mt-0">
            <StatisticsExport 
              data={{ incomingMails, outgoingMails }}
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
