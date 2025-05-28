
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

// Données pour les statistiques par type de courrier
const mailTypeData = [
  { name: "Administratif", value: 25, color: "#4f46e5" },
  { name: "Technique", value: 15, color: "#10b981" },
  { name: "Commercial", value: 12, color: "#f59e0b" },
  { name: "Financier", value: 8, color: "#6366f1" },
  { name: "Autre", value: 5, color: "#8b5cf6" },
];

const MailTypeChart: React.FC = () => {
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
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
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
