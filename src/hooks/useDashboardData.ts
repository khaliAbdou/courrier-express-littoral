
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IncomingMail } from "@/types/mail";
import { toast } from "@/components/ui/sonner";
import React from "react";

// Fonction pour récupérer les statistiques depuis Supabase
const fetchMailStats = async () => {
  try {
    const { data, error } = await supabase
      .from("mail_statistics")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(6);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return null;
  }
};

// Fonction pour récupérer les courriers en retard
const fetchOverdueMails = async (): Promise<IncomingMail[]> => {
  try {
    const { data, error } = await supabase
      .from("overdue_mail_view")
      .select("*")
      .order("date", { ascending: false });
      
    if (error) throw error;
    
    // Transformation des données Supabase (snake_case) vers le format TypeScript (camelCase)
    return (data || []).map(item => ({
      id: item.id,
      chronoNumber: item.chrono_number,
      date: new Date(item.date),
      medium: item.medium,
      subject: item.subject,
      mailType: item.mail_type,
      responseDate: item.response_date ? new Date(item.response_date) : undefined,
      senderName: item.sender_name,
      senderAddress: item.sender_address,
      recipientService: item.recipient_service,
      observations: item.observations,
      documentLink: item.document_link,
      status: item.status,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers en retard:", error);
    return [];
  }
};

export const useDashboardData = () => {
  const { data: mailStats, isLoading: statsLoading } = useQuery({
    queryKey: ["mailStats"],
    queryFn: fetchMailStats,
  });
  
  const { data: overdueMails, isLoading: overdueLoading } = useQuery({
    queryKey: ["overdueMails"],
    queryFn: fetchOverdueMails,
  });
  
  // Gestion des erreurs via React Error Boundary ou useEffect si nécessaire
  React.useEffect(() => {
    if (mailStats === null) {
      toast.error("Erreur lors du chargement des statistiques");
    }
  }, [mailStats]);
  
  // Stats calculées (utiliser les vraies données ou les mock si non disponibles)
  const stats = {
    totalIncoming: mailStats?.reduce((sum, stat) => sum + stat.incoming_count, 0) || 45,
    totalOutgoing: mailStats?.reduce((sum, stat) => sum + stat.outgoing_count, 0) || 38,
    pending: 12, // À calculer en fonction des statuts réels
    processed: 71, // À calculer en fonction des statuts réels
  };

  return {
    mailStats,
    overdueMails,
    stats,
    statsLoading,
    overdueLoading,
  };
};
