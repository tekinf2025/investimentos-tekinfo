import { useState, useMemo } from "react";
import { format } from "date-fns";
import FilterBar from "@/components/FilterBar";
import AssetsTable, { AssetTransaction } from "@/components/AssetsTable";
import { AssetForm } from "@/components/AssetForm";
import { EditAssetForm } from "@/components/EditAssetForm";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useAtivos, AtivoData } from "@/hooks/useAtivos";
import Logo from "@/components/Logo";

const Assets = () => {
  const { toast } = useToast();
  const { ativos, isLoading, addAtivo, updateAtivo, deleteAtivo } = useAtivos();
  
  // Converter dados do Supabase para o formato esperado pelo componente
  const assets: AssetTransaction[] = ativos.map(ativo => ({
    id: ativo.id.toString(),
    tipo_ativo: ativo.tipo_ativo,
    ativo: ativo.ativo,
    data: ativo.data,
    preco: ativo.preco
  }));
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
      const ativoData: Omit<Partial<AtivoData>, 'id'> = {
        tipo_ativo: updatedData.tipo_ativo,
        ativo: updatedData.ativo,
        data: format(updatedData.data, "yyyy-MM-dd"),
        preco: updatedData.preco,
      };
      
      updateAtivo(parseInt(editingAsset.id), ativoData);
    }
  };

  const handleDelete = (id: string) => {
    deleteAtivo(parseInt(id));
  };

  const handlePriceUpdate = (id: string, newPrice: number) => {
    updateAtivo(parseInt(id), { preco: newPrice });
  };

  const handleNewAsset = (assetData: any) => {
    const ativoData: Omit<AtivoData, 'id'> = {
      tipo_ativo: assetData.tipo_ativo,
      ativo: assetData.ativo,
      data: format(assetData.data, "yyyy-MM-dd"),
      preco: assetData.preco,
    };
    
    addAtivo(ativoData);
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