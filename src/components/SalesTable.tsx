import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export interface SaleTransaction {
  id: string;
  tipo_ativo: string;
  ativo: string;
  data: string;
  quantidade: number;
  preco: number;
  corretagem: number;
  valor_total: number;
}

interface SalesTableProps {
  sales: SaleTransaction[];
  onEdit: (sale: SaleTransaction) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const getAssetTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    'acoes': 'Ações',
    'fundos_imobiliarios': 'Fundos Imobiliários',
    'renda_fixa': 'Renda Fixa'
  };
  return labels[type] || type;
};

const SalesTable = ({ sales, onEdit, onDelete }: SalesTableProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-text-primary">
          Histórico de Vendas
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-surface-hover">
              <TableHead className="text-text-secondary font-medium">Data</TableHead>
              <TableHead className="text-text-secondary font-medium">Tipo</TableHead>
              <TableHead className="text-text-secondary font-medium">Ativo</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Qtd</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Preço Unit.</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Outros Custos</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Total</TableHead>
              <TableHead className="text-text-secondary font-medium text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow 
                key={sale.id} 
                className="border-border hover:bg-surface-hover"
              >
                <TableCell className="text-text-primary">
                  {formatDate(sale.data)}
                </TableCell>
                <TableCell className="text-text-primary">
                  {getAssetTypeLabel(sale.tipo_ativo)}
                </TableCell>
                <TableCell className="text-text-primary font-medium">
                  {sale.ativo}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {sale.quantidade.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {formatCurrency(sale.preco)}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {formatCurrency(sale.corretagem)}
                </TableCell>
                <TableCell className="text-text-primary text-right font-medium">
                  {formatCurrency(sale.valor_total)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(sale)}
                      className="text-trading-blue hover:text-trading-blue hover:bg-surface-hover p-1 h-8 w-8"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-trading-red hover:text-trading-red hover:bg-surface-hover p-1 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(sale.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SalesTable;