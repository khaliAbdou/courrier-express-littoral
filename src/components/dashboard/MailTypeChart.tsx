import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import { IncomingMail } from "@/types/mail";

// Fonction utilitaire pour lire les courriers entrants du localStorage
function getAllIncomingMails(): IncomingMail[] {
  const key = "incomingMails";
  const existing = localStorage.getItem(key);
  if (!existing) return [];
  return JSON.parse(existing);
}

// Couleurs pour chaque type
const TYPE_COLORS: { [key: string]: string } = {
  Administrative: "#4f46e5", // violet foncé
  Technical: "#10b981",      // vert
  Commercial: "#f59e0b",     // jaune
  Financial: "#6366f1",      // bleu lavande
  Other: "#8b5cf6",          // violet clair
};

const LABELS: { [key: string]: string } = {
  Administrative: "Administratif",
  Technical: "Technique",
  Commercial: "Commercial",
  Financial: "Financier",
  Other: "Autre",
};

const MAIL_TYPES = ["Administrative", "Technical", "Commercial", "Financial", "Other"];

const MailTypeChart: React.FC = () => {
  // Regroupe par type de mail
  const mailTypeData = useMemo(() => {
    const mails = getAllIncomingMails();
    const counts: { [key: string]: number } = {};
    MAIL_TYPES.forEach(type => counts[type] = 0);

    mails.forEach((mail) => {
      const type = mail.mailType || "Other";
      counts[type] = (counts[type] || 0) + 1;
    });

    return MAIL_TYPES
      .map(type => ({
        name: LABELS[type],
        value: counts[type],
        color: TYPE_COLORS[type],
      }))
      .filter(item => item.value > 0);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-agency-blue flex items-center justify-between">
          <span>Répartition par Type</span>
          <ArrowUpDown className="h-5 w-5 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mailTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mailTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MailTypeChart;
