import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import AssetsTable, { AssetTransaction } from "@/components/AssetsTable";
import { AssetForm } from "@/components/AssetForm";
import { EditAssetForm } from "@/components/EditAssetForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Assets = () => {
  const { toast } = useToast();
  
  // Dados dos ativos fornecidos pelo usuário
  const initialAssets: AssetTransaction[] = [
    {
      id: "1",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "GARE11",
      data: "2025-08-29",
      preco: 9.04
    },
    {
      id: "2",
      tipo_ativo: "fundos_imobiliarios",
      ativo: "MXRF11",
      data: "2025-08-29",
      preco: 9.58
    },
    {
      id: "3",
      tipo_ativo: "acoes",
      ativo: "BBAS3",
      data: "2025-08-29",
      preco: 19.75
    },
    {
      id: "4",
      tipo_ativo: "acoes",
      ativo: "GOAU4",
      data: "2025-08-29",
      preco: 9.73
    },
    {
      id: "5",
      tipo_ativo: "acoes",
      ativo: "PETR4",
      data: "2025-08-29",
      preco: 34.34
    }
  ];

  // Carregar dados do localStorage ou usar dados iniciais
  const loadAssetsFromStorage = (): AssetTransaction[] => {
    const stored = localStorage.getItem('assets-data');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialAssets;
      }
    }
    return initialAssets;
  };

  const [assets, setAssets] = useState<AssetTransaction[]>(loadAssetsFromStorage);
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [assetFilter, setAssetFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [editingAsset, setEditingAsset] = useState<AssetTransaction | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Lista única de ativos para o filtro
  const uniqueAssets = useMemo(() => {
    const assetNames = [...new Set(assets.map(t => t.ativo))];
    return assetNames.sort();
  }, [assets]);

  // Ativos filtrados
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = searchTerm === "" || 
        asset.ativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tipo_ativo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAssetType = assetTypeFilter === "all" || 
        asset.tipo_ativo === assetTypeFilter;
      
      const matchesAsset = assetFilter === "all" || 
        asset.ativo === assetFilter;
      
      const matchesPeriod = periodFilter === "all" || 
        asset.data.startsWith(periodFilter);

      return matchesSearch && matchesAssetType && matchesAsset && matchesPeriod;
    });
  }, [assets, searchTerm, assetTypeFilter, assetFilter, periodFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setAssetTypeFilter("all");
    setAssetFilter("all");
    setPeriodFilter("all");
  };

  const handleEdit = (asset: AssetTransaction) => {
    setEditingAsset(asset);
    setShowEditForm(true);
  };

  const handleEditSubmit = (updatedData: any) => {
    if (editingAsset) {
      const updatedAsset: AssetTransaction = {
        ...editingAsset,
        tipo_ativo: updatedData.tipo_ativo,
        ativo: updatedData.ativo,
        data: format(updatedData.data, "yyyy-MM-dd"),
        preco: updatedData.preco,
      };
      
      const newAssets = assets.map(t => t.id === editingAsset.id ? updatedAsset : t);
      updateAssets(newAssets);
    }
  };

  // Salvar no localStorage sempre que assets mudar
  const updateAssets = (newAssets: AssetTransaction[]) => {
    setAssets(newAssets);
    localStorage.setItem('assets-data', JSON.stringify(newAssets));
    // Disparar evento personalizado para notificar outras páginas
    window.dispatchEvent(new CustomEvent('assets-data-updated'));
  };

  const handleDelete = (id: string) => {
    const newAssets = assets.filter(t => t.id !== id);
    updateAssets(newAssets);
    toast({
      title: "Ativo excluído",
      description: "O ativo foi removido com sucesso.",
      variant: "destructive",
    });
  };

  const handlePriceUpdate = (id: string, newPrice: number) => {
    const newAssets = assets.map(asset => 
      asset.id === id ? { ...asset, preco: newPrice } : asset
    );
    updateAssets(newAssets);
    toast({
      title: "Preço atualizado",
      description: "O preço do ativo foi atualizado com sucesso.",
    });
  };

  const handleNewAsset = (assetData: any) => {
    const newAsset: AssetTransaction = {
      id: (assets.length + 1).toString(),
      tipo_ativo: assetData.tipo_ativo,
      ativo: assetData.ativo,
      data: format(assetData.data, "yyyy-MM-dd"),
      preco: assetData.preco,
    };
    
    updateAssets([newAsset, ...assets]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Navigation />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                B3 - Cadastro de Ativos
              </h1>
              <p className="text-text-secondary">
                Gerencie e visualize os preços dos ativos da bolsa brasileira
              </p>
            </div>
            <AssetForm onSubmit={handleNewAsset} />
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
          Exibindo {filteredAssets.length} de {assets.length} ativos
        </div>

        <AssetsTable
          assets={filteredAssets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPriceUpdate={handlePriceUpdate}
        />

        <EditAssetForm
          asset={editingAsset}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
};

export default Assets;