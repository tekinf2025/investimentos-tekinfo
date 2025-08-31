import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import TradingTable, { Transaction } from "@/components/TradingTable";
import { PurchaseForm } from "@/components/PurchaseForm";
import { EditTransactionForm } from "@/components/EditTransactionForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useCompras, CompraData } from "@/hooks/useCompras";

const Index = () => {
  const { toast } = useToast();
  const { compras, isLoading, addCompra, updateCompra, deleteCompra } = useCompras();
  
  // Converter dados do Supabase para o formato esperado pelo componente
  const transactions: Transaction[] = compras.map(compra => ({
    id: compra.id.toString(),
    tipo_ativo: compra.tipo_ativo,
    ativo: compra.ativo,
    data: compra.data,
    quantidade: compra.quantidade,
    preco: compra.preco,
    corretagem: compra.corretagem || 0,
    valor_total: compra.valor_total
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [assetFilter, setAssetFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Lista única de ativos para o filtro
  const uniqueAssets = useMemo(() => {
    const assets = [...new Set(transactions.map(t => t.ativo))];
    return assets.sort();
  }, [transactions]);

  // Transações filtradas
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = searchTerm === "" || 
        transaction.ativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.tipo_ativo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAssetType = assetTypeFilter === "all" || 
        transaction.tipo_ativo === assetTypeFilter;
      
      const matchesAsset = assetFilter === "all" || 
        transaction.ativo === assetFilter;
      
      const matchesPeriod = periodFilter === "all" || 
        transaction.data.startsWith(periodFilter);

      return matchesSearch && matchesAssetType && matchesAsset && matchesPeriod;
    });
  }, [transactions, searchTerm, assetTypeFilter, assetFilter, periodFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setAssetTypeFilter("all");
    setAssetFilter("all");
    setPeriodFilter("all");
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditForm(true);
  };

  const handleEditSubmit = (updatedData: any) => {
    if (editingTransaction) {
      const compraData: Omit<Partial<CompraData>, 'id'> = {
        tipo_ativo: updatedData.tipo_ativo,
        ativo: updatedData.ativo,
        data: format(updatedData.data, "yyyy-MM-dd"),
        quantidade: updatedData.quantidade,
        preco: updatedData.preco,
        corretagem: updatedData.corretagem,
        valor_total: updatedData.valor_total,
      };
      
      updateCompra(parseInt(editingTransaction.id), compraData);
    }
  };

  const handleDelete = (id: string) => {
    deleteCompra(parseInt(id));
  };

  const handleNewPurchase = (purchaseData: any) => {
    const compraData: Omit<CompraData, 'id'> = {
      tipo_ativo: purchaseData.tipo_ativo,
      ativo: purchaseData.ativo,
      data: format(purchaseData.data, "yyyy-MM-dd"),
      quantidade: purchaseData.quantidade,
      preco: purchaseData.preco,
      corretagem: purchaseData.corretagem,
      valor_total: purchaseData.valor_total,
    };
    
    addCompra(compraData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Navigation />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                B3 - Lançamentos de Compras
              </h1>
              <p className="text-text-secondary">
                Gerencie e visualize seu histórico de investimentos na bolsa brasileira
              </p>
            </div>
            <PurchaseForm onSubmit={handleNewPurchase} />
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
          Exibindo {filteredTransactions.length} de {transactions.length} transações
        </div>

        <TradingTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EditTransactionForm
          transaction={editingTransaction}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
};

export default Index;