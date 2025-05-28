
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";

const RecentActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-agency-blue">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3 border-b pb-3 last:border-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                i % 2 === 0 ? "bg-blue-100" : "bg-green-100"
              }`}>
                {i % 2 === 0 ? (
                  <Mail className={`h-4 w-4 ${i % 2 === 0 ? "text-agency-blue" : "text-green-600"}`} />
                ) : (
                  <Send className={`h-4 w-4 ${i % 2 === 0 ? "text-agency-blue" : "text-green-600"}`} />
                )}
              </div>
              <div>
                <p className="font-medium">{
                  i % 2 === 0 
                    ? "Nouveau courrier entrant enregistré" 
                    : "Nouveau courrier départ enregistré"
                }</p>
                <p className="text-sm text-gray-500">Il y a {(i + 1) * 2} heures</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
