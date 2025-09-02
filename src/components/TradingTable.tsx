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

export interface Transaction {
  id: string;
  tipo_ativo: string;
  ativo: string;
  data: string;
  quantidade: number;
  preco: number;
  corretagem: number;
  valor_total: number;
}

interface TradingTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
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

const TradingTable = ({ transactions, onEdit, onDelete }: TradingTableProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Histórico de Compras
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
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
            {transactions.map((transaction) => (
              <TableRow 
                key={transaction.id} 
                className="border-border hover:bg-surface-hover"
              >
                <TableCell className="text-text-primary">
                  {formatDate(transaction.data)}
                </TableCell>
                <TableCell className="text-text-primary">
                  {getAssetTypeLabel(transaction.tipo_ativo)}
                </TableCell>
                <TableCell className="text-text-primary font-medium">
                  {transaction.ativo}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {transaction.quantidade.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {formatCurrency(transaction.preco)}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {formatCurrency(transaction.corretagem)}
                </TableCell>
                <TableCell className="text-text-primary text-right font-medium">
                  {formatCurrency(transaction.valor_total)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
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
                            Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(transaction.id)}>
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

export default TradingTable;