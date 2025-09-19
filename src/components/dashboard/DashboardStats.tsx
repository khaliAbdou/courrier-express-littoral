
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Mail, Send, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { getIncomingMailsFromStorage, getOutgoingMailsFromStorage } from "@/utils/dataHelpers";

interface DashboardStatsProps {
  totalIncoming: number;
  totalOutgoing: number;
  pending: number;
  processed: number;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  index: number;
}> = ({ title, value, icon: Icon, bgColor, iconColor, index }) => (
  <Card className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
    <CardContent className="p-6 flex flex-col items-center">
      <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center mb-4 transition-transform hover:scale-110`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <CardTitle className="text-2xl mb-1 font-bold">{value.toLocaleString('fr-FR')}</CardTitle>
      <p className="text-gray-500 text-sm text-center">{title}</p>
    </CardContent>
  </Card>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  totalIncoming, 
  totalOutgoing, 
  pending, 
  processed 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    {
      title: "Courriers Entrants",
      value: totalIncoming,
      icon: Mail,
      bgColor: "bg-blue-100",
      iconColor: "text-agency-blue"
    },
    {
      title: "Courriers Départs",
      value: totalOutgoing,
      icon: Send,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "En Attente",
      value: pending,
      icon: Clock,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500"
    },
    {
      title: "Traités",
      value: processed,
      icon: CheckCircle,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          bgColor={stat.bgColor}
          iconColor={stat.iconColor}
          index={index}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
