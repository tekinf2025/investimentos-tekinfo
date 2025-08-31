import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import DividendsTable, { DividendTransaction } from "@/components/DividendsTable";
import { DividendForm } from "@/components/DividendForm";
import { EditDividendForm } from "@/components/EditDividendForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Dividends = () => {
  const { toast } = useToast();
  
  // Dados dos proventos fornecidos pelo usuário
  const initialDividends: DividendTransaction[] = [
    {
      id: "1",
      tipo_provento: "dividendos",
      ativo: "GARE11",
      data: "2025-09-07",
      valor: 0.08,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "2",
      tipo_provento: "dividendos",
      ativo: "MXRF11",
      data: "2025-09-14",
      valor: 0.1,
      quantidade: 5000,
      a_receber: false
    },
    {
      id: "3",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-11-22",
      valor: 0.28,
      quantidade: 400,
      a_receber: true
    },
    {
      id: "4",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-12-22",
      valor: 0.31,
      quantidade: 400,
      a_receber: true
    },
    {
      id: "5",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2025-08-19",
      valor: 0.08,
      quantidade: 2500,
      a_receber: false
    },
    {
      id: "6",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2024-12-05",
      valor: 0.41,
      quantidade: 1200,
      a_receber: false
    },
    {
      id: "7",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2024-12-26",
      valor: 0.15,
      quantidade: 900,
      a_receber: false
    },
    {
      id: "8",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2025-03-19",
      valor: 0.44,
      quantidade: 600,
      a_receber: false
    },
    {
      id: "9",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2025-03-20",
      valor: 0.13,
      quantidade: 600,
      a_receber: false
    },
    {
      id: "10",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2024-05-25",
      valor: 0.19,
      quantidade: 600,
      a_receber: false
    },
    {
      id: "11",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2024-08-20",
      valor: 0.08,
      quantidade: 1200,
      a_receber: false
    },
    {
      id: "12",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-06-19",
      valor: 0.36,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "13",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2025-03-16",
      valor: 0.05,
      quantidade: 2500,
      a_receber: false
    },
    {
      id: "14",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2025-05-19",
      valor: 0.08,
      quantidade: 3300,
      a_receber: false
    },
    {
      id: "15",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-09-22",
      valor: 0.43,
      quantidade: 400,
      a_receber: true
    },
    {
      id: "16",
      tipo_provento: "dividendos",
      ativo: "BBAS3",
      data: "2025-06-12",
      valor: 0.18,
      quantidade: 1200,
      a_receber: false
    },
    {
      id: "17",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-08-20",
      valor: 0.38,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "18",
      tipo_provento: "dividendos",
      ativo: "GOAU4",
      data: "2024-12-16",
      valor: 0.13,
      quantidade: 2500,
      a_receber: false
    },
    {
      id: "19",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-05-19",
      valor: 0.36,
      quantidade: 400,
      a_receber: false
    },
    {
      id: "20",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2024-12-22",
      valor: 1.55,
      quantidade: 200,
      a_receber: false
    },
    {
      id: "21",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-02-19",
      valor: 0.56,
      quantidade: 200,
      a_receber: false
    },
    {
      id: "22",
      tipo_provento: "dividendos",
      ativo: "PETR4",
      data: "2025-03-19",
      valor: 0.67,
      quantidade: 200,
      a_receber: false
    }
  ];

  const [dividends, setDividends] = useState<DividendTransaction[]>(initialDividends);
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
      const updatedDividend: DividendTransaction = {
        ...editingDividend,
        tipo_provento: updatedData.tipo_provento,
        ativo: updatedData.ativo,
        data: format(updatedData.data, "yyyy-MM-dd"),
        valor: updatedData.valor,
        quantidade: updatedData.quantidade,
        a_receber: updatedData.a_receber,
      };
      
      setDividends(prev => 
        prev.map(t => t.id === editingDividend.id ? updatedDividend : t)
      );
    }
  };

  const handleDelete = (id: string) => {
    setDividends(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Provento excluído",
      description: "O provento foi removido com sucesso.",
      variant: "destructive",
    });
  };

  const handleNewDividend = (dividendData: any) => {
    const newDividend: DividendTransaction = {
      id: (dividends.length + 1).toString(),
      tipo_provento: dividendData.tipo_provento,
      ativo: dividendData.ativo,
      data: format(dividendData.data, "yyyy-MM-dd"),
      valor: dividendData.valor,
      quantidade: dividendData.quantidade,
      a_receber: dividendData.a_receber,
    };
    
    setDividends(prev => [newDividend, ...prev]);
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