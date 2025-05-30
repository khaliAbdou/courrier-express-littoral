
import React, { useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedFilters from "@/components/statistics/AdvancedFilters";
import StatisticsExport from "@/components/statistics/StatisticsExport";
import EnhancedCharts from "@/components/statistics/EnhancedCharts";
import PerformanceMetrics from "@/components/statistics/PerformanceMetrics";
import StatisticsOverview from "@/components/statistics/StatisticsOverview";
import { useStatisticsData } from "@/hooks/useStatisticsData";
import { prepareBarChartData } from "@/utils/statisticsUtils";

const StatisticsPage: React.FC = () => {
  const {
    filteredStats,
    filters,
    setFilters,
    appliedFilters,
    years,
    availableServices,
    performanceMetrics,
    handleApplyFilters,
    handleResetFilters,
  } = useStatisticsData();

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

            <StatisticsOverview filteredStats={filteredStats} />
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
