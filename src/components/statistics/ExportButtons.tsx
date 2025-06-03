
import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { printHomePage } from "@/utils/printUtils";

interface ExportButtonsProps {
  data: any[];
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Button 
        onClick={() => exportToCSV(data)} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        CSV
      </Button>
      
      <Button 
        onClick={() => exportToExcel(data)} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      
      <Button 
        onClick={() => exportToPDF(data)} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      
      <Button 
        onClick={printHomePage} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
};

export default ExportButtons;
