
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormSelect from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  filters: {
    month: string;
    year: string;
    mailType: string;
    status: string;
    service: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    medium: string;
  };
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onReset: () => void;
  availableYears: number[];
  availableServices: string[];
}

const MONTHS = [
  { value: "all", label: "Tous les mois" },
  { value: "Janvier", label: "Janvier" },
  { value: "Février", label: "Février" },
  { value: "Mars", label: "Mars" },
  { value: "Avril", label: "Avril" },
  { value: "Mai", label: "Mai" },
  { value: "Juin", label: "Juin" },
  { value: "Juillet", label: "Juillet" },
  { value: "Août", label: "Août" },
  { value: "Septembre", label: "Septembre" },
  { value: "Octobre", label: "Octobre" },
  { value: "Novembre", label: "Novembre" },
  { value: "Décembre", label: "Décembre" },
];

const MAIL_TYPES = [
  { value: "all", label: "Tous les types" },
  { value: "Administrative", label: "Administratif" },
  { value: "Technical", label: "Technique" },
  { value: "Commercial", label: "Commercial" },
  { value: "Financial", label: "Financier" },
  { value: "Other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "Pending", label: "En attente" },
  { value: "Processing", label: "En cours" },
  { value: "Completed", label: "Terminé" },
  { value: "Overdue", label: "En retard" },
];

const MEDIUM_OPTIONS = [
  { value: "all", label: "Tous les supports" },
  { value: "Email", label: "Email" },
  { value: "Physical", label: "Physique" },
  { value: "Fax", label: "Fax" },
  { value: "Other", label: "Autre" },
];

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  availableYears,
  availableServices,
}) => {
  const yearOptions = [
    { value: "all", label: "Toutes les années" },
    ...availableYears.map(year => ({ value: year.toString(), label: year.toString() })),
  ];

  const serviceOptions = [
    { value: "all", label: "Tous les services" },
    ...availableServices.map(service => ({ value: service, label: service })),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres Avancés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FormSelect
            id="month"
            label="Mois"
            value={filters.month}
            onValueChange={(value) => onFiltersChange({ ...filters, month: value })}
            placeholder="Sélectionner un mois"
            options={MONTHS}
          />

          <FormSelect
            id="year"
            label="Année"
            value={filters.year}
            onValueChange={(value) => onFiltersChange({ ...filters, year: value })}
            placeholder="Sélectionner une année"
            options={yearOptions}
          />

          <FormSelect
            id="mailType"
            label="Type de courrier"
            value={filters.mailType}
            onValueChange={(value) => onFiltersChange({ ...filters, mailType: value })}
            placeholder="Sélectionner un type"
            options={MAIL_TYPES}
          />

          <FormSelect
            id="status"
            label="Statut"
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
            placeholder="Sélectionner un statut"
            options={STATUS_OPTIONS}
          />

          <FormSelect
            id="medium"
            label="Support"
            value={filters.medium}
            onValueChange={(value) => onFiltersChange({ ...filters, medium: value })}
            placeholder="Sélectionner un support"
            options={MEDIUM_OPTIONS}
          />

          <FormSelect
            id="service"
            label="Service"
            value={filters.service}
            onValueChange={(value) => onFiltersChange({ ...filters, service: value })}
            placeholder="Sélectionner un service"
            options={serviceOptions}
          />

          {/* Date de début */}
          <div className="form-group">
            <label className="form-label">Date de début</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy", { locale: fr }) : "Sélectionner"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date de fin */}
          <div className="form-group">
            <label className="form-label">Date de fin</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy", { locale: fr }) : "Sélectionner"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={onApply} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Appliquer les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
