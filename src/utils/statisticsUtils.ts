
import { IncomingMail, OutgoingMail, MailStats } from "@/types/mail";

// Tableau des noms de mois (français)
export const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Préparer les statistiques mensuelles et annuelles à partir des courriers
export function computeMonthlyStats(incomings: IncomingMail[], outgoings: OutgoingMail[]): MailStats[] {
  // Objet : { [year-month]: { ... } }
  const statsMap: { [key: string]: MailStats } = {};

  incomings.forEach((mail) => {
    if (!mail.date) return;
    const d = new Date(mail.date);
    const year = d.getFullYear();
    const monthIdx = d.getMonth();
    const month = monthNames[monthIdx];
    const key = `${year}-${month}`;

    if (!statsMap[key]) {
      statsMap[key] = {
        month,
        year,
        incomingCount: 0,
        outgoingCount: 0,
        byType: {
          Administrative: 0,
          Technical: 0,
          Commercial: 0,
          Financial: 0,
          Other: 0
        }
      };
    }
    statsMap[key].incomingCount += 1;
    const type = mail.mailType || "Other";
    statsMap[key].byType[type] = (statsMap[key].byType[type] || 0) + 1;
  });

  outgoings.forEach((mail) => {
    if (!mail.date) return;
    const d = new Date(mail.date);
    const year = d.getFullYear();
    const monthIdx = d.getMonth();
    const month = monthNames[monthIdx];
    const key = `${year}-${month}`;

    if (!statsMap[key]) {
      statsMap[key] = {
        month,
        year,
        incomingCount: 0,
        outgoingCount: 0,
        byType: {
          Administrative: 0,
          Technical: 0,
          Commercial: 0,
          Financial: 0,
          Other: 0
        }
      };
    }
    statsMap[key].outgoingCount += 1;
    // Pour outgoing, on ne connaît pas forcément le type, donc on n'incrémente pas byType
  });

  // Trie par année puis par mois
  return Object.values(statsMap).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
  });
}

export function prepareBarChartData(stats: MailStats[]) {
  return stats.map((stat) => ({
    name: `${stat.month} ${stat.year}`,
    "Courriers Entrants": stat.incomingCount,
    "Courriers Départs": stat.outgoingCount,
  }));
}
