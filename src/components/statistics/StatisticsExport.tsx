
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import ExportButtons from "./ExportButtons";

interface StatisticsExportProps {
  data: any;
  filters: any;
}

const StatisticsExport: React.FC<StatisticsExportProps> = ({ data, filters }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export et Impression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ExportButtons data={data} />
      </CardContent>
    </Card>
  );
};

export default StatisticsExport;
