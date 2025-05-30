
import { useState, useMemo } from "react";
import { IncomingMail } from "@/types/mail";
import { getAllIncomingMails, getAllOutgoingMails, computeMonthlyStats } from "@/utils/statisticsUtils";

export function useStatisticsData() {
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
  const availableServices = Array.from(
    new Set(
      incomingMails
        .map(m => m.recipientService)
        .filter((service): service is string => Boolean(service))
    )
  );

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

  return {
    incomingMails,
    outgoingMails,
    monthlyStats,
    filters,
    setFilters,
    appliedFilters,
    years,
    availableServices,
    filteredStats,
    performanceMetrics,
    handleApplyFilters,
    handleResetFilters,
  };
}
