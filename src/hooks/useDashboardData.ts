import { useState, useEffect } from 'react';
import { IncomingMail, OutgoingMail } from '@/types/mail';
import { getAllIncomingMails } from '@/utils/incomingMailDB';
import { getAllOutgoingMails } from '@/utils/outgoingMailDB';

export interface DashboardStats {
  totalIncoming: number;
  totalOutgoing: number;
  pending: number;
  processed: number;
  pendingIncoming: number;
  pendingOutgoing: number;
  recentIncoming: IncomingMail[];
  recentOutgoing: OutgoingMail[];
  overdueMails: (IncomingMail | OutgoingMail)[];
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncoming: 0,
    totalOutgoing: 0,
    pending: 0,
    processed: 0,
    pendingIncoming: 0,
    pendingOutgoing: 0,
    recentIncoming: [],
    recentOutgoing: [],
    overdueMails: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomingMails, outgoingMails] = await Promise.all([
          getAllIncomingMails(),
          getAllOutgoingMails()
        ]);

        const pendingIncoming = incomingMails.filter(mail => mail.status === 'Pending').length;
        const pendingOutgoing = outgoingMails.filter(mail => mail.status === 'Pending').length;

        const processedIncoming = incomingMails.filter(mail => mail.status === 'Completed').length;
        const processedOutgoing = outgoingMails.filter(mail => mail.status === 'Completed').length;

        // Get recent mails (last 5)
        const recentIncoming = incomingMails
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        const recentOutgoing = outgoingMails
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        // Get overdue mails
        const now = new Date();
        const overdueMails = [
          ...incomingMails.filter(mail => 
            mail.responseDate && new Date(mail.responseDate) < now && mail.status !== 'Completed'
          ),
          ...outgoingMails.filter(mail => 
            mail.status === 'Pending' && 
            new Date(mail.date).getTime() < now.getTime() - (7 * 24 * 60 * 60 * 1000) // 7 days old
          )
        ];

        setStats({
          totalIncoming: incomingMails.length,
          totalOutgoing: outgoingMails.length,
          pending: pendingIncoming + pendingOutgoing,
          processed: processedIncoming + processedOutgoing,
          pendingIncoming,
          pendingOutgoing,
          recentIncoming,
          recentOutgoing,
          overdueMails
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading, refreshData: () => setLoading(true) };
};
