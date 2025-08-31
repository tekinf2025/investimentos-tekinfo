import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import SalesTable, { SaleTransaction } from "@/components/SalesTable";
import { SaleForm } from "@/components/SaleForm";
import { EditSaleForm } from "@/components/EditSaleForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useVendas, VendaData } from "@/hooks/useVendas";

const Sales = () => {
  const { toast } = useToast();
  const { vendas, isLoading, addVenda, updateVenda, deleteVenda } = useVendas();
  
  // Converter dados do Supabase para o formato esperado pelo componente
  const sales: SaleTransaction[] = vendas.map(venda => ({
    id: venda.id.toString(),
    tipo_ativo: venda.tipo_ativo,
    ativo: venda.ativo,
    data: venda.data,
    quantidade: venda.quantidade,
    preco: venda.preco,
    corretagem: venda.corretagem || 0,
    valor_total: venda.valor_total
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [assetFilter, setAssetFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [editingSale, setEditingSale] = useState<SaleTransaction | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Lista única de ativos para o filtro
  const uniqueAssets = useMemo(() => {
    const assets = [...new Set(sales.map(t => t.ativo))];
    return assets.sort();
  }, [sales]);

  // Vendas filtradas
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch = searchTerm === "" || 
        sale.ativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.tipo_ativo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAssetType = assetTypeFilter === "all" || 
        sale.tipo_ativo === assetTypeFilter;
      
      const matchesAsset = assetFilter === "all" || 
        sale.ativo === assetFilter;
      
      const matchesPeriod = periodFilter === "all" || 
        sale.data.startsWith(periodFilter);

      return matchesSearch && matchesAssetType && matchesAsset && matchesPeriod;
    });
  }, [sales, searchTerm, assetTypeFilter, assetFilter, periodFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setAssetTypeFilter("all");
    setAssetFilter("all");
    setPeriodFilter("all");
  };

  const handleEdit = (sale: SaleTransaction) => {
    setEditingSale(sale);
    setShowEditForm(true);
  };

  const handleEditSubmit = (updatedData: any) => {
    if (editingSale) {
      const vendaData: Omit<Partial<VendaData>, 'id'> = {
        tipo_ativo: updatedData.tipo_ativo,
        ativo: updatedData.ativo,
        data: format(updatedData.data, "yyyy-MM-dd"),
        quantidade: updatedData.quantidade,
        preco: updatedData.preco,
        corretagem: updatedData.corretagem,
        valor_total: updatedData.valor_total,
      };
      
      updateVenda(parseInt(editingSale.id), vendaData);
    }
  };

  const handleDelete = (id: string) => {
    deleteVenda(parseInt(id));
  };

  const handleNewSale = (saleData: any) => {
    const vendaData: Omit<VendaData, 'id'> = {
      tipo_ativo: saleData.tipo_ativo,
      ativo: saleData.ativo,
      data: format(saleData.data, "yyyy-MM-dd"),
      quantidade: saleData.quantidade,
      preco: saleData.preco,
      corretagem: saleData.corretagem,
      valor_total: saleData.valor_total,
    };
    
    addVenda(vendaData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Navigation />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                B3 - Lançamentos de Vendas
              </h1>
              <p className="text-text-secondary">
                Gerencie e visualize seu histórico de vendas de investimentos na bolsa brasileira
              </p>
            </div>
            <SaleForm onSubmit={handleNewSale} />
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
          Exibindo {filteredSales.length} de {sales.length} vendas
        </div>

        <SalesTable
          sales={filteredSales}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EditSaleForm
          sale={editingSale}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
};

export default Sales;