import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export interface DividendTransaction {
  id: string;
  tipo_provento: string;
  ativo: string;
  data: string;
  valor: number;
  quantidade: number;
  a_receber: boolean;
}

interface DividendsTableProps {
  dividends: DividendTransaction[];
  onEdit: (dividend: DividendTransaction) => void;
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

const getProventoTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    'dividendos': 'Dividendos',
    'jscp': 'JCP',
    'bonificacao': 'Bonificação',
    'desdobramento': 'Desdobramento'
  };
  return labels[type] || type;
};

const DividendsTable = ({ dividends, onEdit, onDelete }: DividendsTableProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-text-primary">
          Histórico de Proventos
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-surface-hover">
              <TableHead className="text-text-secondary font-medium">Data</TableHead>
              <TableHead className="text-text-secondary font-medium">Tipo</TableHead>
              <TableHead className="text-text-secondary font-medium">Ativo</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Valor Unit.</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Qtd</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Total</TableHead>
              <TableHead className="text-text-secondary font-medium text-center">Status</TableHead>
              <TableHead className="text-text-secondary font-medium text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dividends.map((dividend) => {
              const totalValue = dividend.valor * dividend.quantidade;
              return (
                <TableRow 
                  key={dividend.id} 
                  className="border-border hover:bg-surface-hover"
                >
                  <TableCell className="text-text-primary">
                    {formatDate(dividend.data)}
                  </TableCell>
                  <TableCell className="text-text-primary">
                    {getProventoTypeLabel(dividend.tipo_provento)}
                  </TableCell>
                  <TableCell className="text-text-primary font-medium">
                    {dividend.ativo}
                  </TableCell>
                  <TableCell className="text-text-primary text-right">
                    {formatCurrency(dividend.valor)}
                  </TableCell>
                  <TableCell className="text-text-primary text-right">
                    {dividend.quantidade.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-text-primary text-right font-medium">
                    {formatCurrency(totalValue)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={dividend.a_receber ? "default" : "secondary"}
                      className={dividend.a_receber ? "bg-trading-blue text-white" : "bg-gray-100 text-gray-600"}
                    >
                      {dividend.a_receber ? "A receber" : "Recebido"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(dividend)}
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
                              Tem certeza que deseja excluir este provento? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(dividend.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DividendsTable;