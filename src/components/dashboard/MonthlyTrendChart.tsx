
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Données pour les statistiques mensuelles
const monthlyData = [
  { name: "Jan", incoming: 12, outgoing: 10 },
  { name: "Fév", incoming: 15, outgoing: 12 },
  { name: "Mar", incoming: 18, outgoing: 15 },
  { name: "Avr", incoming: 14, outgoing: 18 },
  { name: "Mai", incoming: 20, outgoing: 17 },
  { name: "Juin", incoming: 22, outgoing: 20 },
];

const MonthlyTrendChart: React.FC = () => {
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
              <YAxis />
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
