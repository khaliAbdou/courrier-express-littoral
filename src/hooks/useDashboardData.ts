
import { useQuery } from "@tanstack/react-query";
import { IncomingMail, OutgoingMail } from "@/types/mail";
import { getAllIncomingMails, getAllOutgoingMails } from "@/utils/storageAdapter";
import { differenceInDays } from "date-fns";

// Fonction pour récupérer les courriers en retard depuis les données locales
const fetchOverdueMailsFromLocal = async (): Promise<IncomingMail[]> => {
  try {
    const mails = await getAllIncomingMails();
    const now = new Date();
    
    const overdue = mails.filter(mail => {
      if (mail.status === 'Completed' || mail.status === 'Overdue') return false;
      if (!mail.date) return false;
      
      const daysSinceReceived = differenceInDays(now, mail.date);
      return daysSinceReceived > 7; // Considéré en retard après 7 jours
    });
    
    return overdue;
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers en retard:", error);
    return [];
  }
};

export const useDashboardData = () => {
  const { data: overdueMails, isLoading: overdueLoading } = useQuery({
    queryKey: ["overdueMails"],
    queryFn: fetchOverdueMailsFromLocal,
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

  const isLoading = overdueLoading || incomingLoading || outgoingLoading;

  return {
    stats,
    overdueMails: overdueMails || [],
    isLoading,
    overdueLoading,
  };
};
