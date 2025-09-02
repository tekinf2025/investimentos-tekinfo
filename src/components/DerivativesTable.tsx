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
import { Badge } from "@/components/ui/badge";
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

export interface DerivativeTransaction {
  id: string;
  data: string;
  tipo_operacao: string;
  tipo_derivativo: string;
  ativo_subjacente: string;
  codigo_opcao: string;
  strike: number;
  vencimento: string;
  quantidade: number;
  premio: number;
  status: string;
  valor_total: number;
}

interface DerivativesTableProps {
  derivatives: DerivativeTransaction[];
  onEdit: (derivative: DerivativeTransaction) => void;
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

const getOperationTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    'compra': 'Compra',
    'venda': 'Venda'
  };
  return labels[type] || type;
};

const getDerivativeTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    'call': 'Call',
    'put': 'Put'
  };
  return labels[type] || type;
};

const getStatusBadge = (status: string) => {
  const variant = status === "aberta" ? "default" : "secondary";
  const label = status === "aberta" ? "Aberta" : "Fechada";
  
  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  );
};

const DerivativesTable = ({ derivatives, onEdit, onDelete }: DerivativesTableProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          Histórico de Derivativos
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="border-border hover:bg-surface-hover">
              <TableHead className="text-text-secondary font-medium">Data</TableHead>
              <TableHead className="text-text-secondary font-medium">Operação</TableHead>
              <TableHead className="text-text-secondary font-medium">Tipo</TableHead>
              <TableHead className="text-text-secondary font-medium">Ativo</TableHead>
              <TableHead className="text-text-secondary font-medium">Código</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Strike</TableHead>
              <TableHead className="text-text-secondary font-medium">Vencimento</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Qtd</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Prêmio</TableHead>
              <TableHead className="text-text-secondary font-medium text-center">Status</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Total</TableHead>
              <TableHead className="text-text-secondary font-medium text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {derivatives.map((derivative) => (
              <TableRow 
                key={derivative.id} 
                className="border-border hover:bg-surface-hover"
              >
                <TableCell className="text-text-primary">
                  {formatDate(derivative.data)}
                </TableCell>
                <TableCell className="text-text-primary">
                  {getOperationTypeLabel(derivative.tipo_operacao)}
                </TableCell>
                <TableCell className="text-text-primary">
                  {getDerivativeTypeLabel(derivative.tipo_derivativo)}
                </TableCell>
                <TableCell className="text-text-primary font-medium">
                  {derivative.ativo_subjacente}
                </TableCell>
                <TableCell className="text-text-primary font-mono text-sm">
                  <a 
                    href={`https://opcoes.net.br/${derivative.codigo_opcao}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-trading-blue hover:text-trading-blue-dark underline hover:no-underline transition-colors"
                  >
                    {derivative.codigo_opcao}
                  </a>
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {formatCurrency(derivative.strike)}
                </TableCell>
                <TableCell className="text-text-primary">
                  {formatDate(derivative.vencimento)}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {derivative.quantidade.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="text-text-primary text-right">
                  {formatCurrency(derivative.premio)}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(derivative.status)}
                </TableCell>
                <TableCell className="text-text-primary text-right font-medium">
                  {formatCurrency(derivative.valor_total)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(derivative)}
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
                            Tem certeza que deseja excluir esta operação de derivativo? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(derivative.id)}>
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

export default DerivativesTable;