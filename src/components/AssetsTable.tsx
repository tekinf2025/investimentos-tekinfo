import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface AssetTransaction {
  id: string;
  tipo_ativo: string;
  ativo: string;
  data: string;
  preco: number;
}

interface AssetsTableProps {
  assets: AssetTransaction[];
  onEdit: (asset: AssetTransaction) => void;
  onDelete: (id: string) => void;
  onPriceUpdate: (id: string, newPrice: number) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
};

const getAssetTypeLabel = (type: string): string => {
  const labels = {
    'acoes': 'Ações',
    'fundos_imobiliarios': 'Fundos Imobiliários',
    'renda_fixa': 'Renda Fixa'
  };
  return labels[type] || type;
};

const AssetsTable: React.FC<AssetsTableProps> = ({ assets, onEdit, onDelete, onPriceUpdate }) => {
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  const handlePriceEdit = (assetId: string, currentPrice: number) => {
    setEditingPrice(assetId);
    setTempPrice(currentPrice.toString());
  };

  const handlePriceSave = (assetId: string) => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onPriceUpdate(assetId, newPrice);
    }
    setEditingPrice(null);
    setTempPrice("");
  };

  const handlePriceCancel = () => {
    setEditingPrice(null);
    setTempPrice("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, assetId: string) => {
    if (e.key === 'Enter') {
      handlePriceSave(assetId);
    } else if (e.key === 'Escape') {
      handlePriceCancel();
    }
  };
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Lista de Ativos
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo de Ativo</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{formatDate(asset.data)}</TableCell>
              <TableCell>{getAssetTypeLabel(asset.tipo_ativo)}</TableCell>
              <TableCell className="font-medium">
                <a
                  href={`https://brapi.dev/quote/${asset.ativo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  {asset.ativo}
                </a>
              </TableCell>
              <TableCell className="text-right font-mono">
                {editingPrice === asset.id ? (
                  <div className="flex items-center gap-2 justify-end">
                    <Input
                      type="number"
                      step="0.01"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, asset.id)}
                      className="w-24 h-8 text-right"
                      autoFocus
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePriceSave(asset.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePriceCancel}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer hover:bg-muted/50 rounded p-1"
                    onClick={() => handlePriceEdit(asset.id, asset.preco)}
                    title="Clique para editar o preço"
                  >
                    {formatCurrency(asset.preco)}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(asset)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este ativo? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(asset.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {assets.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum ativo encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default AssetsTable;