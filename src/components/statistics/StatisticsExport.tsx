
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Déclaration de type pour jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface StatisticsExportProps {
  data: any;
  filters: any;
}

const StatisticsExport: React.FC<StatisticsExportProps> = ({ data, filters }) => {
  const exportToCSV = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      // En-têtes CSV
      const headers = ["Mois", "Année", "Courriers Entrants", "Courriers Sortants", "Total"];
      
      // Données CSV
      const csvData = data.map((row: any) => [
        row.month || '',
        row.year || '',
        row.incomingCount || 0,
        row.outgoingCount || 0,
        (row.incomingCount || 0) + (row.outgoingCount || 0)
      ]);

      // Créer le contenu CSV
      const csvContent = [
        headers.join(','),
        ...csvData.map((row: any[]) => row.join(','))
      ].join('\n');

      // Créer et télécharger le fichier
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `statistiques_courriers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Export CSV réussi !");
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      toast.error("Erreur lors de l'export CSV");
    }
  };

  const exportToExcel = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      // Préparer les données pour Excel
      const excelData = data.map((row: any) => ({
        'Mois': row.month || '',
        'Année': row.year || '',
        'Courriers Entrants': row.incomingCount || 0,
        'Courriers Sortants': row.outgoingCount || 0,
        'Total': (row.incomingCount || 0) + (row.outgoingCount || 0)
      }));

      // Créer un nouveau classeur
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Statistiques");

      // Ajuster la largeur des colonnes
      const columnWidths = [
        { wch: 15 }, // Mois
        { wch: 10 }, // Année
        { wch: 18 }, // Courriers Entrants
        { wch: 18 }, // Courriers Sortants
        { wch: 10 }  // Total
      ];
      worksheet['!cols'] = columnWidths;

      // Télécharger le fichier
      XLSX.writeFile(workbook, `statistiques_courriers_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success("Export Excel réussi !");
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      toast.error("Erreur lors de l'export Excel");
    }
  };

  const exportToPDF = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      const doc = new jsPDF();
      
      // Titre du document
      doc.setFontSize(16);
      doc.text('Statistiques des Courriers', 14, 22);
      
      // Date d'export
      doc.setFontSize(10);
      doc.text(`Exporté le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

      // Préparer les données pour le tableau
      const tableData = data.map((row: any) => [
        row.month || '',
        row.year || '',
        row.incomingCount || 0,
        row.outgoingCount || 0,
        (row.incomingCount || 0) + (row.outgoingCount || 0)
      ]);

      // Créer le tableau
      doc.autoTable({
        head: [['Mois', 'Année', 'Courriers Entrants', 'Courriers Sortants', 'Total']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 20 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 20 }
        }
      });

      // Sauvegarder le PDF
      doc.save(`statistiques_courriers_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("Export PDF réussi !");
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast.error("Erreur lors de l'export PDF");
    }
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
