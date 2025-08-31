import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import DividendsTable, { DividendTransaction } from "@/components/DividendsTable";
import { DividendForm } from "@/components/DividendForm";
import { EditDividendForm } from "@/components/EditDividendForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useProventos, ProventoData } from "@/hooks/useProventos";

const Dividends = () => {
  const { toast } = useToast();
  const { proventos, isLoading, addProvento, updateProvento, deleteProvento } = useProventos();
  
  // Converter dados do Supabase para o formato esperado pelo componente
  const dividends: DividendTransaction[] = proventos.map(provento => ({
    id: provento.id.toString(),
    tipo_provento: provento.tipo_provento,
    ativo: provento.ativo,
    data: provento.data,
    valor: provento.valor,
    quantidade: provento.quantidade,
    a_receber: provento.a_receber
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [assetFilter, setAssetFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [editingDividend, setEditingDividend] = useState<DividendTransaction | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Lista única de ativos para o filtro
  const uniqueAssets = useMemo(() => {
    const assets = [...new Set(dividends.map(t => t.ativo))];
    return assets.sort();
  }, [dividends]);

  // Proventos filtrados
  const filteredDividends = useMemo(() => {
    return dividends.filter(dividend => {
      const matchesSearch = searchTerm === "" || 
        dividend.ativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dividend.tipo_provento.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAssetType = assetTypeFilter === "all" || 
        dividend.tipo_provento === assetTypeFilter;
      
      const matchesAsset = assetFilter === "all" || 
        dividend.ativo === assetFilter;
      
      const matchesPeriod = periodFilter === "all" || 
        dividend.data.startsWith(periodFilter);

      return matchesSearch && matchesAssetType && matchesAsset && matchesPeriod;
    });
  }, [dividends, searchTerm, assetTypeFilter, assetFilter, periodFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setAssetTypeFilter("all");
    setAssetFilter("all");
    setPeriodFilter("all");
  };

  const handleEdit = (dividend: DividendTransaction) => {
    setEditingDividend(dividend);
    setShowEditForm(true);
  };

  const handleEditSubmit = (updatedData: any) => {
    if (editingDividend) {
      const proventoData: Omit<Partial<ProventoData>, 'id'> = {
        tipo_provento: updatedData.tipo_provento,
        ativo: updatedData.ativo,
        data: format(updatedData.data, "yyyy-MM-dd"),
        valor: updatedData.valor,
        quantidade: updatedData.quantidade,
        a_receber: updatedData.a_receber,
      };
      
      updateProvento(parseInt(editingDividend.id), proventoData);
    }
  };

  const handleDelete = (id: string) => {
    deleteProvento(parseInt(id));
  };

  const handleNewDividend = (dividendData: any) => {
    const proventoData: Omit<ProventoData, 'id'> = {
      tipo_provento: dividendData.tipo_provento,
      ativo: dividendData.ativo,
      data: format(dividendData.data, "yyyy-MM-dd"),
      valor: dividendData.valor,
      quantidade: dividendData.quantidade,
      a_receber: dividendData.a_receber,
    };
    
    addProvento(proventoData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Navigation />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                B3 - Lançamentos de Proventos
              </h1>
              <p className="text-text-secondary">
                Gerencie e visualize seu histórico de proventos de investimentos na bolsa brasileira
              </p>
            </div>
            <DividendForm onSubmit={handleNewDividend} />
          </div>
        </div>

        <FilterBar
          onSearch={setSearchTerm}
          onAssetTypeFilter={setAssetTypeFilter}
          onAssetFilter={setAssetFilter}
          onPeriodFilter={setPeriodFilter}
          onClearFilters={handleClearFilters}
          assets={uniqueAssets}
        />

        <div className="mb-4 text-sm text-text-secondary">
          Exibindo {filteredDividends.length} de {dividends.length} proventos
        </div>

        <DividendsTable
          dividends={filteredDividends}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EditDividendForm
          dividend={editingDividend}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
};

export default Dividends;