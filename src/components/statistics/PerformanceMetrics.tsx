
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, TrendingUp, TrendingDown, Target, 
  AlertTriangle, CheckCircle, BarChart, Activity 
} from "lucide-react";

interface PerformanceMetricsProps {
  metrics: {
    averageResponseTime: number;
    processingEfficiency: number;
    overdueRate: number;
    completionRate: number;
    monthlyGrowth: number;
    totalProcessed: number;
    pendingCount: number;
    priorityItems: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-blue-500" />
              <Badge variant={metrics.averageResponseTime <= 5 ? "default" : "destructive"}>
                {metrics.averageResponseTime <= 5 ? "Bon" : "À améliorer"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{metrics.averageResponseTime} jours</p>
              <p className="text-sm text-gray-500">Temps de réponse moyen</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-green-500" />
              <Badge variant={metrics.processingEfficiency >= 80 ? "default" : "secondary"}>
                {metrics.processingEfficiency >= 80 ? "Excellent" : "Moyen"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{metrics.processingEfficiency}%</p>
              <p className="text-sm text-gray-500">Efficacité de traitement</p>
              <Progress value={metrics.processingEfficiency} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <Badge variant={metrics.overdueRate <= 10 ? "default" : "destructive"}>
                {metrics.overdueRate <= 10 ? "Contrôlé" : "Critique"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{metrics.overdueRate}%</p>
              <p className="text-sm text-gray-500">Taux de retard</p>
              <Progress value={metrics.overdueRate} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-purple-500" />
              {metrics.monthlyGrowth >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{Math.abs(metrics.monthlyGrowth)}%</p>
              <p className="text-sm text-gray-500">
                Croissance mensuelle {metrics.monthlyGrowth >= 0 ? "↗" : "↘"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicateurs détaillés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Indicateurs Détaillés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taux de finalisation</span>
                <span className="text-sm font-bold">{metrics.completionRate}%</span>
              </div>
              <Progress value={metrics.completionRate} className="w-full" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Courriers traités</span>
                <span className="text-sm font-bold">{metrics.totalProcessed}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-500">Ce mois</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">En attente</span>
                <span className="text-sm font-bold text-orange-600">{metrics.pendingCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-gray-500">À traiter</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
