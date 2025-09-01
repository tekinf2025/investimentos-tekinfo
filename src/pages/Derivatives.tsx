import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import DerivativesTable, { DerivativeTransaction } from "@/components/DerivativesTable";
import { DerivativeForm } from "@/components/DerivativeForm";
import { EditDerivativeForm } from "@/components/EditDerivativeForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useDerivatives, DerivativeData } from "@/hooks/useDerivatives";
import Logo from "@/components/Logo";

const Derivatives = () => {
  const { toast } = useToast();
  const { derivatives: derivativesData, isLoading, addDerivative, updateDerivative, deleteDerivative } = useDerivatives();
  
  // Converter dados do Supabase para o formato esperado pelo componente
  const derivatives: DerivativeTransaction[] = derivativesData.map(derivative => ({
    id: derivative.id.toString(),
    data: derivative.data,
    tipo_operacao: derivative.tipo_operacao,
    tipo_derivativo: derivative.tipo_derivativo,
    ativo_subjacente: derivative.ativo_subjacente,
    codigo_opcao: derivative.codigo_opcao || '',
    strike: derivative.strike,
    vencimento: derivative.vencimento,
    quantidade: derivative.quantidade,
    premio: derivative.premio,
    status: derivative.status,
    valor_total: derivative.valor_total
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [assetFilter, setAssetFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [editingDerivative, setEditingDerivative] = useState<DerivativeTransaction | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Lista única de ativos para o filtro
  const uniqueAssets = useMemo(() => {
    const assets = [...new Set(derivatives.map(t => t.ativo_subjacente))];
    return assets.sort();
  }, [derivatives]);

  // Derivativos filtrados
  const filteredDerivatives = useMemo(() => {
    return derivatives.filter(derivative => {
      const matchesSearch = searchTerm === "" || 
        derivative.ativo_subjacente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        derivative.codigo_opcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        derivative.tipo_derivativo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAssetType = assetTypeFilter === "all" || 
        derivative.tipo_derivativo === assetTypeFilter;
      
      const matchesAsset = assetFilter === "all" || 
        derivative.ativo_subjacente === assetFilter;
      
      const matchesPeriod = periodFilter === "all" || 
        derivative.data.startsWith(periodFilter);

      return matchesSearch && matchesAssetType && matchesAsset && matchesPeriod;
    });
  }, [derivatives, searchTerm, assetTypeFilter, assetFilter, periodFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setAssetTypeFilter("all");
    setAssetFilter("all");
    setPeriodFilter("all");
  };

  const handleEdit = (derivative: DerivativeTransaction) => {
    setEditingDerivative(derivative);
    setShowEditForm(true);
  };

  const handleEditSubmit = (updatedData: any) => {
    if (editingDerivative) {
      const derivativeData: Omit<Partial<DerivativeData>, 'id'> = {
        data: format(updatedData.data, "yyyy-MM-dd"),
        tipo_operacao: updatedData.tipo_operacao,
        tipo_derivativo: updatedData.tipo_derivativo,
        ativo_subjacente: updatedData.ativo_subjacente,
        codigo_opcao: updatedData.codigo_opcao,
        strike: updatedData.strike,
        vencimento: format(updatedData.vencimento, "yyyy-MM-dd"),
        quantidade: updatedData.quantidade,
        premio: updatedData.premio,
        status: updatedData.status,
        valor_total: updatedData.valor_total,
      };
      
      updateDerivative(parseInt(editingDerivative.id), derivativeData);
    }
  };

  const handleDelete = (id: string) => {
    deleteDerivative(parseInt(id));
  };

  const handleNewDerivative = (derivativeData: any) => {
    const newDerivativeData: Omit<DerivativeData, 'id'> = {
      data: format(derivativeData.data, "yyyy-MM-dd"),
      tipo_operacao: derivativeData.tipo_operacao,
      tipo_derivativo: derivativeData.tipo_derivativo,
      ativo_subjacente: derivativeData.ativo_subjacente,
      codigo_opcao: derivativeData.codigo_opcao,
      strike: derivativeData.strike,
      vencimento: format(derivativeData.vencimento, "yyyy-MM-dd"),
      quantidade: derivativeData.quantidade,
      premio: derivativeData.premio,
      status: derivativeData.status,
      valor_total: derivativeData.valor_total,
    };
    
    addDerivative(newDerivativeData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Logo />
        <Navigation />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                B3 - Lançamentos de Derivativos
              </h1>
              <p className="text-text-secondary">
                Gerencie e visualize seu histórico de operações com derivativos na bolsa brasileira
              </p>
            </div>
            <DerivativeForm onSubmit={handleNewDerivative} />
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
          Exibindo {filteredDerivatives.length} de {derivatives.length} derivativos
        </div>

        <DerivativesTable
          derivatives={filteredDerivatives}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EditDerivativeForm
          derivative={editingDerivative}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
};

export default Derivatives;