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
import { useEffect } from "react";

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
  onStatusUpdate?: (id: string) => void;
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

const calculateDaysRemaining = (dateString: string) => {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const DividendsTable = ({ dividends, onEdit, onDelete, onStatusUpdate }: DividendsTableProps) => {
  
  useEffect(() => {
    // Verificar proventos que devem ter status atualizado
    dividends.forEach(dividend => {
      if (dividend.a_receber) {
        const daysRemaining = calculateDaysRemaining(dividend.data);
        if (daysRemaining <= 0 && onStatusUpdate) {
          onStatusUpdate(dividend.id);
        }
      }
    });
  }, [dividends, onStatusUpdate]);
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Histórico de Proventos
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
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
              const daysRemaining = dividend.a_receber ? calculateDaysRemaining(dividend.data) : 0;
              
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
                    {dividend.a_receber ? (
                      <div className="flex flex-col items-center gap-1">
                        <Badge 
                          variant="default"
                          className={daysRemaining <= 0 ? "bg-trading-red text-white" : "bg-trading-blue text-white"}
                        >
                          A receber
                        </Badge>
                        <span className={`text-xs ${daysRemaining <= 0 ? "text-trading-red font-semibold" : "text-text-secondary"}`}>
                          {daysRemaining > 0 ? `${daysRemaining} dias` : daysRemaining === 0 ? "Hoje" : "Vencido"}
                        </span>
                      </div>
                    ) : (
                      <Badge 
                        variant="secondary"
                        className="bg-gray-100 text-gray-600"
                      >
                        Recebido
                      </Badge>
                    )}
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