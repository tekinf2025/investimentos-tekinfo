import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FilterBarProps {
  onSearch: (term: string) => void;
  onAssetTypeFilter: (type: string) => void;
  onAssetFilter: (asset: string) => void;
  onPeriodFilter: (period: string) => void;
  onClearFilters: () => void;
  assets: string[];
}

const FilterBar = ({ 
  onSearch, 
  onAssetTypeFilter, 
  onAssetFilter, 
  onPeriodFilter, 
  onClearFilters,
  assets 
}: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    onClearFilters();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-trading-green" />
        <span className="text-text-primary font-medium">Filtros</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Buscar</label>
          <Input
            placeholder="Ex: PETR4, ações..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-input border-border focus:ring-trading-green"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Tipo de Ativo</label>
          <Select onValueChange={onAssetTypeFilter}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="acoes">Ações</SelectItem>
              <SelectItem value="fundos_imobiliarios">Fundos Imobiliários</SelectItem>
              <SelectItem value="renda_fixa">Renda Fixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Ativo</label>
          <Select onValueChange={onAssetFilter}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Todos os ativos" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Todos os ativos</SelectItem>
              {assets.map((asset) => (
                <SelectItem key={asset} value={asset}>
                  {asset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Período</label>
          <Select onValueChange={onPeriodFilter}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Todos os períodos" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="text-text-secondary border-border hover:bg-surface-hover"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;