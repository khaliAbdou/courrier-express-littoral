
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MailStats, MailType } from "@/types/mail";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for demonstration
const mockMonthlyStats: MailStats[] = [
  {
    month: "Janvier",
    year: 2023,
    incomingCount: 42,
    outgoingCount: 38,
    byType: {
      Administrative: 15,
      Technical: 18,
      Commercial: 5,
      Financial: 4,
      Other: 0,
    },
  },
  {
    month: "Février",
    year: 2023,
    incomingCount: 35,
    outgoingCount: 30,
    byType: {
      Administrative: 12,
      Technical: 14,
      Commercial: 6,
      Financial: 3,
      Other: 0,
    },
  },
  {
    month: "Mars",
    year: 2023,
    incomingCount: 45,
    outgoingCount: 40,
    byType: {
      Administrative: 18,
      Technical: 15,
      Commercial: 7,
      Financial: 5,
      Other: 0,
    },
  },
  {
    month: "Avril",
    year: 2023,
    incomingCount: 38,
    outgoingCount: 35,
    byType: {
      Administrative: 14,
      Technical: 16,
      Commercial: 5,
      Financial: 3,
      Other: 0,
    },
  },
  {
    month: "Mai",
    year: 2023,
    incomingCount: 40,
    outgoingCount: 38,
    byType: {
      Administrative: 16,
      Technical: 14,
      Commercial: 6,
      Financial: 4,
      Other: 0,
    },
  },
  {
    month: "Juin",
    year: 2023,
    incomingCount: 48,
    outgoingCount: 42,
    byType: {
      Administrative: 20,
      Technical: 15,
      Commercial: 8,
      Financial: 5,
      Other: 0,
    },
  },
];

// Prepare data for charts
const prepareBarChartData = (stats: MailStats[]) => {
  return stats.map((stat) => ({
    name: stat.month,
    "Courriers Entrants": stat.incomingCount,
    "Courriers Départs": stat.outgoingCount,
  }));
};

const preparePieChartData = (stats: MailStats[], selectedMonth: string) => {
  const monthlyStat = stats.find((stat) => stat.month === selectedMonth);
  
  if (!monthlyStat) return [];
  
  return [
    {
      name: "Administratif",
      value: monthlyStat.byType.Administrative,
      color: "#3b82f6", // blue
    },
    {
      name: "Technique",
      value: monthlyStat.byType.Technical,
      color: "#10b981", // green
    },
    {
      name: "Commercial",
      value: monthlyStat.byType.Commercial,
      color: "#f59e0b", // yellow
    },
    {
      name: "Financier",
      value: monthlyStat.byType.Financial,
      color: "#ef4444", // red
    },
    {
      name: "Autre",
      value: monthlyStat.byType.Other,
      color: "#8b5cf6", // purple
    },
  ].filter((item) => item.value > 0);
};

const StatisticsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("Juin");
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  
  const barChartData = prepareBarChartData(mockMonthlyStats);
  const pieChartData = preparePieChartData(mockMonthlyStats, selectedMonth);
  
  const monthlyStat = mockMonthlyStats.find((stat) => stat.month === selectedMonth);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="page-container flex-1">
        <h1 className="page-title">Statistiques</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Mois</label>
                  <Select 
                    value={selectedMonth} 
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un mois" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMonthlyStats.map((stat) => (
                        <SelectItem key={stat.month} value={stat.month}>
                          {stat.month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Année</label>
                  <Select 
                    value={selectedYear.toString()} 
                    onValueChange={(value) => setSelectedYear(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé {selectedMonth} {selectedYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Courriers Entrants</p>
                  <p className="text-2xl font-bold text-agency-blue">
                    {monthlyStat?.incomingCount || 0}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Courriers Départs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {monthlyStat?.outgoingCount || 0}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 text-center col-span-2">
                  <p className="text-sm text-gray-500">Total Courriers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(monthlyStat?.incomingCount || 0) + (monthlyStat?.outgoingCount || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Évolution Mensuelle</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Courriers Entrants" fill="#3b82f6" />
                  <Bar dataKey="Courriers Départs" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Types de Courriers - {selectedMonth} {selectedYear}</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails par Type - {selectedMonth} {selectedYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStat && Object.entries(monthlyStat.byType).map(([type, count]) => (
                  count > 0 && (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ 
                            backgroundColor: 
                              type === "Administrative" ? "#3b82f6" : 
                              type === "Technical" ? "#10b981" : 
                              type === "Commercial" ? "#f59e0b" : 
                              type === "Financial" ? "#ef4444" : 
                              "#8b5cf6" 
                          }}
                        ></div>
                        <span>{
                          type === "Administrative" ? "Administratif" : 
                          type === "Technical" ? "Technique" : 
                          type === "Commercial" ? "Commercial" : 
                          type === "Financial" ? "Financier" : 
                          "Autre"
                        }</span>
                      </div>
                      <div className="font-bold">{count}</div>
                    </div>
                  )
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>{
                    monthlyStat ? 
                    Object.values(monthlyStat.byType).reduce((sum, count) => sum + count, 0) : 
                    0
                  }</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 Antenne du Littoral de l'Agence des Normes et de la Qualité. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default StatisticsPage;
