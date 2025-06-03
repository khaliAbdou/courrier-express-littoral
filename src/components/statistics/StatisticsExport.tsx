
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

interface StatisticsExportProps {
  data: any;
  filters: any;
}

const StatisticsExport: React.FC<StatisticsExportProps> = ({ data, filters }) => {
  const exportToCSV = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Mois,Année,Courriers Entrants,Courriers Sortants,Total\n"
        + data.map((row: any) => 
            `${row.month},${row.year},${row.incomingCount},${row.outgoingCount},${row.incomingCount + row.outgoingCount}`
          ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `statistiques_courriers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export CSV réussi !");
    } catch (error) {
      toast.error("Erreur lors de l'export CSV");
    }
  };

  const exportToPDF = () => {
    toast.info("Fonctionnalité d'export PDF en cours de développement");
  };

  const printReport = () => {
    try {
      // Ouvrir la page d'accueil dans une nouvelle fenêtre
      const printWindow = window.open('/', '_blank');
      
      if (printWindow) {
        // Attendre que la page soit chargée avant de lancer l'impression
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            // Fermer la fenêtre après l'impression
            printWindow.onafterprint = () => {
              printWindow.close();
            };
          }, 1000);
        };
        toast.success("Impression de la page d'accueil lancée !");
      } else {
        toast.error("Impossible d'ouvrir la fenêtre d'impression");
      }
    } catch (error) {
      toast.error("Erreur lors du lancement de l'impression");
    }
  };

  const exportToExcel = () => {
    toast.info("Fonctionnalité d'export Excel en cours de développement");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export et Impression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </Button>
          
          <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          
          <Button onClick={exportToPDF} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          
          <Button onClick={printReport} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsExport;
