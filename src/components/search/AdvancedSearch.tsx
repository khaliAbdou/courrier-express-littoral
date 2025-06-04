
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchFilters {
  keyword: string;
  type: 'all' | 'incoming' | 'outgoing';
  status: string;
  dateFrom?: Date;
  dateTo?: Date;
  sender: string;
  service: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    type: 'all',
    status: '',
    dateFrom: undefined,
    dateTo: undefined,
    sender: '',
    service: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      type: 'all',
      status: '',
      dateFrom: undefined,
      dateTo: undefined,
      sender: '',
      service: ''
    });
    onReset();
  };

  const hasActiveFilters = () => {
    return filters.keyword || 
           filters.type !== 'all' || 
           filters.status || 
           filters.dateFrom || 
           filters.dateTo || 
           filters.sender || 
           filters.service;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche Avancée
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche de base */}
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher par mot-clé, numéro, objet..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtres avancés */}
        {isExpanded && (
          <div className="space-y-4 p-4 bg-gray-50 rounded border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="incoming">Entrants</SelectItem>
                    <SelectItem value="outgoing">Sortants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="Pending">En attente</SelectItem>
                    <SelectItem value="Processing">En cours</SelectItem>
                    <SelectItem value="Completed">Terminé</SelectItem>
                    <SelectItem value="Overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Expéditeur/Service</label>
                <Input
                  placeholder="Nom ou service..."
                  value={filters.sender}
                  onChange={(e) => handleFilterChange('sender', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date de début</label>
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
                      {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy") : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange('dateFrom', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date de fin</label>
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
                      {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy") : "Sélectionner"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange('dateTo', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSearch} className="flex-1">
                Rechercher
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
            </div>
          </div>
        )}

        {/* Filtres actifs */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2">
            {filters.keyword && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Mot-clé: {filters.keyword}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('keyword', '')}
                />
              </Badge>
            )}
            {filters.type !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {filters.type === 'incoming' ? 'Entrants' : 'Sortants'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('type', 'all')}
                />
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Statut: {filters.status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('status', '')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
