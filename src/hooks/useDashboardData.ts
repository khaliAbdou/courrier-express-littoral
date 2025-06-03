
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IncomingMail, OutgoingMail } from "@/types/mail";
import { toast } from "@/components/ui/sonner";
import React from "react";

// Fonctions pour récupérer les courriers du localStorage
function getAllIncomingMails(): IncomingMail[] {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
    responseDate: mail.responseDate ? new Date(mail.responseDate) : undefined,
  }));
}

function getAllOutgoingMails(): OutgoingMail[] {
  const key = "outgoingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
  }));
}

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
  
  // Récupération des vraies données du localStorage
  const incomingMails = getAllIncomingMails();
  const outgoingMails = getAllOutgoingMails();
  
  // Gestion des erreurs via React Error Boundary ou useEffect si nécessaire
  React.useEffect(() => {
    if (mailStats === null) {
      toast.error("Erreur lors du chargement des statistiques");
    }
  }, [mailStats]);
  
  // Stats calculées basées sur les vraies données
  const stats = {
    totalIncoming: incomingMails.length,
    totalOutgoing: outgoingMails.length,
    pending: incomingMails.filter(mail => mail.status === "Pending" || mail.status === "Processing").length,
    processed: incomingMails.filter(mail => mail.status === "Completed").length,
  };

  return {
    mailStats,
    overdueMails: overdueMails || [],
    stats,
    statsLoading,
    overdueLoading,
  };
};
