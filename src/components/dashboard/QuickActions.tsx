
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";
import { BarChart } from "recharts";
import { Link } from "react-router-dom";

const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-agency-blue">Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/incoming" 
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Mail className="h-10 w-10 text-agency-blue mb-2" />
            <span className="text-center">Enregistrer un Courrier Entrant</span>
          </Link>
          <Link 
            to="/outgoing" 
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-green-50 transition-colors"
          >
            <Send className="h-10 w-10 text-green-600 mb-2" />
            <span className="text-center">Enregistrer un Courrier Départ</span>
          </Link>
          <Link 
            to="/statistics" 
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-purple-50 transition-colors col-span-1 sm:col-span-2"
          >
            <BarChart className="h-10 w-10 text-purple-600 mb-2" />
            <span className="text-center">Voir les Statistiques</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
