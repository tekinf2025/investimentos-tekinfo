import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import TradingTable, { Transaction } from "@/components/TradingTable";
import { PurchaseForm } from "@/components/PurchaseForm";
import { EditTransactionForm } from "@/components/EditTransactionForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  
  // Dados das transações fornecidos pelo usuário
  const initialTransactions: Transaction[] = [
    {
      id: "1",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "GARE11",
      data: "2025-08-28",
      quantidade: 400,
      preco: 9.04,
      corretagem: 0,
      valor_total: 3616
    },
    {
      id: "2",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "MXRF11",
      data: "2025-08-27",
      quantidade: 4750,
      preco: 9.58,
      corretagem: 0,
      valor_total: 45505
    },
    {
      id: "3",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "MXRF11",
      data: "2025-08-26",
      quantidade: 250,
      preco: 9.58,
      corretagem: 0,
      valor_total: 2395
    },
    {
      id: "4",
      tipo_ativo: "acoes",
      ativo: "BBAS3",
      data: "2025-08-22",
      quantidade: 200,
      preco: 19.75,
      corretagem: 0,
      valor_total: 3950
    },
    {
      id: "5",
      tipo_ativo: "acoes",
      ativo: "GOAU4",
      data: "2024-01-01",
      quantidade: 3300,
      preco: 9.73,
      corretagem: 0,
      valor_total: 32109
    },
    {
      id: "6",
      tipo_ativo: "acoes",
      ativo: "PETR4",
      data: "2025-07-07",
      quantidade: 400,
      preco: 34.34,
      corretagem: 0,
      valor_total: 13736
    },
    {
      id: "7",
      tipo_ativo: "acoes",
      ativo: "BBAS3",
      data: "2024-06-01",
      quantidade: 700,
      preco: 24.86,
      corretagem: 0,
      valor_total: 17402
    },
    {
      id: "8",
      tipo_ativo: "renda_fixa",
      ativo: "Tesouro Selic 2029",
      data: "2022-10-05",
      quantidade: 3,
      preco: 13590,
      corretagem: 0,
      valor_total: 40770
    },
    {
      id: "9",
      tipo_ativo: "acoes",
      ativo: "BBAS3",
      data: "2025-07-23",
      quantidade: 300,
      preco: 20.25,
      corretagem: 0,
      valor_total: 6075
    }
  ];

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
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
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        tipo_ativo: updatedData.tipo_ativo,
        ativo: updatedData.ativo,
        data: format(updatedData.data, "yyyy-MM-dd"),
        quantidade: updatedData.quantidade,
        preco: updatedData.preco,
        corretagem: updatedData.corretagem,
        valor_total: updatedData.valor_total,
      };
      
      setTransactions(prev => 
        prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t)
      );
    }
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transação excluída",
      description: "A transação foi removida com sucesso.",
      variant: "destructive",
    });
  };

  const handleNewPurchase = (purchaseData: any) => {
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      tipo_ativo: purchaseData.tipo_ativo,
      ativo: purchaseData.ativo,
      data: format(purchaseData.data, "yyyy-MM-dd"),
      quantidade: purchaseData.quantidade,
      preco: purchaseData.preco,
      corretagem: purchaseData.corretagem,
      valor_total: purchaseData.valor_total,
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
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