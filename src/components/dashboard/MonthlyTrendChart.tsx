import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { IncomingMail, OutgoingMail } from "@/types/mail";

// Fonction utilitaire pour lire les courriers du localStorage
function getAllIncomingMails(): IncomingMail[] {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing).map((mail: any) => ({
    ...mail,
    date: mail.date ? new Date(mail.date) : undefined,
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

// Tableau des noms de mois abrégés (français)
const monthShortNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const MonthlyTrendChart: React.FC = () => {
  const monthlyData = useMemo(() => {
    const incomings = getAllIncomingMails();
    const outgoings = getAllOutgoingMails();

    // Récupère l'année courante pour le graphique (ou l'année du courrier le plus récent)
    const allDates = [...incomings, ...outgoings]
      .map(m => m.date)
      .filter((d): d is Date => !!d);

    const currentYear = allDates.length > 0 ? Math.max(...allDates.map(d => d.getFullYear())) : new Date().getFullYear();

    // Prépare un objet {mois: {incoming, outgoing}}
    const months: { [key: number]: { incoming: number; outgoing: number } } = {};
    for (let i = 0; i < 12; i++) {
      months[i] = { incoming: 0, outgoing: 0 };
    }

    incomings.forEach(mail => {
      if (mail.date && mail.date.getFullYear() === currentYear) {
        const idx = mail.date.getMonth();
        months[idx].incoming += 1;
      }
    });
    outgoings.forEach(mail => {
      if (mail.date && mail.date.getFullYear() === currentYear) {
        const idx = mail.date.getMonth();
        months[idx].outgoing += 1;
      }
    });

    // Transforme en tableau pour le graphique
    return monthShortNames.map((name, idx) => ({
      name,
      incoming: months[idx].incoming,
      outgoing: months[idx].outgoing,
    }));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-agency-blue flex items-center justify-between">
          <span>Tendance Mensuelle</span>
          <Filter className="h-5 w-5 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer className="h-80" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="incoming" name="Entrants" fill="#4f46e5" />
              <Bar dataKey="outgoing" name="Départs" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendChart;
