import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import DerivativesTable, { DerivativeTransaction } from "@/components/DerivativesTable";
import { DerivativeForm } from "@/components/DerivativeForm";
import { EditDerivativeForm } from "@/components/EditDerivativeForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Derivatives = () => {
  const { toast } = useToast();
  
  // Dados dos derivativos fornecidos pelo usuário
  const initialDerivatives: DerivativeTransaction[] = [
    {
      id: "1",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASL204",
      strike: 20.44,
      vencimento: "2025-12-19",
      quantidade: 200,
      premio: 1.5,
      status: "aberta",
      valor_total: 300
    },
    {
      id: "2",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASH290",
      strike: 27.36,
      vencimento: "2026-08-21",
      quantidade: 400,
      premio: 4.9,
      status: "aberta",
      valor_total: 1960
    },
    {
      id: "3",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASJ270",
      strike: 25.61,
      vencimento: "2026-10-16",
      quantidade: 200,
      premio: 5.5,
      status: "aberta",
      valor_total: 1100
    },
    {
      id: "4",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "BBAS3",
      codigo_opcao: "BBASJ210",
      strike: 19.61,
      vencimento: "2026-10-16",
      quantidade: 400,
      premio: 4.12,
      status: "aberta",
      valor_total: 1648
    },
    {
      id: "5",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "PETR4",
      codigo_opcao: "PETRJ362",
      strike: 31.27,
      vencimento: "2026-10-16",
      quantidade: 200,
      premio: 6.1,
      status: "aberta",
      valor_total: 1220
    },
    {
      id: "6",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "PETR4",
      codigo_opcao: "PETRD400",
      strike: 30.25,
      vencimento: "2026-04-17",
      quantidade: 200,
      premio: 7.9,
      status: "aberta",
      valor_total: 1580
    },
    {
      id: "7",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "GOAU4",
      codigo_opcao: "GOAUL100",
      strike: 9.39,
      vencimento: "2025-12-18",
      quantidade: 1500,
      premio: 2.08,
      status: "aberta",
      valor_total: 3120
    },
    {
      id: "8",
      data: "2025-08-01",
      tipo_operacao: "venda",
      tipo_derivativo: "call",
      ativo_subjacente: "GOAU4",
      codigo_opcao: "GOAUJ974",
      strike: 9.4,
      vencimento: "2026-10-15",
      quantidade: 1000,
      premio: 2.6,
      status: "aberta",
      valor_total: 2600
    }
  ];

  const [derivatives, setDerivatives] = useState<DerivativeTransaction[]>(initialDerivatives);
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
      const updatedDerivative: DerivativeTransaction = {
        ...editingDerivative,
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
      
      setDerivatives(prev => 
        prev.map(t => t.id === editingDerivative.id ? updatedDerivative : t)
      );
    }
  };

  const handleDelete = (id: string) => {
    setDerivatives(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Derivativo excluído",
      description: "O derivativo foi removido com sucesso.",
      variant: "destructive",
    });
  };

  const handleNewDerivative = (derivativeData: any) => {
    const newDerivative: DerivativeTransaction = {
      id: (derivatives.length + 1).toString(),
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
    
    setDerivatives(prev => [newDerivative, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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