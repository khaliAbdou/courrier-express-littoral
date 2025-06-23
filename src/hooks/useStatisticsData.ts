
import { useState, useEffect, useMemo } from 'react';
import { getAllOutgoingMails } from '@/utils/outgoingMailDB';
import { IncomingMail, OutgoingMail } from '@/types/mail';

// Type pour les statistiques mensuelles
interface MonthlyStat {
  month: string;
  year: number;
  "Courriers Entrants": number;
  "Courriers Départs": number;
}

// Type pour les métriques de performance
interface PerformanceMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface StatisticsFilters {
  year?: number;
  month?: string;
  service?: string;
  type?: string;
}

export const useStatisticsData = () => {
  const [outgoingMails, setOutgoingMails] = useState<OutgoingMail[]>([]);
  const [incomingMails] = useState<IncomingMail[]>([]); // Pour la compatibilité
  const [filters, setFilters] = useState<StatisticsFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<StatisticsFilters>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const outgoing = await getAllOutgoingMails();
        setOutgoingMails(outgoing);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    loadData();
  }, []);

  // Calcul des statistiques filtrées
  const filteredStats = useMemo((): MonthlyStat[] => {
    const stats = new Map<string, MonthlyStat>();
    
    // Traitement des courriers sortants
    outgoingMails.forEach(mail => {
      const date = new Date(mail.date);
      const year = date.getFullYear();
      const month = date.toLocaleDateString('fr-FR', { month: 'long' });
      const key = `${year}-${month}`;
      
      // Applquer les filtres
      if (appliedFilters.year && year !== appliedFilters.year) return;
      if (appliedFilters.month && month !== appliedFilters.month) return;
      if (appliedFilters.service && mail.service !== appliedFilters.service) return;
      
      if (!stats.has(key)) {
        stats.set(key, {
          month,
          year,
          "Courriers Entrants": 0,
          "Courriers Départs": 0
        });
      }
      
      const stat = stats.get(key)!;
      stat["Courriers Départs"]++;
    });

    return Array.from(stats.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return new Date(`${a.month} 1, 2000`).getTime() - new Date(`${b.month} 1, 2000`).getTime();
    });
  }, [outgoingMails, incomingMails, appliedFilters]);

  // Années disponibles
  const years = useMemo(() => {
    const yearSet = new Set<number>();
    [...outgoingMails, ...incomingMails].forEach(mail => {
      yearSet.add(new Date(mail.date).getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [outgoingMails, incomingMails]);

  // Services disponibles
  const availableServices = useMemo(() => {
    const serviceSet = new Set<string>();
    outgoingMails.forEach(mail => {
      if (mail.service) serviceSet.add(mail.service);
    });
    return Array.from(serviceSet).sort();
  }, [outgoingMails]);

  // Métriques de performance
  const performanceMetrics = useMemo((): PerformanceMetric[] => {
    const totalMails = outgoingMails.length + incomingMails.length;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthMails = [...outgoingMails, ...incomingMails].filter(mail => {
      const mailDate = new Date(mail.date);
      return mailDate.getMonth() === thisMonth && mailDate.getFullYear() === thisYear;
    }).length;

    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    
    const lastMonthMails = [...outgoingMails, ...incomingMails].filter(mail => {
      const mailDate = new Date(mail.date);
      return mailDate.getMonth() === lastMonth && mailDate.getFullYear() === lastMonthYear;
    }).length;

    const growthRate = lastMonthMails > 0 ? 
      Math.round(((thisMonthMails - lastMonthMails) / lastMonthMails) * 100) : 0;

    // Calcul du temps de réponse moyen (simulé basé sur les données réelles)
    const avgResponseTime = incomingMails.length > 0 ? 
      Math.round(incomingMails.reduce((acc, mail) => {
        if (mail.responseDate) {
          const responseTime = new Date(mail.responseDate).getTime() - new Date(mail.date).getTime();
          return acc + (responseTime / (1000 * 60 * 60 * 24)); // en jours
        }
        return acc + 3; // valeur par défaut
      }, 0) / incomingMails.length) : 3;

    return [
      {
        label: "Temps de réponse moyen",
        value: `${avgResponseTime} jours`,
        trend: avgResponseTime <= 3 ? 'up' : 'down',
        description: `Basé sur ${incomingMails.filter(m => m.responseDate).length} courriers traités`
      },
      {
        label: "Taux d'efficacité",
        value: `${Math.round((thisMonthMails / Math.max(totalMails, 1)) * 100)}%`,
        trend: thisMonthMails >= lastMonthMails ? 'up' : 'down',
        description: "Ratio courriers traités ce mois"
      },
      {
        label: "Croissance mensuelle",
        value: `${growthRate >= 0 ? '+' : ''}${growthRate}%`,
        trend: growthRate >= 0 ? 'up' : 'down',
        description: "Évolution par rapport au mois dernier"
      },
      {
        label: "Éléments prioritaires",
        value: outgoingMails.filter(m => m.status === 'Overdue').length.toString(),
        trend: 'stable',
        description: "Courriers en retard nécessitant une attention"
      }
    ];
  }, [outgoingMails, incomingMails]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  return {
    filteredStats,
    filters,
    setFilters,
    appliedFilters,
    years,
    availableServices,
    performanceMetrics,
    handleApplyFilters,
    handleResetFilters,
  };
};
