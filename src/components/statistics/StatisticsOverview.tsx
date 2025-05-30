
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailStats } from "@/types/mail";

interface StatisticsOverviewProps {
  filteredStats: MailStats[];
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({ filteredStats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {filteredStats.map((stat) => (
        <Card key={`${stat.year}-${stat.month}`}>
          <CardHeader>
            <CardTitle className="text-lg">{stat.month} {stat.year}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stat.incomingCount}</p>
                <p className="text-sm text-gray-600">Entrants</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stat.outgoingCount}</p>
                <p className="text-sm text-gray-600">Sortants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsOverview;
