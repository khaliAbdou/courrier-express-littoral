
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IncomingMail, OutgoingMail } from "@/types/mail";
import { getAllIncomingMails } from "@/utils/incomingMailStorage";
import { getAllOutgoingMails } from "@/utils/outgoingMailStorage";

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

  const { data: incomingMails, isLoading: incomingLoading } = useQuery({
    queryKey: ["incomingMails"],
    queryFn: getAllIncomingMails,
  });

  const { data: outgoingMails, isLoading: outgoingLoading } = useQuery({
    queryKey: ["outgoingMails"],
    queryFn: getAllOutgoingMails,
  });

  const stats = {
    totalIncoming: incomingMails?.length || 0,
    totalOutgoing: outgoingMails?.length || 0,
    pending: incomingMails?.filter(mail => mail.status === "Pending" || mail.status === "Processing").length || 0,
    processed: incomingMails?.filter(mail => mail.status === "Completed").length || 0,
    pendingIncoming: incomingMails?.filter(mail => mail.status === "Pending" || mail.status === "Processing").length || 0,
    pendingOutgoing: outgoingMails?.filter(mail => mail.status === "Pending" || mail.status === "Processing").length || 0,
    recentIncoming: incomingMails?.slice(0, 5) || [],
    recentOutgoing: outgoingMails?.slice(0, 5) || [],
    overdueMails: overdueMails || [],
  };

  const isLoading = statsLoading || overdueLoading || incomingLoading || outgoingLoading;

  return {
    mailStats,
    stats,
    overdueMails: overdueMails || [],
    isLoading,
    statsLoading,
    overdueLoading,
  };
};
