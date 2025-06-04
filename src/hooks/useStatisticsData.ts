
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

  // Métriques de performance basées sur les vraies données
  const performanceMetrics = useMemo(() => {
    const totalMails = incomingMails.length;
    const completedMails = incomingMails.filter(m => m.status === "Completed").length;
    const overdueMails = incomingMails.filter(m => m.status === "Overdue").length;
    const pendingMails = incomingMails.filter(m => m.status === "Pending" || m.status === "Processing").length;
    
    // Calcul du temps de réponse moyen (en jours)
    const mailsWithResponse = incomingMails.filter(m => m.responseDate && m.date);
    const averageResponseTime = mailsWithResponse.length > 0
      ? Math.round(
          mailsWithResponse.reduce((sum, mail) => {
            const days = Math.ceil((new Date(mail.responseDate!).getTime() - new Date(mail.date).getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0) / mailsWithResponse.length
        )
      : 0;

    // Calcul de la croissance mensuelle
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthMails = incomingMails.filter(m => {
      const mailDate = new Date(m.date);
      return mailDate.getMonth() === currentMonth && mailDate.getFullYear() === currentYear;
    }).length;

    const lastMonthMails = incomingMails.filter(m => {
      const mailDate = new Date(m.date);
      return mailDate.getMonth() === lastMonth && mailDate.getFullYear() === lastMonthYear;
    }).length;

    const monthlyGrowth = lastMonthMails > 0 
      ? Math.round(((currentMonthMails - lastMonthMails) / lastMonthMails) * 100)
      : currentMonthMails > 0 ? 100 : 0;
    
    // Calcul du nombre de courriers prioritaires (ceux en retard depuis plus de 14 jours)
    const now = new Date();
    const priorityItems = incomingMails.filter(m => {
      if (m.status !== "Pending" && m.status !== "Processing") return false;
      const daysSinceReceived = Math.ceil((now.getTime() - new Date(m.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceReceived > 14;
    }).length;
    
    return {
      averageResponseTime,
      processingEfficiency: totalMails > 0 ? Math.round((completedMails / totalMails) * 100) : 0,
      overdueRate: totalMails > 0 ? Math.round((overdueMails / totalMails) * 100) : 0,
      completionRate: totalMails > 0 ? Math.round((completedMails / totalMails) * 100) : 0,
      monthlyGrowth,
      totalProcessed: completedMails,
      pendingCount: pendingMails,
      priorityItems,
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
